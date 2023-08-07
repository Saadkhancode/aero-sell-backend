import express from "express";
const route = express.Router();
import {
    customerRegister,
    customerLogin
} from '../api/customer-auth.js'
import {
    getCustomer,
    searchCustomer,
    postCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById
} from '../api/customer.js'
route.get('/customer', getCustomer)
route.get('/customer/:userId?/:FirstName?/:LastName?/:Email?/:Phone?/:City?/:State?/:PostalCode?/:CustomerId?', searchCustomer)
route.post('/customer', postCustomer)
route.post('/cregister', customerRegister)
route.post('/clogin', customerLogin)
route.delete('/customer/:_id', deleteCustomer)
route.put('/customer/:_id', updateCustomer)
route.get('/customer/:_id', getCustomerById)

export default route;