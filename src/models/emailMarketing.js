import mongoose from 'mongoose';

const emailMarketingSchema = new mongoose.Schema({
    email: {
        type: [String]
    },
    subject: {
        type: String
    },
    message: {
        type: String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
},{timestamps:true})
const emailMarketing = mongoose.model("emailMarketing", emailMarketingSchema);
export default emailMarketing;