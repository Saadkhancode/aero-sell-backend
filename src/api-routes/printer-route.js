import express from 'express'
import {printReceipt} from '../api/print.js'
import {awsupload} from "../middlewares/aws-s3-upload.js";
 const router=express.Router()
 router.post('/print', printReceipt);


 export default router