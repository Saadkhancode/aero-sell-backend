import './config/config.js';

import bodyParser from 'body-parser';
import { exec } from 'child_process';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';
import onvif from 'node-onvif';

import blog from './api-routes/blog-route.js';
import category from './api-routes/category-route.js';
import chatRoute from './api-routes/chat_route.js';
import check from './api-routes/check-route.js';
import Checkout from './api-routes/checkout-route.js';
import contactus from './api-routes/contactUs-route.js';
import coupens from './api-routes/coupens-route.js';
import customer from './api-routes/customer-route.js';
import customization from './api-routes/customization-route.js';
import billdenomination from './api-routes/denomination-route.js';
import device from './api-routes/device-route.js';
import display from './api-routes/display-route.js';
import emailMarketing from './api-routes/emailMarketing-route.js';
import employee from './api-routes/employee-route.js';
import employeTimeStamp from './api-routes/employeetime-route.js';
import Loyaltyoffers from './api-routes/loaylty-offers-route.js';
import logo from './api-routes/logo-route.js';
import menu from './api-routes/menu-route.js';
import mu from './api-routes/mu-route.js';
import order from './api-routes/order-route.js';
import orderitem from './api-routes/orderitem-route.js';
import parentcategory from './api-routes/parentcategory-route.js';
import paymentlist from './api-routes/paymentlist-route.js';
import modifier from './api-routes/prdouct-modifier-route.js';
import product from './api-routes/product-route.js';
import reciept from './api-routes/reciept-route.js';
import tableReservation from './api-routes/reservation&waitingList-route.js';
import role from './api-routes/role-route.js';
import smsMarketing from './api-routes/smsmarketing-route.js';
import tables from './api-routes/table-route.js';
import tax from './api-routes/tax-route.js';
import Auth from './api-routes/user-route.js';
import userRegisterWithEmailVerification from './api/emailVerification.js';
import passwordreset from './api/reset-password.js';
import recieptExampt from './api-routes/reciept-exampt.js'
import camera from './api-routes/camera-route.js'
import Supplier from './api-routes/supplier-route.js'
import Ingredients from './api-routes/ingredients-route.js'
import Ingredientcategory from './api-routes/ingredient-category-route.js'
import StockWastage from './api-routes/stock-wastage-route.js'
import Print from './api-routes/printer-route.js'
import Site from './api-routes/sitemanagement-route.js'
const app = express();
dotenv.config();
//middelwares
app.use(cors({
    origin: true,
    credentials: true,
    defaultErrorHandler: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json()); // Example limit of 10MB
app.use(bodyParser.json())

app.use(helmet({ crossOriginResourcePolicy: false, }));
app.use(morgan("dev"));
//uset Email Verification Endpoints
app.use('/api/v1/activate-account', userRegisterWithEmailVerification)
//user forgot and reset-password Endpoints
app.use('/api/v1/reset-password', passwordreset)
//All APi's Endponits
app.use('/api/v1', Auth, category, check, device, display, employee, menu, mu, order, orderitem, paymentlist, product, role, tax, tables, parentcategory, customer, Checkout, modifier, tableReservation, emailMarketing, smsMarketing, Loyaltyoffers, customization, logo, blog, contactus, employeTimeStamp, reciept, coupens, chatRoute, billdenomination,recieptExampt,camera,Supplier,Ingredients,Ingredientcategory,StockWastage,Print,Site)
let NODESERVER = null;
//Port
if (process.env.NODE_ENV === 'production') {
    app.use('*', (req, res) => {
        return res.status(404).json({
            success: false,
            message: 'API endpoint doesnt exist please put Api prod routes ..'
        })
    });
    const port = process.env.PORT || 3333;
    NODESERVER = app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
} else if (process.env.NODE_ENV === 'development') {
    app.get('/getCameraStreamUrl', async (req, res) => {
        const { cameraAddress, cameraPort, cameraUsername, cameraPassword } = req.query;
      
        try {
          // Discover the ONVIF camera
          console.log('Start the discovery process.');
          const device_info_list = await onvif.startProbe();
      
          if (device_info_list.length === 0) {
            return res.status(404).json({ error: 'No devices were found.' });
          }
      
          // Assuming there's at least one camera discovered
          const cam = new onvif.OnvifDevice({
            xaddr: `http://${cameraAddress}:${cameraPort}/onvif/device_service`,
            user: cameraUsername,
            pass: cameraPassword,
          });   
      
          await cam.init();
      
          // Get the UDP stream URL
          const streamUrl = cam.getUdpStreamUrl();
          console.log('Stream URL:', streamUrl);
      
          // Respond with the stream URL
          res.json({ streamUrl });
        } catch (error) {
          console.error('Error discovering camera or fetching stream URL:', error);
          res.status(500).json({ error: 'Error discovering camera or fetching stream URL' });
        }
      });
    app.use('*', (req, res) => {
        return res.status(404).json({
            success: false,
            message: 'API endpoint doesnt exist please put Api dev routes ..'
        })
    });
    const port = process.env.DEV_PORT || 4444;
    NODESERVER = app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
}

console.log('NODESERVER: ', NODESERVER);


const io = new Server(NODESERVER, {
    pingTimeout: 60000,
    cors: {
        origin: [process.env.LOCAL_LINK1, process.env.LOCAL_LINK2, process.env.PROD_LINK1, process.env.PROD_LINK2],
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("setup", (userData) => {
        socket.join(userData.userId);
        socket.emit("me", userData.userId);
        socket.emit("connected");
    });

    socket.on("new_message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat) return console.log("chat.users not defined");

        if (chat.Admin == newMessageReceived.senderId) {
            io.to(chat.user).emit("messagereceived", newMessageReceived);
        }
        if (chat.user == newMessageReceived.senderId) {
            io.to(chat.Admin).emit("messagereceived", newMessageReceived);
        }
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});

