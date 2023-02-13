import mongoose from 'mongoose'
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const employeeTimeSchema = new mongoose.Schema({
        empName: {
            type: String
        },
        startDate: {
            type: Date,
            default: timeStamp
        },
        startHour: {
            type: String
        },
        endDate: {
            type: Date,
            default: timeStamp
        },
        endHour: {
            type: String
        },
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee'
    }
})
const emplyeeTime = mongoose.model('emplyeeTime', employeeTimeSchema)
export default emplyeeTime;