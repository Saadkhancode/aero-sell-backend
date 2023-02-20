import mongoose from 'mongoose';
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
        required:true,
        ref:'user'
    }
})
const orderitem = mongoose.model('orderitem', orderItemSchema);
export default orderitem;

