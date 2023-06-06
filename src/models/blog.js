import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
 
   dataArray:{
      type:Array
   },
   image:{
      type:String
   }


}, { timestamps: true })
const blog = mongoose.model("blog", blogSchema);
export default blog;