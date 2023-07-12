import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const deivceSchema = new mongoose.Schema({
    name: {
        type: String
    },
    active: {
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    createdDate: {
        type: Date,
        default: timeStamp
    }
})
const device = mongoose.model("device", deivceSchema);
export default device;