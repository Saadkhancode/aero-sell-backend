import express from "express";
const routes = express.Router();

import {
    getCoupens,
    getCoupensById,
    postCoupens,
    deleteCoupens,
    updateCoupens
} from "../api/coupens.js"

routes.get('/coupens', getCoupens)
routes.get('/coupens/:_id', getCoupensById)

routes.post('/coupens', postCoupens)
routes.put('/coupens/:_id', updateCoupens)
routes.delete('/coupens/:_id', deleteCoupens)


export default routes