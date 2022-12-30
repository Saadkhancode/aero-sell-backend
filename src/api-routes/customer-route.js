import express from "express";
const route=express.Router();
import {
    customerRegister,
    customerLogin
} from '../api/customer-auth.js'
import {
    getCustomer,
    searchCustomer,
    postCustomer,
    updateCustomer,
    deleteCustomer
} from '../api/customer.js'
route.get('/customer',getCustomer)
route.get('/customer/:FirstName?/:LastName?/:Email?/:Phone?/:City?/:State?/:PostalCode?/:CustomerId?',searchCustomer)
route.post('/customer',postCustomer)
route.post('/cregister',customerRegister)
route.post('/clogin',customerLogin)
route.put('/customer/:_id',updateCustomer)
route.delete('/customer/:_id',deleteCustomer)

export default route;