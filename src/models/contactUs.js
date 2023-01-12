import mongoose from "mongoose";
const contactUsSchema=new mongoose.Schema({
    fullName:{
        type:String
    },
    phone:{
        type:String
    },
    email:{
        type:String
    },
    message:{
        type:String
    }
})
const contactUsModel=new mongoose.model('contactUs',contactUsSchema) 
export default contactUsModel;