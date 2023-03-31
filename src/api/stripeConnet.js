import dotenv from 'dotenv'
import Stripe from 'stripe';

dotenv.config();
let stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');

export const createAccount = async (req, res) => {
  const account = await stripe.accounts.create({
    type: 'express',
  });

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: process.env.redirect_url,
    return_url: process.env.redirect_url,
    type: 'account_onboarding',
  });

  res.json({ accountLink: accountLink.url });
};
// // const account = await stripe.accounts.create({type: 'express'});
// async function createStripeConnectAccount(user) {
//   const account = await stripe.accounts.create({
//     type: 'express',
//     country: 'US',
//     email: user.email,
//     capabilities: {
//       card_payments: {
//         requested: true,
//       },
//       transfers: {
//         requested: true,
//       },
//     },
//   });

//   // Store the account ID in your database for future use
//   user.stripeAccountId = account.id;
//   await user.save();

//   // Create an account link to connect the user's account
//   const accountLink = await stripe.accountLinks.create({
//     account: account.id,
//     refresh_url: 'https://example.com/reauth',
//     return_url: 'https://example.com/return',
//     type: 'account_onboarding',
//   });

//   // Return the account link URL for the user to click
//   return accountLink.url;
// }