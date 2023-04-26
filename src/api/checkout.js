import Stripe from 'stripe';
let stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
export const Checkout = async (req, res) => {
  try {
    const { amount, source, connectedAccountId,application_fee_amount } = req.body;
  
    // Create the charge with the connected account ID and application fee
    const charge = await stripe.charges.create({
      "amount": amount,
      "currency": "usd",
      "source": source,
      // "description": "Example charge",
      "application_fee_amount": application_fee_amount,
      "transfer_data": {
        "destination": connectedAccountId
      }
    });
    // const charge = await stripe.charges.create({
    //     amount,
    //     currency: 'usd',
    //     source,
    //     application_fee_amount: amount * 100, // Replace with your desired application fee percentage
    //     transfer_data: {
    //       destination: connectedAccountId,
    //     },
    //   });
  
      res.json({ message: 'Charge successfully created!', charge });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong', error });
    }
};