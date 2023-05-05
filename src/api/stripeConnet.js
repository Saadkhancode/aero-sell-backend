import dotenv from 'dotenv'
import { User } from '../models/User.js'
import Stripe from 'stripe';

dotenv.config();
let stripe = Stripe('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');

// Create a custom account for a new seller
export const createSellerAccount = async (req, res) => {
  const { userId } = req.query
  console.log('userId: ', userId);
  const userById = await User.findById(userId)
  console.log('userById: ', userById);

  try {
    const account = await stripe.accounts.create({
      type: 'express',
    });
    console.log('account: ', account);
    const accountID = account.id;
    console.log('accountID: ', accountID);
    if (userById) {
      const userData = await User.findByIdAndUpdate(userById, { $set: { "stripe_account_id": accountID } })
      console.log(' userData after update : ', userData);
    }
    res.send({ account_id: accountID });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
};

// Handle seller authorization after they've connected their Stripe account
export const authorizeSeller = async (req, res) => {
  const { code } = req.query;
  const { userId } = req.params;
  console.log('userId: ', userId);
  const userById = await User.findById(userId)
  console.log('userById: ', userById);

  try {
    const response = await stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });

    // Save the access token and refresh token to your database
    const { access_token, refresh_token, stripe_user_id } = response;
    if (userById) {
      const userData = await User.findByIdAndUpdate(userById, { $set: { "stripe_account_id": stripe_user_id, "stripe_refresh_token": refresh_token, "stripe_acess_token": access_token } })
      console.log(' userData after update : ', userData);
    }
    res.json({
      access_token,
      refresh_token,
      stripe_user_id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: err.message,
    });
  }
};
export const getSellerBalance = async (req, res) => {
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
