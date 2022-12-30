import mongoose from 'mongoose';

const muSchema = new mongoose.Schema({
    code: {
        type: String
    },
    name: {
        type: String
    },
    active:{
        type:Boolean
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
})
const mu = mongoose.model("mu", muSchema);
export default mu;