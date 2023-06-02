import dotenv from 'dotenv'
import Stripe from 'stripe';
import chargeModels from '../models/charge.js';
const { chargeOrder, chargeApp, chargeHardware } = chargeModels;
dotenv.config();
if (process.env.NODE_ENV === 'production') {
  var stripe = Stripe('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');
} else if (process.env.NODE_ENV === 'development') {
  var stripe = Stripe('sk_test_51MiZTVF1YkHoz4Y5AsHfg9ovHa5zsRFHCfVrHSy5XKvxKtdKSMHpzQ5V0wEfcGHVfoEQ50NjXhCP0aF2aC1Mc05300eCAJlRxu');
}


export const Checkout = async (req, res) => {
  const { amount, currency, source, application_fee_amount, transfer_data, description, metadata } = req.body.stripeToken;

  console.log("req body stripe charge", req.body);
  // Create the charge with the connected account ID and application fee
  await stripe.charges.create({
    amount,
    currency,
    source,
    description,
    application_fee_amount,
    transfer_data,
    metadata
  }).then(async (resCharge) => {
    console.log('charge: ', resCharge);
    await new chargeOrder({ charge: JSON.stringify(resCharge), userId: req.body.userId, superUserId: req.body.superUserId }).save().then(resSavedCharge => {
      console.log('charge data saved to database: ', resSavedCharge);
      res.json({ message: 'Customer Charge Successfull And Data Saved!', resCharge, resSavedCharge });
    })
  }).catch(err => {
    console.error(err);
    res.status(500).json({ err: 'Failed to create charge' });
  })


};
async function getProductByName(name) {
  const products = await stripe.products.list();
  const product = products.data.find((p) => p.name === name);
  return product;
}
export const createAppSubscription = async (req, res) => {
  const { email, name, metadata, amount, currency, interval, product, type, card } = req.body.stripeToken;
  let customer = null;

  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({ email: email }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to list existing customers' });
  });
  
  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    // Create new customer
    customer = await stripe.customers.create({
      email,
      name,
      metadata
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create customer' });
    });
  }
  
  console.log('customer: ', customer);
  
  // Create payment method
  const paymentMethod = await stripe.paymentMethods.create({
    type,
    card,
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to create payment method' });
  });

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customer.id,
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to attach payment method' });
  });

  // Set payment method as default
  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to update customer' });
  });

  console.log('product.name: ', product.name);
  let products = null;
  
  await getProductByName(product.name)
    .then((product) => {
      products = product;
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to get product by name' });
    });
  
  console.log('product: ', products);

  // Check if app plan already exists
  let appPlan = null;
  const existingPlans = await stripe.plans.list({ product: products.id }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to list existing plans' });
  });

  console.log('existingPlans: ', existingPlans);

  if (existingPlans.data.length > 0) {
    appPlan = existingPlans.data[0];
    console.log('appPlan in if: ', appPlan);
  } else {
    // Create new app plan
    appPlan = await stripe.plans.create({
      amount,
      currency,
      interval,
      product: {
        name: products.name
      },
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create app plan' });
    });

    console.log('appPlanin else : ', appPlan);
  }

  // Create subscription for the customer with app plan
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: appPlan.id }]
  }).then(resSubs => {
    console.log('subscription: ', resSubs);
    res.json({ message: 'Subscription Successful!', resSubs });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subscription' });
  });
};

export const createHardwareSubscription = async (req, res) => {
  const { email, name, metadata, amount, currency, interval, product, type, card } = req.body.stripeToken;
  let customer = null;

  // Check if customer already exists
  const existingCustomers = await stripe.customers.list({ email: email }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to list existing customers' });
  });
  
  if (existingCustomers.data.length > 0) {
    customer = existingCustomers.data[0];
  } else {
    // Create new customer
    customer = await stripe.customers.create({
      email,
      name,
      metadata
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create customer' });
    });
  }

  // Create payment method
  const paymentMethod = await stripe.paymentMethods.create({
    type,
    card,
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Enter Valid Card Number' });
  });

  // Attach payment method to customer
  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customer.id,
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to attach payment method' });
  });

  // Set payment method as default
  await stripe.customers.update(customer.id, {
    invoice_settings: {
      default_payment_method: paymentMethod.id,
    },
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to update customer' });
  });

  console.log('product.name: ', product.name);
  let products = null;

  await getProductByName(product.name)
    .then((product) => {
      products = product;
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to get product by name' });
    });

  console.log('product: ', products);

  // Check if app plan already exists
  let hardwarePlan = null;
  const existingPlans = await stripe.plans.list({ product: products.id }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to list existing plans' });
  });

  console.log('existingPlans: ', existingPlans);

  if (existingPlans.data.length > 0) {
    hardwarePlan = existingPlans.data[0];
    console.log('hardwarePlan in if: ', hardwarePlan);
  } else {
    // Create new app plan
    hardwarePlan = await stripe.plans.create({
      amount,
      currency,
      interval,
      product: {
        name: products.name
      },
    }).catch(err => {
      console.error(err);
      res.status(500).json({ error: 'Failed to create hardware plan' });
    });

    console.log('hardwarePlanin else : ', hardwarePlan);
  }

  const oneYearFromNow = Date.now() + 31536000000; // 31536000000 is the number of milliseconds in a year
  const trialEnd = Math.floor(oneYearFromNow / 1000); // convert milliseconds to seconds

  // Create subscription for the customer with app plan
  await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ plan: hardwarePlan.id }],
    billing_cycle_anchor: Math.floor(Date.now() / 1000), // start the subscription immediately
    // trial_end: trialEnd, // start the subscription immediately
  }).then(resSubs => {
    console.log('subscription: ', resSubs);
    res.json({ message: 'Hardware subscription successful!', resSubs });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subscription' });
  });
};

