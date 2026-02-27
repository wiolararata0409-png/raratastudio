import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  // Stripe wysyła POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig =
    event.headers["stripe-signature"] || event.headers["Stripe-Signature"];

  if (!sig) {
    return { statusCode: 400, body: "Missing Stripe-Signature header" };
  }

  // WAŻNE: Stripe wymaga "surowego" body (RAW), nie JSON.parse
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    // Po udanej płatności
    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;

      // To przyjdzie z parametru Payment Linka: ?client_reference_id=USER_ID
      const userId = session.client_reference_id;

      if (!userId) {
        console.warn("No client_reference_id on session", session.id);
        return { statusCode: 200, body: "No client_reference_id (ignored)" };
      }

      const stripeCustomerId = session.customer || null;
      const stripeSubscriptionId = session.subscription || null;

      // Ustaw premium w tabeli "subscriptions" (tej ze zdjęcia 2)
      const { error } = await supabaseAdmin
        .from("subscriptions")
        .upsert(
          {
            user_id: userId,
            is_active: true,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
          },
          { onConflict: "user_id" }
        );

      if (error) {
        console.error("❌ Supabase update error:", error);
        return { statusCode: 500, body: "DB update failed" };
      }

      console.log("✅ Premium activated for user:", userId);
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return { statusCode: 500, body: "Server error" };
  }
};
