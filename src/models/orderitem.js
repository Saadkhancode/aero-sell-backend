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
    dueamount: {
        type: Number,
    },
    Status: {
        type: String,
        default: 'pending'
    },
    displayStatus: {
        type: [],
    },
    split: {
        type: Object,
        default: {}
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
    },
    table: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tables'
    },
    ReservedTable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tableRservationAndWaitingList'
    },
    orderStatus: {
        type: String,
        enum: ['physical', 'online','drivethru']
    },
    tax: [{
        name: {
            type: String
        },

        addtax: {
            type: Number
        }
    }],
    taxfake:{
           type:Number
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
    selectedModifiers: {
        type: Array
    },
    loyalityOffer: {
        type: Array
    },
    couponOffer: {
        type: Array
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
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        // required:true,
        ref: 'user'
    },
    paymentType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'paymentlist'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    customername:{
    type:String
    },
    vehicle:{
        type:String
    },
    orderNo:{
        type:Number
    },
    Color:{
        type:String
    }
   

})
const orderitem = mongoose.model('orderitem', orderItemSchema);
export default orderitem;

