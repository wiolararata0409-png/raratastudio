const Stripe = require("stripe");

exports.handler = async (event) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { customerId } = JSON.parse(event.body);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://raratastudio.netlify.app",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
