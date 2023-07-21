import express from 'express'
import {
    getaddnewcategory,
    addnewcategory,
    putaddnewcategory,
    getaddnewcategoryById,
    dleteaddnewcategory
} from '../api/product-modifier.js'
const router = express.Router()
router.get('/categories1', getaddnewcategory)
router.get('/categories1/:_id', getaddnewcategoryById)
router.post('/categories1', addnewcategory)
router.put('/categories1/:id', putaddnewcategory)
router.delete('/categories1/:id', dleteaddnewcategory)

export default router;