import express  from "express";
const routes=express.Router();

import {Checkout
} from "../api/checkout.js"
import { createSellerAccount,
    authorizeSeller,
     getSellerBalance
} from "../api/stripeConnet.js"

routes.get('/sellerbalance/:account_id',getSellerBalance)
routes.post('/authorize-seller', authorizeSeller )
routes.post('/credit', Checkout )
routes.post('/create-account', createSellerAccount )

export default routes