import express  from "express";
const routes=express.Router();

import {getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee,
    employeeLogin,getEmployeeById,
    getEmployeeType,
    postEmployeeType,
    deleteEmployeeType
} from "../api/employee.js"

routes.get('/employee', getEmployee )
routes.get('/employeetype', getEmployeeType )
routes.get('/employee/:_id', getEmployeeById )

routes.post('/employee', postEmployee )
routes.post('/employeetype', postEmployeeType )
routes.post('/employeeLogin', employeeLogin )
routes.put('/employee/:_id', updateEmployee )
routes.delete('/employee/:_id', deleteEmployee )
routes.delete('/employeetype/:_id', deleteEmployee )


export default routes