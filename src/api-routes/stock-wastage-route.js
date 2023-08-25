import express  from "express";
import { awsupload } from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getStockWastage,
    getStockWastages,
    postStockWastage,
    updateStockWastage,
    deleteStockWastage
} from "../api/stock-wastage.js"

routes.get('/StockWastage', getStockWastages )
routes.get('/StockWastage/:_id', getStockWastage )

routes.post('/StockWastage', postStockWastage )
routes.put('/StockWastage/:_id', updateStockWastage )
routes.delete('/StockWastage/:_id', deleteStockWastage )


export default routes