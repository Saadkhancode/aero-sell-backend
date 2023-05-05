import express  from "express";
const routes=express.Router();

import {Checkout,
    createChargeUser,
    createChargeHardware
} from "../api/checkout.js"
import { createSellerAccount,
    authorizeSeller,
     getSellerBalance
} from "../api/stripeConnet.js"

routes.get('/sellerbalance/:account_id',getSellerBalance)
routes.post('/authorize-seller/:userId', authorizeSeller )
routes.post('/credit', Checkout )
routes.post('/checkout',createChargeUser  )
routes.post('/hardware',createChargeHardware  )
routes.post('/create-account', createSellerAccount )

export default routes