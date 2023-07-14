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
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });
    console.log('productsAll: ', products);
    const product = products.data.find((p) => p.name === name && p.active === true);
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
  const existingCustomers = await stripe.customers.list({ email: email,limit:100}).catch(err => {
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
  const existingPlans = await stripe.plans.list({ product: productsData?.id, active: true,limit:100 }).catch(err => {
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
    console.log('latestInvoice: ', latestInvoice);
    console.log('latestInvoice: ', latestInvoice.hosted_invoice_url);
    await sendMail(email, "Patronworks Reciept And Invoice", `<html>
    <head>
    <style>
    @media screen and (max-width:3000px) and (min-width:769px){
    .container{
    width:50%;
    margin:auto;
    }
    .head{
    width: 100%; height: 14rem;background-color: rgb(6, 138, 245);font-size:22px; display:flex; align-items:end
    }
    }
    @media screen and (max-width:768px) and (min-width:0px){
    .container{
    width:100%;
    margin:auto;
    }
    .head{
    width: 100%; height: 14rem;background-color: rgb(6, 138, 245);font-size:22px; display:flex; align-items:end;
    font-size:22px;
    }
    }
    </style>
    </head>
       <body>
       <div class="container">
       <div style="width:100%; margin:auto; border:1px solid lightgrey; text-align:center;">
       <div style="font-family: Arial, Helvetica, sans-serif;">
       <div style="" class="head">
           <h2 style="color: white; padding-left: 10px; font-weight: bold;margin-bottom:2rem;width:100%;align-items:center; padding-top:6rem;">Payment Confirmation</h2>
       </div>
       <div style="padding: 2rem;">
           <h2 style="font-size: 1rem; margin-bottom: 2rem;">Hello <strong>${name}</strong></h2>
           <p style="margin-bottom: 2rem;">Thank you for your recent purchase with PatronWorks! We are sending this email
               to confirm that your payment has been successfully processed.</p>
    
           <ul >
               <h2 style="font-size: 1rem; margin-bottom: 1rem;">Details of your transaction are as follows:</h2>
    
               <li style="margin-bottom: 1rem; display:flex; justify-content:center">Product : <strong>PatronWorks POS Software(${product.name})</strong></li>
               <li style="margin-bottom: 1rem; display:flex; justify-content:center">Total Amount : <strong>${amount}/month</strong></li>
               <li style="margin-bottom: 3rem; display:flex; justify-content:center">Date of Purchase : <strong>${latestInvoice.status_transitions.paid_at}</strong></li>
           </ul>
           <p style="margin-bottom: 3rem;">You can view the full details of your receipt on Stripe by clicking the link
               below:</p>
           <a href="${latestInvoice.hosted_invoice_url}"
               style="display: flex; overflow-wrap: anywhere; margin-bottom: 3rem;">${latestInvoice.hosted_invoice_url}</a>
    
           <p style="margin-bottom: 3rem;">If you have any questions or need further assistance, please don't hesitate to
               contact our support team at <a href=""> support@patronworks.com</a> or call us at 224-558-1828.</p>
           <p>Thank you for entrusting your business to PatronWorks POS. Your choice is not taken lightly and we are
               steadfast in our commitment to deliver you service of the highest caliber. We understand the importance of
               your operations, and we pledge to equip you with innovative, reliable, and efficient solutions that will
               help propel your business to new heights.</p>
    
           <table border="0" cellpadding="0" cellspacing="0" width="" role="presentation"
               style=" display: flex; justify-content: center; margin-top: 2rem;" class="m_17281146269363811mceClusterLayout">
               <tbody style="margin:auto;">
                   <tr>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://linkedin.com/company/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw0FKb0ZzhI0eyC2knHMv7Y2"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="LinkedIn icon"
                                   src="https://ci5.googleusercontent.com/proxy/ekzLfgy0x7y21v8P74144pFNolAfHKeP2IBElMFDQAuKbTXWzGOPqANSZOQJa9AA1KAbTRNxVyvPacbcNKf7XLcgf1suPBx2kjnfsDjdNKp2PRDGO_nWmW367IhQobVIRvVOHplkA1Zvb9bD-0tg2saj6ySxA4Hobn4IUFPrBZSBDcFBYGEeQ-84Jr4-VVP2l7El4PqFKv3lN7HN2DonkMxmO9dr=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Flinkedin-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://facebook.com/insoftservicesemear" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://facebook.com/insoftservicesemear&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw1eqrUSNNB-EF1mUvIw1nQm"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Facebook icon"
                                   src="https://ci5.googleusercontent.com/proxy/sUMv1C6_q5qdsNdB_QIMwtSlChBxePZ7V4omll7bLK5s2Q4BGSZbmblOzabl1I6QPfp9yKEcN57HnShUe4cJzEb8SJmabi1vO7RxyfdoSFQTYnVMvXZg45fzAQasdz_99T0YeGt538NAlUttGW_gzZbB0q36zpJVpwHHM6nrOHTqqF-8vDRtpx-pg43ouCEqxFrN3282W8huMTzL3o-74SdAAhys=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ffacebook-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://instagram.com/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw3PAC3bKI6YRs2nQrZSQSn3"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Instagram icon"
                                   src="https://ci6.googleusercontent.com/proxy/MZQ3iHAZ3PEV5S63svVAw7NToy3q4Cd9RPF50HFYC024sHEo9PwBuo4Ce5faBsHel7En0jMG_XM_ejm05kElZcNqPIv7__9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2_9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://twitter.com/InsoftServices" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/InsoftServices&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw376xIdkBLY9_zAs9nL-OtY"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Twitter icon"
                                   src="https://ci3.googleusercontent.com/proxy/d-6J3vMN1HYSEoAyJzUUsg2-uM0WWp0hTIWuPOp3iSRltHO1h0Z5vHQuuzj2k8t0G0AFWXNUkK6u9uRjTD7ZKcljqzn33WUh4-EpXnostm9zPRqlKGojtl2V1u0OzuNhRcO7Ncs8i2yBHTI_bzRJrBdpkRy4K0oF3wIiaB7tW8wTzAuuFZ4u412xgdcMLtfRtNq02_azzHm_WaaJLTzZjBf4wpM=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ftwitter-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="mailto:info@insoftservices.uk" style="display:block" target="_blank"><img width="32"
                                   style="border:0;width:32px;height:auto;max-width:100%;display:block" alt="Email icon"
                                   src="https://ci6.googleusercontent.com/proxy/qcF_gwFMT4yvIY8IFWyizKS0oDe-zFblAzVCqmWdYYkFbgfkEoZcGCPMZKxdtyk7E2JyuryL3r5wMzm0Lds3XwjdeZoeOtFHlTE1HA_B6JV0oYFkjiH-jD_oMADlCsaevKzoMc_WRJV353PDpHHWaW9zhIKqYRJ2nbkbDTyxwe95QdbVT1oRXYDauuFa3x3V4Fc2iRy_YWgYfpo9advbjgqH=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Femail-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                   </tr>
                   
                 
                       
               </tbody>
           </table>
           <div style=" margin-top: 2rem; margin-bottom: 2rem;">
               <img
                           _ngcontent-wtb-c2="" width="281" alt="Logo"
                           src="https://ci3.googleusercontent.com/proxy/ZxMQoZdE1WQC4wQtZEAP_M8MyhhFVkgQR-ZWTJ800_rKB7zDN1wt1lZJ0QuaP8EEwPogjSLTTcAyvbjs6QGLTnqHl0sQAw4HVyPZT0QUG094RRGJv40ccSChYuJJLMg9b-Xl-35HiDWExI-fSF0_72ZRESC4uMDLLcxmTWd96oh-EZNdZ-dttkk=s0-d-e1-ft#https://dim.mcusercontent.com/cs/e4ca1d9defed245490a5b50eb/images/91e8cd6a-94af-2b9a-8594-a382d4b12070.png?w=281&amp;dpr=2"
                           data-bit="iit" class="CToWUd"
                           style="width: 281px; height: auto; max-width: 100%; display: block;margin:auto;">
           </div>
           <div style="display:grid; justify-content: center; align-items:center;">
               <p style="font-style: italic; margin-bottom: 5px; text-align:center;">Copyright (C) 2023 PatronWorks. All rights reserved.</p>
               <p style="margin-bottom: 5px; text-align:center; text-align: center;">By providing us with your email address, ${email}, occasionally, you will receive promotions and updates from us.</p>
               <p style="margin-bottom: 5px; text-align:center;">Our mailing address is:</p>
               <p style="margin-bottom: 5px; text-align:center;"> 208 W Alexander St, Plant City, Fl 33563</p>
               <p style="margin-bottom: 5px; text-align:center; text-align:center">Need some assistance? Reach out to us<a href="info@patronworks.com" style="margin-left:5px;">info@patronworks.com</a> </p >
           </div>
       </div>
    </div>
    </div>
    </div>
    </body>
    </html>
`)
    await sendMail(email, "Welcome to PatronWorks - Your POS Journey Begins Now", `<html>

   <head>
   <style>
   .client{
    color: white;
    font-weight: 700;
    display: flex;
    font-size: 25px;
    width: 100%;
    justify-content:center;
    padding-top: 10rem;
    padding-left:20px;
   }
   @media screen and (max-width:3000px) and (min-width:769px){
   .container{
   width:50%;
   margin:auto;
   }
  }
   @media screen and (max-width:768px) and (min-width:0px){
   .container{
   width:100%;
   margin:0px;
   
   }
   .client{
    color: white;
    font-weight: 700;
    display: grid;
    font-size: 25px;
    width: 100%;
    padding-top: 10rem;
    padding-left:10px;
   }
   
   }
   </style>
   </head>
      <body>
      <div class="container">
      <div style="font-family: Arial, Helvetica, sans-serif; ">
      <div style="width: auto; height: 14rem; background-color: rgb(6, 138, 245); ">
      
          <h2 class="client">Client OnBoarding</h2>
      
      </div>
      <div style="padding: 2rem; border:1px solid lightgray">
          <h2 style="font-size: 1rem; margin-bottom: 2rem;">Hello <strong>${name}</strong></h2>
          <p style=" margin-bottom: 2rem;">We hope this message finds you well. We are thrilled to extend a warm welcome to you as the newest member of our PatronWorks family. Your subscription to our Point-of-Sale (POS) software has been successfully activated and we are excited to be a part of your business journey.</p>
          <p style=" margin-bottom: 2rem;">Thank you for choosing us. We understand that you have many options when it comes to selecting POS software, and we are deeply grateful that you've entrusted us with your needs. We are committed to providing you with a powerful, user-friendly tool that will help drive your business growth and streamline your operations.</p>
          <p style="margin-bottom: 2rem;">To get started, please click the link below. This will take you to our POS registration page where you can set up your account:</p>
          <a style="color: blue; margin-bottom: 2rem;" href= "https://patronworks.net/auth/onboarding">https://patronworks.net/auth/onboarding</a>
          <p style=" margin-bottom: 2rem;"> Our platform is designed to be intuitive and easy-to-use, but if you encounter any challenges or have any questions, our dedicated customer support team is available to assist you. We are here to ensure that your experience with our POS system is smooth and rewarding.
          </p>
          <p style=" margin-bottom: 2rem;">We believe that your success is our success. As we embark on this journey together, we are committed to helping you make the most of our software. We'll be sending you tips and updates regularly to help you get the most out of our platform.</p>
          <p style=" margin-bottom: 2rem;">Thank you once again for your trust and confidence in us. We look forward to serving you and helping your business thrive.</p>
          <p style=" margin-bottom: 2rem;">Don't forget to join us on LinkedIn and Facebook. It's a great way to connect with other users, share insights, and keep up with the latest news and updates from our team. We can't wait to see you there!</p>
   
         
   
          <table border="0" cellpadding="0" cellspacing="0" width="" role="presentation"
               style=" display: flex; justify-content: center; margin-top: 2rem;" class="m_17281146269363811mceClusterLayout">
               <tbody style="margin:auto;">
                   <tr>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://linkedin.com/company/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw0FKb0ZzhI0eyC2knHMv7Y2"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="LinkedIn icon"
                                   src="https://ci5.googleusercontent.com/proxy/ekzLfgy0x7y21v8P74144pFNolAfHKeP2IBElMFDQAuKbTXWzGOPqANSZOQJa9AA1KAbTRNxVyvPacbcNKf7XLcgf1suPBx2kjnfsDjdNKp2PRDGO_nWmW367IhQobVIRvVOHplkA1Zvb9bD-0tg2saj6ySxA4Hobn4IUFPrBZSBDcFBYGEeQ-84Jr4-VVP2l7El4PqFKv3lN7HN2DonkMxmO9dr=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Flinkedin-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://facebook.com/insoftservicesemear" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://facebook.com/insoftservicesemear&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw1eqrUSNNB-EF1mUvIw1nQm"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Facebook icon"
                                   src="https://ci5.googleusercontent.com/proxy/sUMv1C6_q5qdsNdB_QIMwtSlChBxePZ7V4omll7bLK5s2Q4BGSZbmblOzabl1I6QPfp9yKEcN57HnShUe4cJzEb8SJmabi1vO7RxyfdoSFQTYnVMvXZg45fzAQasdz_99T0YeGt538NAlUttGW_gzZbB0q36zpJVpwHHM6nrOHTqqF-8vDRtpx-pg43ouCEqxFrN3282W8huMTzL3o-74SdAAhys=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ffacebook-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://instagram.com/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw3PAC3bKI6YRs2nQrZSQSn3"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Instagram icon"
                                   src="https://ci6.googleusercontent.com/proxy/MZQ3iHAZ3PEV5S63svVAw7NToy3q4Cd9RPF50HFYC024sHEo9PwBuo4Ce5faBsHel7En0jMG_XM_ejm05kElZcNqPIv7__9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2_9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://twitter.com/InsoftServices" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/InsoftServices&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw376xIdkBLY9_zAs9nL-OtY"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Twitter icon"
                                   src="https://ci3.googleusercontent.com/proxy/d-6J3vMN1HYSEoAyJzUUsg2-uM0WWp0hTIWuPOp3iSRltHO1h0Z5vHQuuzj2k8t0G0AFWXNUkK6u9uRjTD7ZKcljqzn33WUh4-EpXnostm9zPRqlKGojtl2V1u0OzuNhRcO7Ncs8i2yBHTI_bzRJrBdpkRy4K0oF3wIiaB7tW8wTzAuuFZ4u412xgdcMLtfRtNq02_azzHm_WaaJLTzZjBf4wpM=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ftwitter-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="mailto:info@insoftservices.uk" style="display:block" target="_blank"><img width="32"
                                   style="border:0;width:32px;height:auto;max-width:100%;display:block" alt="Email icon"
                                   src="https://ci6.googleusercontent.com/proxy/qcF_gwFMT4yvIY8IFWyizKS0oDe-zFblAzVCqmWdYYkFbgfkEoZcGCPMZKxdtyk7E2JyuryL3r5wMzm0Lds3XwjdeZoeOtFHlTE1HA_B6JV0oYFkjiH-jD_oMADlCsaevKzoMc_WRJV353PDpHHWaW9zhIKqYRJ2nbkbDTyxwe95QdbVT1oRXYDauuFa3x3V4Fc2iRy_YWgYfpo9advbjgqH=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Femail-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                   </tr>
                   
                 
                       
               </tbody>
           </table>
           <div style=" margin-top: 2rem; margin-bottom: 2rem;">
               <img
                           _ngcontent-wtb-c2="" width="281" alt="Logo"
                           src="https://ci3.googleusercontent.com/proxy/ZxMQoZdE1WQC4wQtZEAP_M8MyhhFVkgQR-ZWTJ800_rKB7zDN1wt1lZJ0QuaP8EEwPogjSLTTcAyvbjs6QGLTnqHl0sQAw4HVyPZT0QUG094RRGJv40ccSChYuJJLMg9b-Xl-35HiDWExI-fSF0_72ZRESC4uMDLLcxmTWd96oh-EZNdZ-dttkk=s0-d-e1-ft#https://dim.mcusercontent.com/cs/e4ca1d9defed245490a5b50eb/images/91e8cd6a-94af-2b9a-8594-a382d4b12070.png?w=281&amp;dpr=2"
                           data-bit="iit" class="CToWUd"
                           style="width: 281px; height: auto; max-width: 100%; display: block;margin:auto;">
           </div>
           <div style="display:grid; justify-content: center; align-items:center;">
               <p style="font-style: italic; margin-bottom: 5px; text-align:center;">Copyright (C) 2023 PatronWorks. All rights reserved.</p>
               <p style="margin-bottom: 5px; text-align:center; text-align: center;">By providing us with your email address, ${email}, occasionally, you will receive promotions and updates from us.</p>
               <p style="margin-bottom: 5px; text-align:center;">Our mailing address is:</p>
               <p style="margin-bottom: 5px; text-align:center;"> 208 W Alexander St, Plant City, Fl 33563</p>
               <p style="margin-bottom: 5px; text-align:center; text-align:center">Need some assistance? Reach out to us<a href="info@patronworks.com" style="margin-left:5px;">info@patronworks.com</a> </p >
           </div>
      </div>
   </div>
   </div>
   </body>
   </html>
`)

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
      const existingCustomers = await stripe.customers.list({ email: email,limit:100 });
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

    const existingPlans = await stripe.plans.list({ product: products?.id ,active:true,limit:100});

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
        product: {
          name: products.name
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
        product: {
          name: products.name
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
    <head>
    <style>
    @media screen and (max-width:3000px) and (min-width:769px){
    .container{
    width:50%;
    margin:auto;
    }
    .head{
    width: 100%; height: 14rem;background-color: rgb(6, 138, 245);font-size:22px; display:flex; align-items:end
    }
    }
    @media screen and (max-width:768px) and (min-width:0px){
    .container{
    width:100%;
    margin:auto;
    }
    .head{
    width: 100%; height: 14rem;background-color: rgb(6, 138, 245);font-size:22px; display:flex; align-items:end;
    font-size:22px;
    }
    }
    </style>
    </head>
       <body>
       <div class="container">
       <div style="width:100%; margin:auto; border:1px solid lightgrey; text-align:center;">
       <div style="font-family: Arial, Helvetica, sans-serif;">
       <div style="" class="head">
           <h2 style="color: white; padding-left: 10px; font-weight: bold;margin-bottom:2rem;width:100%;align-items:center; padding-top:6rem;">Payment Confirmation</h2>
       </div>
       <div style="padding: 2rem;">
           <h2 style="font-size: 1rem; margin-bottom: 2rem;">Hello <strong>${name}</strong></h2>
           <p style="margin-bottom: 2rem;">Thank you for your recent purchase with PatronWorks! We are sending this email
               to confirm that your payment has been successfully processed.</p>
    
           <ul >
               <h2 style="font-size: 1rem; margin-bottom: 1rem;">Details of your transaction are as follows:</h2>
    
               <li style="margin-bottom: 1rem; display:flex; justify-content:center">Product : <strong>PatronWorks POS Hardware(${product.name})</strong></li>
               <li style="margin-bottom: 1rem; display:flex; justify-content:center">Total Amount : <strong>${amount}/month</strong></li>
               <li style="margin-bottom: 3rem; display:flex; justify-content:center">Date of Purchase : <strong>${latestInvoice.status_transitions.paid_at}</strong></li>
           </ul>
           <p style="margin-bottom: 3rem;">You can view the full details of your receipt on Stripe by clicking the link
               below:</p>
           <a href="${latestInvoice.hosted_invoice_url}"
               style="display: flex; overflow-wrap: anywhere; margin-bottom: 3rem;">${latestInvoice.hosted_invoice_url}</a>
    
           <p style="margin-bottom: 3rem;">If you have any questions or need further assistance, please don't hesitate to
               contact our support team at <a href=""> support@patronworks.com</a> or call us at 224-558-1828.</p>
           <p>Thank you for entrusting your business to PatronWorks POS. Your choice is not taken lightly and we are
               steadfast in our commitment to deliver you service of the highest caliber. We understand the importance of
               your operations, and we pledge to equip you with innovative, reliable, and efficient solutions that will
               help propel your business to new heights.</p>
    
           <table border="0" cellpadding="0" cellspacing="0" width="" role="presentation"
               style=" display: flex; justify-content: center; margin-top: 2rem;" class="m_17281146269363811mceClusterLayout">
               <tbody style="margin:auto;">
                   <tr>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://linkedin.com/company/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://linkedin.com/company/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw0FKb0ZzhI0eyC2knHMv7Y2"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="LinkedIn icon"
                                   src="https://ci5.googleusercontent.com/proxy/ekzLfgy0x7y21v8P74144pFNolAfHKeP2IBElMFDQAuKbTXWzGOPqANSZOQJa9AA1KAbTRNxVyvPacbcNKf7XLcgf1suPBx2kjnfsDjdNKp2PRDGO_nWmW367IhQobVIRvVOHplkA1Zvb9bD-0tg2saj6ySxA4Hobn4IUFPrBZSBDcFBYGEeQ-84Jr4-VVP2l7El4PqFKv3lN7HN2DonkMxmO9dr=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Flinkedin-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://facebook.com/insoftservicesemear" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://facebook.com/insoftservicesemear&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw1eqrUSNNB-EF1mUvIw1nQm"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Facebook icon"
                                   src="https://ci5.googleusercontent.com/proxy/sUMv1C6_q5qdsNdB_QIMwtSlChBxePZ7V4omll7bLK5s2Q4BGSZbmblOzabl1I6QPfp9yKEcN57HnShUe4cJzEb8SJmabi1vO7RxyfdoSFQTYnVMvXZg45fzAQasdz_99T0YeGt538NAlUttGW_gzZbB0q36zpJVpwHHM6nrOHTqqF-8vDRtpx-pg43ouCEqxFrN3282W8huMTzL3o-74SdAAhys=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ffacebook-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://instagram.com/insoftservices/" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://instagram.com/insoftservices/&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw3PAC3bKI6YRs2nQrZSQSn3"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Instagram icon"
                                   src="https://ci6.googleusercontent.com/proxy/MZQ3iHAZ3PEV5S63svVAw7NToy3q4Cd9RPF50HFYC024sHEo9PwBuo4Ce5faBsHel7En0jMG_XM_ejm05kElZcNqPIv7__9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2_9yvdxfKGabkPe00eFY38GD6VGjNEhy7MXj6Kp3a88Y70lddF89PDGaMt6ahzlUbfFw2Qm4ow6PEGQeEIrIoDXykzM6ly1LfM3dYEuK8B-oGJvFG1MzYB_v9pS7Wmk0kw=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Finstagram-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="https://twitter.com/InsoftServices" style="display:block" target="_blank"
                               data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/InsoftServices&amp;source=gmail&amp;ust=1686635450412000&amp;usg=AOvVaw376xIdkBLY9_zAs9nL-OtY"><img
                                   width="32" style="border:0;width:32px;height:auto;max-width:100%;display:block"
                                   alt="Twitter icon"
                                   src="https://ci3.googleusercontent.com/proxy/d-6J3vMN1HYSEoAyJzUUsg2-uM0WWp0hTIWuPOp3iSRltHO1h0Z5vHQuuzj2k8t0G0AFWXNUkK6u9uRjTD7ZKcljqzn33WUh4-EpXnostm9zPRqlKGojtl2V1u0OzuNhRcO7Ncs8i2yBHTI_bzRJrBdpkRy4K0oF3wIiaB7tW8wTzAuuFZ4u412xgdcMLtfRtNq02_azzHm_WaaJLTzZjBf4wpM=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Ftwitter-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                       <td style="padding-left:12px;padding-top:0;padding-right:12px" valign="top"
                           class="m_17281146269363811mobileClass-11">
                           <a href="mailto:info@insoftservices.uk" style="display:block" target="_blank"><img width="32"
                                   style="border:0;width:32px;height:auto;max-width:100%;display:block" alt="Email icon"
                                   src="https://ci6.googleusercontent.com/proxy/qcF_gwFMT4yvIY8IFWyizKS0oDe-zFblAzVCqmWdYYkFbgfkEoZcGCPMZKxdtyk7E2JyuryL3r5wMzm0Lds3XwjdeZoeOtFHlTE1HA_B6JV0oYFkjiH-jD_oMADlCsaevKzoMc_WRJV353PDpHHWaW9zhIKqYRJ2nbkbDTyxwe95QdbVT1oRXYDauuFa3x3V4Fc2iRy_YWgYfpo9advbjgqH=s0-d-e1-ft#https://dim.mcusercontent.com/https/cdn-images.mailchimp.com%2Ficons%2Fsocial-block-v3%2Fblock-icons-v3%2Femail-filled-color-40.png?w=32&amp;dpr=2"
                                   class="CToWUd" data-bit="iit"></a>
                       </td>
                   </tr>
                   
                 
                       
               </tbody>
           </table>
           <div style=" margin-top: 2rem; margin-bottom: 2rem;">
               <img
                           _ngcontent-wtb-c2="" width="281" alt="Logo"
                           src="https://ci3.googleusercontent.com/proxy/ZxMQoZdE1WQC4wQtZEAP_M8MyhhFVkgQR-ZWTJ800_rKB7zDN1wt1lZJ0QuaP8EEwPogjSLTTcAyvbjs6QGLTnqHl0sQAw4HVyPZT0QUG094RRGJv40ccSChYuJJLMg9b-Xl-35HiDWExI-fSF0_72ZRESC4uMDLLcxmTWd96oh-EZNdZ-dttkk=s0-d-e1-ft#https://dim.mcusercontent.com/cs/e4ca1d9defed245490a5b50eb/images/91e8cd6a-94af-2b9a-8594-a382d4b12070.png?w=281&amp;dpr=2"
                           data-bit="iit" class="CToWUd"
                           style="width: 281px; height: auto; max-width: 100%; display: block;margin:auto;">
           </div>
           <div style="display:grid; justify-content: center; align-items:center;">
               <p style="font-style: italic; margin-bottom: 5px; text-align:center;">Copyright (C) 2023 PatronWorks. All rights reserved.</p>
               <p style="margin-bottom: 5px; text-align:center; text-align: center;">By providing us with your email address, ${email}, occasionally, you will receive promotions and updates from us.</p>
               <p style="margin-bottom: 5px; text-align:center;">Our mailing address is:</p>
               <p style="margin-bottom: 5px; text-align:center;"> 208 W Alexander St, Plant City, Fl 33563</p>
               <p style="margin-bottom: 5px; text-align:center; text-align:center">Need some assistance? Reach out to us<a href="info@patronworks.com" style="margin-left:5px;">info@patronworks.com</a> </p >
           </div>
       </div>
    </div>
    </div>
    </div>
    </body>
    </html>`);

    return res.json({ message: 'Order Successfull!', resSubs });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'An error occurred' });
  }
};


