import express from 'express'
import { getSiteManagement, postSiteManagement, siteManagementUpdate, siteDelete } from '../api/sitemanagement.js'
const router=express.Router();
router.get('/site',getSiteManagement)
router.post('/site',postSiteManagement)
router.put('/site/:_id',siteManagementUpdate)
router.delete('/site/:_id',siteDelete)
export default router;