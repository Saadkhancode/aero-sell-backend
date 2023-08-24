import mongoose from "mongoose";
const coupensSchema = new mongoose.Schema({
   
    series: {
       type: String
    },
    description: {
        type: String
    },
    discount: {
        type: Number,
    },
    discountType: {
        type: String,
    },
    start: {
        type: Number
    },
    end: {
        type: Number
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }

})
const coupens = new mongoose.model('coupens', coupensSchema)
export default coupens;