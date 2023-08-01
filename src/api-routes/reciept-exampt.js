import express  from "express";
import {sendRecieptViaMail} from '../api/reciept-exampt.js'

const router=express.Router()

router.post('/sendReciept',sendRecieptViaMail)

export default router