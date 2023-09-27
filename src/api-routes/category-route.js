import express  from "express";
import {awsupload} from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getCategories,
    getCategoriesById,
    postCategories,
    updateCategories,
    deleteCategories,
} from "../api/category.js"

routes.get('/category', getCategories )
routes.get('/category/:_id', getCategoriesById )

routes.post('/category',awsupload.single('category_pic') ,postCategories )
routes.put('/category/:_id',awsupload.single('category_pic'), updateCategories )
routes.delete('/category/:_id', deleteCategories )


export default routes