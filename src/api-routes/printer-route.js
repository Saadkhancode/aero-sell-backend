import express from 'express'
import {printReceipt} from '../api/print.js'
import {awsupload} from "../middlewares/aws-s3-upload.js";
 const router=express.Router()
 router.post('/print',awsupload.single('receipt'),printReceipt)


 export default router