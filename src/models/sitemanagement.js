import mongoose from 'mongoose'
const siteManagementSchema=new mongoose.Schema({
    SiteName:{
        type: String
    },
    NumberOfTables:{
        type:String
    },
    BriefDescription:{
        type:String
    },
    Tables:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tables'
    }],
    SiteImage:{
        type:String
    },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    IsActive:{
        type:String
    }
    
})
const siteManagementModel=mongoose.model('siteManagment',siteManagementSchema);
export default siteManagementModel;