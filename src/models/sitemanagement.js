import mongoose from 'mongoose'
const siteManagementSchema=new mongoose.Schema({
    siteName:{
        type: String
    },
    numberOfTables:{
        type:String
    },
    briefDescription:{
        type:String
    },
    tables:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tables'
    }],
    siteImage:{
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    isActive:{
        type:String
    }
    
})
const siteManagementModel=mongoose.model('siteManagment',siteManagementSchema);
export default siteManagementModel;