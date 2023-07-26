import mongoose from 'mongoose';
const taxSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    taxValue: {
        type: String,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    byDefault:{
            type:Boolean
    },
    active:{
        type:String
    }
    
})
const tax = mongoose.model('tax', taxSchema)
export default tax;