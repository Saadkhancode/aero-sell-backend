import express  from "express";
import {awsupload} from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getBlog,
    postBlog,
    updateBlog,
    deleteBlog
} from "../api/bolgs.js"

routes.get('/blog', getBlog )

routes.post('/blog',awsupload.single("blog_img"), postBlog )
routes.put('/blog/:_id',awsupload.single("blog_img"), updateBlog )
routes.delete('/blog/:_id', deleteBlog )


export default routes