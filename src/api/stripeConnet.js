import dotenv from 'dotenv'

dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createStripeConnectAccount(user) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: user.email,
    capabilities: {
      card_payments: {
        requested: true,
      },
      transfers: {
        requested: true,
      },
    },
  });

  // Store the account ID in your database for future use
  user.stripeAccountId = account.id;
  await user.save();

  // Create an account link to connect the user's account
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://example.com/reauth',
    return_url: 'https://example.com/return',
    type: 'account_onboarding',
  });

  // Return the account link URL for the user to click
  return accountLink.url;
}