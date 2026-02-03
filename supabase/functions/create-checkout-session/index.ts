import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface CheckoutRequest {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Validate Stripe API key
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

    if (!STRIPE_SECRET_KEY) {
      console.error("STRIPE_SECRET_KEY is not configured");
      return new Response(
        JSON.stringify({
          error: "Stripe is not configured. Please contact support.",
          details: "STRIPE_SECRET_KEY environment variable is missing"
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract user ID from JWT if provided
    let userId = "anonymous";
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const jwt = token.split(".")[1];
        const payload = JSON.parse(atob(jwt));
        userId = payload.sub;
      } catch (e) {
        console.warn("Could not parse JWT:", e);
      }
    }

    console.log("Creating checkout session for user:", userId);

    // Parse request body
    const { priceId, successUrl, cancelUrl }: CheckoutRequest = await req.json();

    console.log("Price ID:", priceId);
    console.log("Success URL:", successUrl);
    console.log("Cancel URL:", cancelUrl);

    // Validate required parameters
    if (!priceId || !successUrl || !cancelUrl) {
      console.error("Missing required parameters");
      return new Response(
        JSON.stringify({
          error: "Missing required parameters",
          details: "priceId, successUrl, and cancelUrl are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Stripe checkout session
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price]": priceId,
        "line_items[0][quantity]": "1",
        "mode": "subscription",
        "success_url": successUrl,
        "cancel_url": cancelUrl,
        "client_reference_id": userId,
        "metadata[user_id]": userId,
      }),
    });

    const session = await response.json();

    if (!response.ok) {
      console.error("Stripe API error:", JSON.stringify(session));

      // Return detailed error from Stripe
      return new Response(
        JSON.stringify({
          error: session.error?.message || "Failed to create checkout session",
          details: session.error?.type || "stripe_error",
          stripeError: session.error
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Checkout session created successfully:", session.id);

    return new Response(
      JSON.stringify({
        sessionId: session.id,
        url: session.url
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);

    return new Response(
      JSON.stringify({
        error: error.message || "An unexpected error occurred",
        details: error.toString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
