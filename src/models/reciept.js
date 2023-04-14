import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const recieptSchema = new mongoose.Schema({
    recieptNo: {
        type: String,
    },
    tableNo: {
        type:String,
    },
    date: {
        type: Date,
        default: timeStamp
    },
    customer: {
        type: String,
    },
    operator: {
        type: String,
    },
    product: [{
        name: {
            type: String,

        },
        quantity: {
            type: Number,
        },
        amount: {
        }

    }],
  
    itemTotal: {
        type: Number,

    },
    discount: {
        type: Number,
    },
    subTotal: {
        type: Number,
    },
    tax: {
        type: Number,
    },
    loyality: {
        type: Number,
    },
    total: {
        type: Number,
    }

})

const reciept = mongoose.model('reciept', recieptSchema);
export default reciept;