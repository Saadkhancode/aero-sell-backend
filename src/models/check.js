import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const checkSchema = new mongoose.Schema({
  
    checkNo: {
        type: Number
    },
    operator: {
        type: String
    },
    subTotal: {
        type: Number
    },
    tax: {
        type: Number
    },
    amount: {
        type: Number
    },
    orderStatus:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user',
    },
    table: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"tables" 
    },
    checkDate: {
        type: Date,
        default: timeStamp
    }
});

const check = mongoose.model("check", checkSchema);
export default check;