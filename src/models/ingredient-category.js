import mongoose from "mongoose"
const ingredientCategorySchema=new mongoose.Schema({
    name:{
        type:String
    },
    // Active:{
    //     type:Boolean
    // },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{timestamps:true})
const ingredientCategoryModel=mongoose.model("ingredientCategoryModel",ingredientCategorySchema)
export default ingredientCategoryModel
