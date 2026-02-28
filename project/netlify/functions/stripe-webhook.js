import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 1) Bierzemy token zalogowanego usera z frontendu
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing Authorization token" }),
      };
    }

    // 2) Sprawdzamy usera po tokenie
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Invalid token" }),
      };
    }

    const userId = userData.user.id;

    // 3) Bierzemy stripe_customer_id z tabeli subscriptions
    const { data: sub, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .single();

    if (subError || !sub?.stripe_customer_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No Stripe customer for this user" }),
      };
    }

    // 4) Tworzymy link do Stripe Customer Portal
    const origin =
      event.headers.origin ||
      event.headers.Origin ||
      process.env.SITE_URL ||
      "https://raratastudio.netlify.app";

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: origin,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
      headers: { "Content-Type": "application/json" },
    };
  } catch (err) {
    console.error("create-portal-session error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
      headers: { "Content-Type": "application/json" },
    };
  }
};
