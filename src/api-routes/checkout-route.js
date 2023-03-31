import express  from "express";
const routes=express.Router();

import {Checkout
} from "../api/checkout.js"
import { createAccount } from "../api/stripeConnet.js"

routes.post('/credit', Checkout )
routes.post('/create-account', createAccount )


export default routes