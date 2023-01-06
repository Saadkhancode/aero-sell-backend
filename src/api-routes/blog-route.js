import express  from "express";
import {awsupload} from "../middlewares/aws-s3-upload.js";
const routes=express.Router();

import {getBlog,
    postBlog,
    updateBlog,
    deleteBlog
} from "../api/bolgs.js"

routes.get('/blog', getBlog )

routes.post('/blog',awsupload.array("blog_img",4), postBlog )
routes.put('/blog/:_id',awsupload.array("blog_img",4), updateBlog )
routes.delete('/blog/:_id', deleteBlog )


export default routes