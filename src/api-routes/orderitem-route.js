import express  from "express";
const routes=express.Router();

import {
    getOrderItemById,
    postOrderItem,
    updateOrderItem,
    deleteOrderItem,
    getOrderItemByUserId,
    getOrderItems
} from "../api/orderitem.js"

routes.get('/orderitem', getOrderItemByUserId )
routes.get('/orderitem/:_id', getOrderItemById )
routes.get('/orderitem', getOrderItems )

routes.post('/orderitem', postOrderItem )
routes.put('/orderitem/:_id', updateOrderItem )
routes.delete('/orderitem/:_id', deleteOrderItem )


export default routes