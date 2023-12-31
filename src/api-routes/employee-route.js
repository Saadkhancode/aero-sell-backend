import express  from "express";
const routes=express.Router();

import {getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    employeeLogin,getEmployeeById,
    getEmployeeType,
    postEmployeeType,
    deleteEmployeeType,
    getEmployeeTypeById
} from "../api/employee.js"

routes.get('/employee', getEmployee )
routes.get('/employeetype', getEmployeeType )
routes.get('/employeetype/:_id', getEmployeeTypeById )
routes.get('/employee/:_id', getEmployeeById )

routes.post('/employee', postEmployee )
routes.post('/employeetype', postEmployeeType )
routes.post('/employeeLogin', employeeLogin )
routes.put('/employee/:_id', updateEmployee )
routes.delete('/employee/:_id', deleteEmployee )
routes.delete('/employeetype/:_id', deleteEmployeeType )


export default routes