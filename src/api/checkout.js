import Stripe from 'stripe';
let stripe = Stripe('sk_test_51MhRsBSCuFBKzU4Ys3lReEF2JrFrZvzQMovT0BC0AIRgGSS22MEAjJvzB6PAYtoiEhp9v63aVBnvgUB0U48yHHey00RPayJhTa');
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