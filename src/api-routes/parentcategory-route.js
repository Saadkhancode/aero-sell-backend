import express  from "express";
const routes=express.Router();

import {getParentCategories,
    getParentCategoriesById,
    postParentCategories,
    updateParentCategories,
    deleteParentCategories,
} from "../api/parentcategory.js"

routes.get('/parentcategory', getParentCategories )
routes.get('/parentcategory/:_id', getParentCategoriesById )
// routes.get('/parentcategory/:key',getParentCategoriesById)

routes.post('/parentcategory', postParentCategories )
routes.put('/parentcategory/:_id', updateParentCategories )
routes.delete('/parentcategory/:_id', deleteParentCategories )


export default routes