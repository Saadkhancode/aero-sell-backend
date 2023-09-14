import express  from "express";
const routes=express.Router();

import {getUser,
    getSuperUser,
    login,
    deleteUser,
    updateUser,
    getUserById,
    updateSuperUser
} from "../api/user.js"

routes.get('/User', getUser )
routes.get('/superadmin', getSuperUser )
routes.get('/user/:_id',getUserById)

routes.post('/login', login )
routes.put('/user/:_id',updateUser)
routes.put('/superUser/:_id',updateSuperUser)
routes.delete('/user/:email',  deleteUser)



export default routes