import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const employeeSchema = new mongoose.Schema({
    userName: {
        type: String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    employeeId: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    password: {
        type: String
    },
    confirmPassword: {
        type: String
    },
    role: {
        type: String,
        default: 'employee'
    },
    startDate: {
        type: Date,
        default: timeStamp
    },
    hourlyRate: {
        type : Number
    },
    employeeType: {
        type : mongoose.Schema.Types.ObjectId,
        ref:'EmployeeType'
    }
}, { timestamps: true })
const EmployeeTypeSchema=new mongoose.Schema({
    name:{
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})
const employee = mongoose.model("employee", employeeSchema);
const employeeType = mongoose.model("EmployeeType", EmployeeTypeSchema);
export {employee,employeeType};