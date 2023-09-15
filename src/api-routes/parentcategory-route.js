import express  from "express";
import {awsupload} from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getParentCategories,
    getParentCategoriesById,
    postParentCategories,
    updateParentCategories,
    deleteParentCategories,
} from "../api/parentcategory.js"

routes.get('/parentcategory', getParentCategories )
routes.get('/parentcategory/:_id',getParentCategoriesById )
// routes.get('/parentcategory/:key',getParentCategoriesById)

routes.post('/parentcategory',awsupload.single('parent_pic'), postParentCategories )
routes.put('/parentcategory/:_id',awsupload.single('parent_pic'), updateParentCategories )
routes.delete('/parentcategory/:_id', deleteParentCategories )


export default routes