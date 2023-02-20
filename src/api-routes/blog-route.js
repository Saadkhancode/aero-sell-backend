import express  from "express";
const routes=express.Router();

import {getBlog,
    postBlog,
    updateBlog,
    deleteBlog,
    getBlogById
} from "../api/bolgs.js"

routes.get('/blog', getBlog )
routes.get('/blog/:_id', getBlogById )

routes.post('/blog', postBlog )
routes.put('/blog/:_id', updateBlog )
routes.delete('/blog/:_id', deleteBlog )


export default routes