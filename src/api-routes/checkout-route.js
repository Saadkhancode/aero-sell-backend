import express  from "express";
const routes=express.Router();

import {Checkout,
    createAppSubscription,
    createHardwareSubscription,
    getCustomerSubscriptionsByEmail
} from "../api/checkout.js"
import { createSellerAccount,
    authorizeSeller,
     getSellerBalance
} from "../api/stripeConnet.js"
import {
    orderPaymentIntent,
    terminalConnection,
    capturePaymentIntent
    ,
    confirmPaymentIntent
} from '../api/stripe-terminal.js'


routes.get('/sellerbalance/:account_id',getSellerBalance)
routes.get('/subscriptions/:email',getCustomerSubscriptionsByEmail)
routes.post('/authorize-seller/:userId', authorizeSeller )
routes.post('/credit', Checkout )
routes.post('/app-plan',createAppSubscription  )
routes.post('/hardware-plan',createHardwareSubscription  )
routes.post('/create-account', createSellerAccount )
routes.post('/connect-terminal', terminalConnection )
routes.post('/order-payment', orderPaymentIntent )
routes.post('/capture_payment', capturePaymentIntent )
routes.post('/confirm_payment', confirmPaymentIntent )

export default routes