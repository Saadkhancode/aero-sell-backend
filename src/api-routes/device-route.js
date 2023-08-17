import express from "express";
import { awsupload } from '../middlewares/aws-s3-upload.js'
const routes = express.Router();

import {
    getDevices,
    getDevice,
    postDevice,
    updateDevice,
    deleteDevice
} from "../api/device.js"

routes.get('/device', getDevices)
routes.get('/device/:_id', getDevice)

routes.post('/device', awsupload.single('image'), postDevice)
routes.put('/device/:_id', awsupload.single('image'), updateDevice)
routes.delete('/device/:_id', deleteDevice)


export default routes