import express from "express";
import {getCameras,
postCameras,
updateCameras,
deleteCameras} from '../api/camera.js'
const router =express.Router()
router.get('/camera',getCameras)
router.post('/camera',postCameras)
router.put('/camera/:_id',updateCameras)
router.delete('/camera/:_id',deleteCameras)
export default router
