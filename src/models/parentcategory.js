import mongoose from 'mongoose';
const parentCategorySchema = new mongoose.Schema({

    name: {
        type: String
    } ,
    parent_pic:{
        type:String
    },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
}) 
const parentcategory = mongoose.model("parentcategory", parentCategorySchema);

export default parentcategory;