import express from 'express'
import {awsupload} from '../middlewares/aws-s3-upload.js'
import { getSiteManagement, postSiteManagement, siteManagementUpdate, siteDelete, getSiteManagementById } from '../api/sitemanagement.js'
const router=express.Router();
router.get('/site',getSiteManagement)
router.get('/site/:_id',getSiteManagementById)
router.post('/site',awsupload.single('siteImage'), postSiteManagement)
router.put('/site/:_id', awsupload.single('siteImage'), siteManagementUpdate)
router.delete('/site/:_id',siteDelete)
export default router;