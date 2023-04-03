import dotenv from 'dotenv'
import Stripe from 'stripe';

dotenv.config();
let stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');

// export const createAccount = async (req, res) => {
//   const account = await stripe.accounts.create({
//     type: 'express',
//   });

//   const accountLink = await stripe.accountLinks.create({
//     account: account.id,
//     refresh_url: process.env.redirect_url,
//     return_url: process.env.redirect_url,
//     type: 'account_onboarding',
//   });

//   res.json({ accountLink: accountLink.url });
// };
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
// Create a custom account for a new seller
export const createSellerAccount = async (req, res) => {
  const { email, country, account_type } = req.body;

  try {
    const account = await stripe.accounts.create({
      type: account_type || 'custom',
      country,
      email,
      capabilities: {
        // Enable these capabilities in your account:
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      // account_token: 'SOME_SECRET_TOKEN',
      // business_type: account_type,
    });
    console.log('account: ', account);

    // Store the account ID in your database
    const accountID = account.id;
    console.log('accountID: ', accountID);

    // Set the account type (i.e. individual or business) and the seller's internal ID in metadata
    // await stripe.accounts.update(accountID, {
    //   metadata: {
    //     account_type,
    //     seller_id: '123456789',
    //   },
    // });

    res.send({ account_id: accountID });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

// Handle seller authorization after they've connected their Stripe account
export const authorizeSeller=async (req, res) => {
  const { code } = req.query;

  try {
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    // Save the access token and refresh token to your database
    const { access_token, refresh_token, stripe_user_id } = response;

    // Redirect the seller to a page confirming their account has been connected 
    res.redirect('/confirm-account-linked');
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};
export const getSellerBalance= async (req, res) => {
  const { account_id } = req.params;

  try {
    const balance = await stripe.balance.retrieve({
      stripe_account: account_id,
    });

    // Return the balance information to the client
    res.send(balance);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};
