import express from 'express'
const route = express.Router()
import {
    getEmployeeTime,
    postEmployeeTime,
} from '../api/employetime.js'

route.get('/employeTime', getEmployeeTime)
route.post('/employeTime', postEmployeeTime)
// route.put('/employeTime/:_id', updateEmployeeTime)
export default route;