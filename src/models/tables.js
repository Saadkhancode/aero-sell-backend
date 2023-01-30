import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const tablesSchema = new mongoose.Schema({
    tableNo: {
        type: String
    },
    tableName: {
        type: String
    },
    description: {
        type: String
    },
    hasLampixDevice: {
        type: String,
        default:'false',
        enum:['true','false']
    },
    tableimg:{
       type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    RecordDate: {
        type: Date,
        default: timeStamp
    }
})
const tables = mongoose.model("tables", tablesSchema);
export default tables;
