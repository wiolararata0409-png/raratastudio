const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { plan, user_id } = event.queryStringParameters || {};

    if (!plan || !user_id) {
      return {
        statusCode: 400,
        body: "Missing plan or user_id",
      };
    }

    const priceId =
      plan === "monthly"
        ? process.env.VITE_STRIPE_MONTHLY_PRICE_ID
        : process.env.VITE_STRIPE_YEARLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL}/?success=true`,
      cancel_url: `${process.env.URL}/?canceled=true`,
      metadata: {
        user_id,
      },
    });

    return {
      statusCode: 302,
      headers: {
        Location: session.url,
      },
      body: "",
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: "Stripe error",
    };
  }
};
