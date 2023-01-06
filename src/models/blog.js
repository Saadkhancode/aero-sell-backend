import mongoose from 'mongoose';
const blogSchema = new mongoose.Schema({
    title: {
        type: String
    },
    shortDescription:{
       type:String
    },
    longDescription:{
       type:String
    },
    footer:{
        type:String
    },
    blog_img:{
        type:String
    }
},{timestamps:true})
const blog = mongoose.model("blog", blogSchema);
export default blog;