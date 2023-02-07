import express  from "express";
const routes=express.Router();

import {getBlog,
    postBlog,
    updateBlog,
    deleteBlog
} from "../api/bolgs.js"

routes.get('/blog', getBlog )

routes.post('/blog', postBlog )
routes.put('/blog/:_id', updateBlog )
routes.delete('/blog/:_id', deleteBlog )


export default routes