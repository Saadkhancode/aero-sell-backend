import dotenv from 'dotenv'
import Stripe from 'stripe';
dotenv.config();
if (process.env.NODE_ENV === 'production') {
  var stripe = Stripe('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');
} else if (process.env.NODE_ENV === 'development') {
  var stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
}
export const terminalConnection= async (req, res) => {
    try {
      const location = await stripe.terminal.locations.create(
        {
          display_name: 'HQ',
          address: {
            line1: '1272 Valencia Street',
            city: 'San Francisco',
            state: 'CA',
            country: 'US',
            postal_code: '94110',
          },
        },
        {
          stripeAccount: 'acct_1NJCJTFKHfuAa72U',
        }
      );
  
      const reader = await stripe.terminal.readers.create(
        {
          registration_code: 'READER_REGISTRATION_CODE',
          label: "Alice's Reader",
          location: location.id,
        },
        {
          stripeAccount: 'acct_1NJCJTFKHfuAa72U',
        }
      );
  
      const connectionToken = await stripe.terminal.connectionTokens.create(
        {
          location: location.id,
        },
        {
          stripeAccount: 'acct_1NJCJTFKHfuAa72U',
        }
      );
  
    //   const intent = await stripe.paymentIntents.create(
    //     {
    //       amount: 1000,
    //       currency: 'usd',
    //       payment_method_types: ['card_present'],
    //       capture_method: 'manual',
    //     },
    //     {
    //       stripeAccount: 'acct_1NJCJTFKHfuAa72U',
    //     }
    //   );
  
      res.json({
        location,
        reader,
        connectionToken
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };
  export const orderPaymentIntent=async (req, res) => {
    try {
      const intent = await stripe.paymentIntents.create(
        {
          amount: 1000,
          currency: 'usd',
          payment_method_types: ['card_present'],
          capture_method: 'manual',
        },
        {
          stripeAccount: 'acct_1NJCJTFKHfuAa72U',
        }
      );
      res.json(intent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  };