import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const orderItemSchema = new mongoose.Schema({
    points: {
        type: Number
    },
    taxValue: {
        type: Number
    },
    dueamount:{
        type:Number,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    },
    table:{
         type:mongoose.Schema.Types.ObjectId,
         ref:'tables'
    },
    orderStatus:{
        type:String,
        enum:['physical','online']
    },
    productWithQty: [{
        productId: {
            type: String,//stringt
        },
        qty: {
            type: Number // number field
        },
        price: {
            type: Number // number field
        },
        discount: {
            type: Number
        },
        reason: {
            type: String
        },

        oldAmount: {
            type: Number
        },
        newAmount: {
            type: Number
        },
        discountTypePr: {
            type: Boolean
        }

    }],
    product: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }],
    selectedModifiers:{
          type:Array
    },
    priceExclTax: {
        type: Number
    },

    lineValueExclTax: {
        type: Number
    },

    lineValueTax: {
        type: Number
    },

    lineValue: {
        type: Number
    },

    units: {
        type: Number
    },
    text: {
        type: String
    } ,
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'customer'
    },
     userId:{
        type:mongoose.Schema.Types.ObjectId,
        // required:true,
        ref:'user'
    },
    paymentType:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'paymentlist'
    },
    createdAt: {
        type: Date,
        default: timeStamp
    },
    updatedAt: {
        type:Date,
        default:timeStamp
    }
})
const orderitem = mongoose.model('orderitem', orderItemSchema);
export default orderitem;

