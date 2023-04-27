import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import Auth from './api-routes/user-route.js';
import category from './api-routes/category-route.js'
import emailMarketing  from './api-routes/emailMarketing-route.js';
import smsMarketing from './api-routes/smsmarketing-route.js';
import check from './api-routes/check-route.js'
import device from './api-routes/device-route.js'
import display from './api-routes/display-route.js'
import employee from './api-routes/employee-route.js'
import menu from './api-routes/menu-route.js'
import mu from './api-routes/mu-route.js'
import order from './api-routes/order-route.js'
import orderitem from './api-routes/orderitem-route.js'
import paymentlist from './api-routes/paymentlist-route.js'
import product from './api-routes/product-route.js'
import role from './api-routes/role-route.js'
import tax from './api-routes/tax-route.js'
import tables from './api-routes/table-route.js'
import parentcategory from './api-routes/parentcategory-route.js';
import customer from './api-routes/customer-route.js'
import passwordreset from './api/reset-password.js'
import  Checkout  from './api-routes/checkout-route.js';
import userRegisterWithEmailVerification from './api/emailVerification.js'
import modifier from './api-routes/prdouct-modifier-route.js'
import tableReservation from './api-routes/reservation&waitingList-route.js'
import Loyaltyoffers from './api-routes/loaylty-offers-route.js'
import customization from './api-routes/customization-route.js'
import logo from './api-routes/logo-route.js'
import blog from './api-routes/blog-route.js'
import contactus from './api-routes/contactUs-route.js'
import employeTimeStamp from './api-routes/employeetime-route.js'
import reciept from './api-routes/reciept-route.js'
import './config/config.js';
import path from 'path'
import { fileURLToPath } from 'url';
// import fs from "fs"
// const file=fs.readFileSync('./036C0DBFDB2A157703FBA75521E0278D.txt')
const app = express();
dotenv.config();
//path
const __filename=fileURLToPath(import.meta.url)
const __dirname=path.dirname(__filename)
//middelwares
app.use(cors({
    origin: true,
    credentials: true,
    defaultErrorHandler: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use("/public",express.static("public"));
// app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json())

app.use(helmet({crossOriginResourcePolicy:false,}));
app.use(morgan("dev"));
//Routes
//uset Email Verification Endpoints
app.use('/api/v1/activate-account',userRegisterWithEmailVerification)
//user forgot and reset-password Endpoints
app.use('/api/v1/reset-password',passwordreset)
//All APi's Endponits
app.use('/api/v1', Auth,category, check, device, display, employee, menu, mu, order, orderitem, paymentlist, product, role, tax, tables,parentcategory,customer,Checkout,modifier,tableReservation,emailMarketing,smsMarketing,Loyaltyoffers,customization,logo,blog,contactus,employeTimeStamp, reciept)

    
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist please put Api routes dev3..'
    })
});


//Port
if (process.env.NODE_ENV === 'production') {
const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
} else if (process.env.NODE_ENV === 'development') {
    const port = process.env.DEV_PORT || 4444;
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}
