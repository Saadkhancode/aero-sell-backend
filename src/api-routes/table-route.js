import express  from "express";
import { awsupload } from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getTables,
    postTables,
    updateTables,
    deleteTables,
    getTableById,
    SearchUpdateTables
} from "../api/tables.js"

routes.get('/Tables', getTables )
routes.get('/Tables/:_id', getTableById )

routes.post('/Tables',awsupload.single('tableimg'), postTables )
routes.put('/Tables/:_id',awsupload.single('tableimg'), updateTables )
routes.put('/posTable',awsupload.single('tableimg'),SearchUpdateTables)
routes.delete('/Tables/:_id', deleteTables )


export default routes