import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const paymentlistSchema = new mongoose.Schema({
    name: {
        type: String
    },
    paymentsGTypeId: {
        type: String
    }, 
    isActive: {
        type: Boolean
    },
    defaultPayment: {
        type: Boolean
    },
    showCaption: {
        type: Boolean
    },
    createdAt: {
        type: Date,
        default: timeStamp
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    updatedAt: {
        type: timeStamp

    }
})
const paymentlist = mongoose.model('paymentlist', paymentlistSchema);
export default paymentlist;