import express  from "express";
const routes=express.Router();

import {getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    employeeLogin,getEmployeeById
} from "../api/employee.js"

routes.get('/employee', getEmployee )
routes.get('/employee/:_id', getEmployeeById )

routes.post('/employee', postEmployee )
routes.post('/employeeLogin', employeeLogin )
routes.put('/employee/:_id', updateEmployee )
routes.delete('/employee/:_id', deleteEmployee )


export default routes