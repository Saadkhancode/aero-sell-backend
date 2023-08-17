import mongoose from 'mongoose';
var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(),
    current.getMonth(), current.getDate(), current.getHours(),
    current.getMinutes(), current.getSeconds(), current.getMilliseconds()));
const deivceSchema = new mongoose.Schema({
    name: {
        type: String
    },
    active: {
        type: String,
        default: true
    },
    Line1: {
        type: String
    },
    Line2: {
        type: String
    },
    City: {
        type: String
    },
    Phoneno: {
        type: String
    },
    State: {
        type: String
    },
    PostalCode: {
        type: String
    },
    Country: {
        type: String
    },
    image: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    createdDate: {
        type: Date,
        default: timeStamp
    }
})
const device = mongoose.model("device", deivceSchema);
export default device;