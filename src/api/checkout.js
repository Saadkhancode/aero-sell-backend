import dotenv from 'dotenv'
import Stripe from 'stripe';
import sendMail from '../middlewares/send-email.js'
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
// async function getProductByName(name) {
//   const products = await stripe.products.list();
//   const product = products.data.find((p) => p.name === name);
//   return product;
// }
async function getProductByName(name) {
  try {
    const products = await stripe.products.list({active: true,
      limit: 100});
    console.log('productsAll: ', products);
    const product = products.data.find((p) => p.name === name && p.active===true);
    console.log('filtered product: ', product);
    return product;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get product by name');
  }
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
      res.status(500).json({ error: 'Enter a valid email' });
    });
  }

  console.log('customer: ', customer);

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
  let productsData = null;
  try {
    productsData = await getProductByName(product.name);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get product by name' });
    return;
  }
  console.log('product: ', productsData);

  // Check if app plan already exists
  let appPlan = null;
  const existingPlans = await stripe.plans.list({ product: productsData?.id ,active:true}).catch(err => {
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
        name: product.name
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
  }).then(async resSubs => {
    console.log('subscription: ', resSubs);
    const latestInvoice = await stripe.invoices.retrieve(resSubs.latest_invoice);
    console.log('latestInvoice: ', latestInvoice.hosted_invoice_url);
   await sendMail(email,"Patronworks Reciept And Invoice",`<html>
   <body>
   
   
   <div style="width:auto; height:30rem;   padding:10px; font-family: 'Poppins', sans-serif;">
   <h2 style=" text-align:center; ">Patronworks</h2>
   <h2 style=" text-align:center; margin:0px;">Transaction Successfull</h2>
   <h3 style=" text-align:center; font-style:italic; font-weight:bold; ">Hi ${name}</h3>
   <p style=" text-align:center; font-style:italic; ">The transaction details are given below please click On the link:</p>
   <p style="text-align:center; ">${latestInvoice.hosted_invoice_url}</p>
   </div>
   <p style=" text-align:center; line-height:20px; ">For any queries plz call the Patronworks helpline on 224-558-1828 or send an email on </p> 
   <p style=" text-align:center; line-height:20px; color:#4cdc9c; font-size:15px; font-weight:bold; ">Sales@patronworks.com </p>
   </div>
   
   
   </body>
   </html>`)

    res.json({ message: 'Subscription Successful!', resSubs });
  }).catch(err => {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subscription' });
  });
};

export const createHardwareSubscription = async (req, res) => {
  const { email, name, metadata, amount, currency, selectedPlan, interval, product, type, card } = req.body.stripeToken;
  let customer = null;

  try {
    // Check if customer already exists
    
  try {
    // Check if customer already exists
    const existingCustomers = await stripe.customers.list({ email: email });
    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email,
        name,
        metadata
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Please enter a valid email.' });
  }

  let paymentMethod = null;

  try {
    paymentMethod = await stripe.paymentMethods.create({
      type,
      card,
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Please enter valid payment information.' });
  }
    console.log('product.name: ', product.name);
    let products = null;

    try {
      products = await getProductByName(product.name);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to get product by name' });
    }

    if (!products) {
      // Product does not exist, create it
      try {
        products = await stripe.products.create({
          name: product.name,
        });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create product' });
      }
    }

    console.log('product: ', products);

    let oneTimePlan = null;
    let yearlyPlan = null;

    const existingPlans = await stripe.plans.list({ product: products?.id });

    console.log('existingPlans: ', existingPlans);

    for (const plan of existingPlans.data) {
      if (plan.nickname === 'One Time Payment') {
        oneTimePlan = plan;
      } else if (plan.nickname === '12-Month Subscription') {
        yearlyPlan = plan;
      }
    }

    if (!oneTimePlan) {
      oneTimePlan = await stripe.plans.create({
        amount,
        currency,
        interval,
        interval_count: 1,
        product:{
          name:products.name
        },
        nickname: 'One Time Payment',
      });
    }

    if (!yearlyPlan) {
      yearlyPlan = await stripe.plans.create({
        amount,
        currency,
        interval,
        interval_count: 12,
        product:{
          name:products.name
        },
        nickname: '12-Month Subscription',
      });
    }

    // Create the subscription based on the selected plan
    let selectedPlanId = '';
    if (selectedPlan === 'oneTime') {
      selectedPlanId = oneTimePlan.id;
    } else if (selectedPlan === '12Month') {
      selectedPlanId = yearlyPlan.id;
    }

    const resSubs = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: selectedPlanId }],
    });

    const latestInvoice = await stripe.invoices.retrieve(resSubs.latest_invoice);
    console.log('latestInvoice: ', latestInvoice.hosted_invoice_url);

    await sendMail(email, "Patronworks Reciept And Invoice", `<html>
       <body>
       <div style="width:auto; height:30rem;   padding:10px; font-family: 'Poppins', sans-serif;">
       <h2 style=" text-align:center; ">Patronworks</h2>
       <h2 style=" text-align:center; margin:0px;">Transaction Successfull</h2>
       <h3 style=" text-align:center; font-style:italic; font-weight:bold; ">Hi ${name}</h3>
       <p style=" text-align:center; font-style:italic; ">The transaction details are given below please click On the link:</p>
       <p style="text-align:center; ">${latestInvoice.hosted_invoice_url}</p>
       </div>
       <p style=" text-align:center; line-height:20px; ">For any queries plz call the Patronworks helpline on 224-558-1828 or send an email on </p> 
       <p style=" text-align:center; line-height:20px; color:#4cdc9c; font-size:15px; font-weight:bold; ">Sales@patronworks.com </p>
       </div>
       
       
       </body>
       </html>`);

    return res.json({ message: 'Order Successfull!', resSubs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred' });
  }
};


// export const createHardwareSubscription = async (req, res) => {
//   const { email, name, metadata, amount, currency, interval, product, type, card } = req.body.stripeToken;
//   let customer = null;

//   // Check if customer already exists
//   const existingCustomers = await stripe.customers.list({ email: email }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to list existing customers' });
//   });

//   if (existingCustomers.data.length > 0) {
//     customer = existingCustomers.data[0];
//   } else {
//     customer = await stripe.customers.create({
//       email,
//       name,
//       metadata
//     }).catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Enter Valid Email' });
//     });
//   }

//   const paymentMethod = await stripe.paymentMethods.create({
//     type,
//     card,
//   }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Enter a Valid Card Number' });
//   });

//   await stripe.paymentMethods.attach(paymentMethod.id, {
//     customer: customer.id,
//   }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to attach payment method' });
//   });

//   await stripe.customers.update(customer.id, {
//     invoice_settings: {
//       default_payment_method: paymentMethod.id,
//     },
//   }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to update customer' });
//   });

//   console.log('product.name: ', product.name);
//   let products = null;

//   await getProductByName(product.name)
//     .then((product) => {
//       products = product;
//     })
//     .catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to get product by name' });
//     });

//   console.log('product: ', products);

//   let hardwarePlan = null;
//   const existingPlans = await stripe.plans.list({ product: products?.id }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to list existing plans' });
//   });

//   console.log('existingPlans: ', existingPlans);

//   if (existingPlans.data.length > 0) {
//     hardwarePlan = existingPlans.data[0];
//     console.log('hardwarePlan in if: ', hardwarePlan);
//   } else {
//     hardwarePlan = await stripe.plans.create({
//       amount,
//       currency,
//       interval,
//       product: {
//         name: products.name
//       },
//     }).catch(err => {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to create hardware plan' });
//     });

//     console.log('hardwarePlanin else : ', hardwarePlan);
//   }

//   const oneYearFromNow = Date.now() + 31536000000;
//   const trialEnd = Math.floor(oneYearFromNow / 1000);


//   await stripe.subscriptions.create({
//     customer: customer.id,
//     items: [{ plan: hardwarePlan.id }],
//   }).then(async resSubs => {
//     console.log('subscription: ', resSubs);
//     const latestInvoice = await stripe.invoices.retrieve(resSubs.latest_invoice);
//     console.log('latestInvoice: ', latestInvoice.hosted_invoice_url);
//    await sendMail(email,"Patronworks Reciept And Invoice",`<html>
//    <body>
//    <div style="width:auto; height:30rem;   padding:10px; font-family: 'Poppins', sans-serif;">
//    <h2 style=" text-align:center; ">Patronworks</h2>
//    <h2 style=" text-align:center; margin:0px;">Transaction Successfull</h2>
//    <h3 style=" text-align:center; font-style:italic; font-weight:bold; ">Hi ${name}</h3>
//    <p style=" text-align:center; font-style:italic; ">The transaction details are given below please click On the link:</p>
//    <p style="text-align:center; ">${latestInvoice.hosted_invoice_url}</p>
//    </div>
//    <p style=" text-align:center; line-height:20px; ">For any queries plz call the Patronworks helpline on 224-558-1828 or send an email on </p> 
//    <p style=" text-align:center; line-height:20px; color:#4cdc9c; font-size:15px; font-weight:bold; ">Sales@patronworks.com </p>
//    </div>
   
   
//    </body>
//    </html>`)

//     res.json({ message: 'Order Successfull!', resSubs });
//   }).catch(err => {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to create subscription' });
//   });
// };

