import mongoose from "mongoose";

const cameraSchema=new mongoose.Schema({
    username:{
        type:String
    },
    password:{
        type:String
    },
    port:{
        type:Number
    },  
    ipAddress:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
})
const cameraModel=mongoose.model('Camera',cameraSchema)
export default cameraModel