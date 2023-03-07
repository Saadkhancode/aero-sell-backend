import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema({
    productName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    },
    offerQty: {
        type: Number
    },
    description: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
})
const loyaltyModel = mongoose.model("loyalty", loyaltySchema)

export default loyaltyModel;