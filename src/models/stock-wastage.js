import mongoose from "mongoose";
const wastageSchema=new mongoose.Schema({
    IngredientName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ingredientsModel'
    },
    Quantity:{
        type:Number
    },
    ReasonOfWastage:{
        type:String
    },
    PersonResponsible:{
        type:String
    },
    Cost:{
        type:Number
    },
    Supplier:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Supplier'
    },
    LocationOfWastage:{
        type:String
    },
    DisposalPlan:{
        type:String
    },
    PreventiveMeasure:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{timestamps:true})
const wastageModel=mongoose.model('wastageModel',wastageSchema)
export default wastageModel;