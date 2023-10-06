import express from 'express'
import {printReceipt} from '../api/print.js'
 const router=express.Router()
 router.post('/print',printReceipt)


 export default router