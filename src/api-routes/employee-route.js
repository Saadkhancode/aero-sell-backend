import express  from "express";
const routes=express.Router();

import {getEmployee,
    postEmployee,
    updateEmployee,
    deleteEmployee
} from "../api/employee.js"

routes.get('/employee', getEmployee )

routes.post('/employee', postEmployee )
routes.put('/employee/:_id', updateEmployee )
routes.delete('/employee/:_id', deleteEmployee )


export default routes