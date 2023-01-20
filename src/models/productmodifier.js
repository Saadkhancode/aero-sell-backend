import mongoose from "mongoose";
const productModifierSchema = new mongoose.Schema({
    Size: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mu'
    }],
    Caffein: [{
        name: {
            type: String
        },
        quantity: {
            type:Number
        }
    }],
    Espresso:[{
        name: {
            type: String
        },
        quantity: {
            type:Number
        }
    }],
    Flavors: [{
        name: {
            type: String
        },
        quantity: {
            type:Number
        },
        price: {
            type: Number
        }
    }],
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }




})
const productModifierModel = mongoose.model("productModifier", productModifierSchema)
export default productModifierModel;