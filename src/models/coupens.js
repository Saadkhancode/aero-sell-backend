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
    }

})
const coupens = new mongoose.model('coupens', coupensSchema)
export default coupens;