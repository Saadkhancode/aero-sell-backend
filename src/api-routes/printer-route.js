import express from 'express'
import {printReceipt} from '../api/print.js'
 const router=express.Router()
 router.post('/print',express.raw({ type: 'application/pdf' }),printReceipt)


 export default router