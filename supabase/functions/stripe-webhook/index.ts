import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, stripe-signature",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") || "";
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(
        JSON.stringify({ error: "Missing stripe-signature header" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.text();

    const event = await verifyStripeWebhook(body, signature);

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const userId = session.metadata?.user_id || session.client_reference_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        const { data: subscription } = await fetch(
          `https://api.stripe.com/v1/subscriptions/${subscriptionId}`,
          {
            headers: {
              "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
            },
          }
        ).then(res => res.json());

        const priceId = subscription.items.data[0].price.id;
        const amountPence = subscription.items.data[0].price.unit_amount;

        const expiresAt = new Date(subscription.current_period_end * 1000);

        await supabase
          .from("subscriptions")
          .upsert({
            user_id: userId,
            plan_type: "premium",
            price_pence: amountPence,
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            started_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            is_active: true,
          }, { onConflict: "user_id" });

        await supabase.from("payment_history").insert({
          user_id: userId,
          stripe_payment_intent_id: session.payment_intent,
          amount_pence: amountPence,
          currency: "gbp",
          status: "succeeded",
          plan_type: "premium",
        });

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (existingSub) {
          const expiresAt = new Date(subscription.current_period_end * 1000);

          await supabase
            .from("subscriptions")
            .update({
              expires_at: expiresAt.toISOString(),
              is_active: subscription.status === "active",
            })
            .eq("stripe_customer_id", customerId);
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        await supabase
          .from("subscriptions")
          .update({
            is_active: false,
            expires_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function verifyStripeWebhook(body: string, signature: string) {
  const encoder = new TextEncoder();
  const parts = signature.split(",");
  const timestamp = parts.find(p => p.startsWith("t="))?.split("=")[1];
  const expectedSig = parts.find(p => p.startsWith("v1="))?.split("=")[1];

  const payload = `${timestamp}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(STRIPE_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature_buffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload)
  );

  const computedSig = Array.from(new Uint8Array(signature_buffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  if (computedSig !== expectedSig) {
    throw new Error("Invalid signature");
  }

  return JSON.parse(body);
}
