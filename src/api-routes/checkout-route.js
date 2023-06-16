import express  from "express";
const routes=express.Router();

import {Checkout,
    createAppSubscription,
    createHardwareSubscription
} from "../api/checkout.js"
import { createSellerAccount,
    authorizeSeller,
     getSellerBalance
} from "../api/stripeConnet.js"
import {
    orderPaymentIntent,
    terminalConnection
} from '../api/stripe-terminal.js'


routes.get('/sellerbalance/:account_id',getSellerBalance)
routes.post('/authorize-sellerr/:userId', authorizeSeller )
routes.post('/credit', Checkout )
routes.post('/app-plan',createAppSubscription  )
routes.post('/hardware-plan',createHardwareSubscription  )
routes.post('/create-account', createSellerAccount )
routes.post('/connect-terminal', terminalConnection )
routes.post('/order-payment', orderPaymentIntent )

export default routes