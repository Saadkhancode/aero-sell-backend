import Stripe from 'stripe';
let stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
export const Checkout = async (req, res) => {
  try {
    const customer = await stripe.customers.create({
      email: req.body.token.email,
      // email: "saad@gmail.com",
      source: req.body.token.id
    }).then((customer) => {
      return stripe.charges.create({
        amount: 1000,
        description: "Test Purchase using express and Node",
        currency: "USD",
        customer: customer.id,
      });
    }).catch(e => {
      console.error("Err ", e)
    })
      .then((charge) => {
        res.json({
          data: "success"
        })
      })
      .catch((err) => {
        res.json({
          data: err,
        });
      });
    return true;
  } catch (error) {
    return false;
  }
};