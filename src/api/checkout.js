import Stripe from 'stripe';
import chargeModels from '../models/charge.js';
const { chargeOrder, chargeApp,chargeHardware } = chargeModels;
let stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
// export const getCustomerOrders = async (req, res) => {
//   let filter = {}
//   if (req.query.userId) {
//       filter = { userId: req.query.userId.split(',') }
//   }
//   let customerOrderData = await chargModal.find(filter).populate('userId')
//   res.send(customerOrderData);

// }
// export const getAppCharge = async (req, res) => {
//   let filter = {}
//   if (req.query.superUserId) {
//       filter = { superUserId: req.query.superUserId.split(',') }
//   }
//   let appData = await chargeModal.find(filter).populate('superUserId')
//   res.send(appData);

// }
// export const getHardwareCharge = async (req, res) => {
//   let filter = {}
//   if (req.query.chargeFor) {
//       filter = { chargeFor: req.query.chargeFor.split(',') }
//   }
//   let hardwareOrderData = await chargHardware.find(filter).populate('superUserId')
//   res.send(hardwareOrderData);

// }
export const Checkout = async (req, res) => {
  const { amount, currency, source, application_fee_amount, transfer_data, description } = req.body.stripeToken;

  console.log("req body stripe charge", req.body);
  // Create the charge with the connected account ID and application fee
  const charge = await stripe.charges.create({
    amount,
    currency,
    source,
    description,
    application_fee_amount,
    transfer_data
    // "transfer_data": {
    //   "destination": connectedAccountId
    // }
  }).then(async (resCharge) => {
    console.log('charge: ', resCharge);
    await new chargeOrder({ charge: JSON.stringify(resCharge), userId: req.body.userId ,superUserId:req.body.superUserId}).save().then(resSavedCharge => {
      console.log('charge data saved to database: ', resSavedCharge);
      res.json({ message: 'Customer Charge Successfull And Data Saved!', resCharge, resSavedCharge });
    })
  }).catch(err => {
    console.error(err);
    res.status(500).json({ err: 'Failed to create charge' });
  })


};
export const createChargeUser = async (req, res) => {
  const { source, amount, currency, description } = req.body.stripeToken

  console.log('req.body: ', req.body);
  await stripe.charges.create({
    amount,
    currency,
    description,
    source
  }).then(async (resCharge) => {
    console.log('charge: ', resCharge);
    await new chargeApp({ charge: JSON.stringify(resCharge), superUserId: req.body.superUserId, userId: req.body.userId,plan:req.body.plan }).save().then(resSavedCharge => {
      console.log('charge data saved to database: ', resSavedCharge);
      res.json({ message: 'User Charge Successfull And Data Saved!', resCharge, resSavedCharge });
    })
  }).catch(err => {
    console.error(err);
    res.status(500).json({ err: 'Failed to create charge' });
  })
}
export const createChargeHardware = async (req, res) => {
  const { source, amount, currency, description } = req.body.stripeToken

  console.log('req.body: ', req.body);
  await stripe.charges.create({
    amount,
    currency,
    description,
    source
  }).then(async (resCharge) => {
    console.log('charge: ', resCharge);
    await new chargeHardware({ charge: JSON.stringify(resCharge), superUserId: req.body.superUserId,plan:req.body.plan}).save().then(resSavedCharge => {
      console.log('hardware data saved to database: ', resSavedCharge);
      res.json({ message: 'hardware Charge Successfull And Data Saved!', resCharge, resSavedCharge });
    })
  }).catch(err => {
    console.error(err);
    res.status(500).json({ err: 'Failed to create charge' });
  })
}
