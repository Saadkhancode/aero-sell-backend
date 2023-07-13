import dotenv from 'dotenv'
import Stripe from 'stripe';
dotenv.config();
if (process.env.NODE_ENV === 'production') {
  var stripe = Stripe('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');
} else if (process.env.NODE_ENV === 'development') {
  var stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
}
export const terminalConnection = async (req, res) => {
  const { display_name, address, stripeAccount, registration_code, label } = req.body
  try {
    let location, reader, connectionToken;
    // Create a location for the connected account
    try {
      location = await stripe.terminal.locations.create(
        {
          display_name,
          address,
        },
        {
          stripeAccount,
        }
      );
    } catch (error) {
      console.error('Error creating location:', error);
      res.status(500).json({ error: 'An error occurred while creating location' });
      return;
    }

    // Create a reader registered to the connected account using the location ID
    try {
      reader = await stripe.terminal.readers.create(
        {
          registration_code,
          label,
          location: location.id,
        },
        {
          stripeAccount,
        }
      );
    } catch (error) {
      console.error('Error creating reader:', error);
      res.status(500).json({ error: 'An error occurred while creating reader' });
      return;
    }

    // Create a connection token for the Terminal SDK using the location ID
    try {
      connectionToken = await stripe.terminal.connectionTokens.create(
        {
          location: location.id,
        },
        {
          stripeAccount,
        }
      );
    } catch (error) {
      console.error('Error creating connection token:', error);
      res.status(500).json({ error: 'An error occurred while creating connection token' });
      return;
    }

    res.json({
      location,
      reader,
      connectionToken,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
}
export const orderPaymentIntent = async (req, res) => {
  let paymentIntent,capturePaymentIntent ;
  const { amount, currency, transfer_data, application_fee_amount ,on_behalf_of} = req.body
  try {
    paymentIntent = await stripe.paymentIntents.create(
      {
        amount,
        currency,
        payment_method_types: [
          'card_present',
        ],
        capture_method: 'manual',
        application_fee_amount,
        on_behalf_of,
        transfer_data
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
    return;
  }
  try {
    capturePaymentIntent = await stripe.paymentIntents.capture(paymentIntent.id);
    res.json(paymentIntent,capturePaymentIntent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};