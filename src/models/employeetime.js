import mongoose from 'mongoose'
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const employeeTimeSchema = new mongoose.Schema({
    startDate: {
        type: Date,
        default: timeStamp
    },
    endDate: {
        type: Date,
        default: timeStamp
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'employee'
    }
})
const emplyeeTime = new mongoose.model('emplyeeTime', employeeTimeSchema)
export default emplyeeTime;