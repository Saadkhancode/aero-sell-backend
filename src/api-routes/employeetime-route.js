import express from 'express'
const route = express.Router()
import {
    getEmployeeTime,
    postEmployeeTime,
    updateEmployeeTime
} from '../api/employetime.js'


route.get('/employeTime', getEmployeeTime)
route.post('/employeTime', postEmployeeTime)
route.put('/employeTime/:_id', updateEmployeeTime)
export default route;