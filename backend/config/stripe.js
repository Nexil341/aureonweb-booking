
const Stripe = require("stripe");

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Brak STRIPE_SECRET_KEY w .env");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = stripe;
