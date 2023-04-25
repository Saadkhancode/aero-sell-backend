import express from 'express'
import {
    getProductModifier,
    postProductModifier,
    updateProductModifier,
    deleteModifier,
    getaddnewcategory,
    addnewcategory,
    putaddnewcategory,
    dleteaddnewcategory
} from '../api/product-modifier.js'
const router = express.Router()
router.get('/modifier', getProductModifier)
router.post('/modifier', postProductModifier)

router.put('/modifier/:_id', updateProductModifier)
router.delete('/modifier/:_id', deleteModifier)

router.get('/categories1', getaddnewcategory)
router.post('/categories1', addnewcategory)
router.put('/categories1/:id', putaddnewcategory)
router.delete('/categories1/:id', dleteaddnewcategory)

export default router;