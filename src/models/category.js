import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({

    name: {
        type: String
    },
    extraData: {
        type: String
    },
    categoryType: {
        type: String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    order: {
        type: Number
    },
    hasPicture: {
        type: Boolean
    },
    active: {
        type: String
    },
    displayManagerId: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'display' 
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'parentcategory'
    },
    lampixIcon: {
        type: String
    },
    translation: {
        type: String
    },
    showPictures: {
        type: Boolean
    },
    
    creatdateFormat: {
        type: Date,
        default: Date.now
    }
}) 
const category = mongoose.model("category", categorySchema);
export default category;