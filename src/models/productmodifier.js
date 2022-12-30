import mongoose from "mongoose";
const productModifierSchema = new mongoose.Schema({
    Size: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mu'
    }],
    Caffein: {
        name: {
            type: String
        },
        active: {
            type: Boolean,
            deafult: false
        }
    },
    Espresso: {
        name: {
            type: String
        },
        active: {
            type: Boolean,
            deafult: false
        }
    },
    Flavors: {
        name: {
            type: String
        },
        active: {
            type: Boolean,
            deafult: false
        },
        price: {
            type: Number
        }
    },
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