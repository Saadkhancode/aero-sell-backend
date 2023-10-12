import express  from "express";
import {sendRecieptViaMail, sendcourseViaMail} from '../api/reciept-exampt.js'
import {awsupload} from "../middlewares/aws-s3-upload.js";
const router=express.Router()

router.post('/sendReciept',awsupload.single('receipt'),sendRecieptViaMail)
router.post('/sendCourseEmail',sendcourseViaMail)

export default router