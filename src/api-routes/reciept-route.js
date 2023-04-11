import express from "express";
const routes = express.Router();

import {
    getReciept,
    getRecieptById,
    postReciept,
    deleteReciept,
    updateReciept
} from "../api/reciept.js"

routes.get('/reciept', getReciept)
routes.get('/reciept/:_id', getRecieptById)

routes.post('/reciept', postReciept)
routes.put('/reciept/:_id', updateReciept)
routes.delete('/reciept/:_id', deleteReciept)


export default routes