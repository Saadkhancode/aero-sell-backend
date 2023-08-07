import express from "express";
import {getCameras,
postCameras,
updateCameras,
deleteCameras,
getCamerasById} from '../api/camera.js'
const router =express.Router()
router.get('/camera',getCameras)
router.get('/camera/:_id',getCamerasById)
router.post('/camera',postCameras)
router.put('/camera/:_id',updateCameras)
router.delete('/camera/:_id',deleteCameras)
export default router
