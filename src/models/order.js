import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const orderSchema = new mongoose.Schema({
    tableNo: {
        type:Number
    },
    tableName:{
        type:String
    },
    orderNo:{
        type:Number
    },
    distype:{
        type:Boolean,
    },
    dueamount:{
        type:Number,
    },
    discount:{
        type:Number
    },
    loyalty:{
        type:Number
    },
    orderDate: {
        type: Date,
        default:timeStamp
    },
    startDate: {
        type: Date,
        default:timeStamp
    },
    currentOrderId: {
        type: String,
    },
    isHold:{
       type:Boolean,
       default:false
    },
    orderValueExclTax: {
        type: Number
    },
    orderValueTax: {
        type: Number
    },
    orderValue: {
        type: Number
    },
    parentOrderNo: {
        type: Number
    },
    orderStatus: {
        type: String, 
        enum:['new','proccessing','done']
    },
    orderType: {
        type: String,
        enum:['standard','notification'] 
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    operator:{
        type:String
    },
    employeeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'employee'
    },
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer'
    }


})
const order = mongoose.model('order', orderSchema);
export default order;
