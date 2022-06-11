import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import Auth from './api/user.js';
import payer from './api/payer.js';
import table from './api/tables.js';
import category from './api/category.js'
import check from './api/check.js'
import device from './api/device.js'
import display from './api/display.js'
import employee from './api/employee.js'
import language from './api/language.js'
import menu from './api/menu.js'
import mu from './api/mu.js'
import order from './api/order.js'
import orderitem from './api/orderitem.js'
import paymentlist from './api/paymentList.js'
import posmenuitem from './api/posmenuitem.js'
import posmenu from './api/posmenu.js'
import product from './api/product.js'
import role from './api/role.js'
import tax from './api/tax.js'
import translate from './api/languagetranslation.js'

import './config/config.js';
import './middlewares/init-redis.js'

const app = express();
dotenv.config();
const port = process.env.PORT;
app.use(express.urlencoded({ extended: true }));


app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}
app.use(cors(corsOptions));



// app.use('/api/user', Auth);
app.use('/api/v1',Auth, payer, table, category, check, device, display, employee, language, menu, mu, order, orderitem, paymentlist, posmenuitem, posmenu, product, role, tax, translate)


app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist'
    })
});


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
