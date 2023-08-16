import express  from "express";
import { awsupload } from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getSupplier,
    postSupplier,
    updateSupplier,
    deleteSupplier
} from "../api/supplier.js"

routes.get('/Supplier', getSupplier )

routes.post('/Supplier', postSupplier )
routes.put('/Supplier/:_id', updateSupplier )
routes.delete('/Supplier/:_id', deleteSupplier )


export default routes