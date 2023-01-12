import express from 'express'
const router=express.Router()
import {
    postRecieveEmail
} from '../api/contactUs.js'
router.post('/receive',postRecieveEmail)
export default router ; 
