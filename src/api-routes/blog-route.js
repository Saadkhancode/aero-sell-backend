import express from 'express';

import {
  deleteBlog,
  getBlog,
  getBlogById,
  postBlog,
  updateBlog,
} from '../api/bolgs.js';
import { awsupload } from '../middlewares/aws-s3-upload.js';

const routes=express.Router();

routes.get('/blog', getBlog )
routes.get('/blog/:_id', getBlogById )

routes.post('/blog',awsupload.single('image'), postBlog )
routes.put('/blog/:_id', updateBlog )
routes.delete('/blog/:_id', deleteBlog )


export default routes