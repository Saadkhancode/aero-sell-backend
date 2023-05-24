import mongoose from 'mongoose'
const tableReservationAndWaitingListSchema=new mongoose.Schema({
    PartyName:{
        type:String
    },
    Guests:{
        type:Number
    },
    Email:{
        type:String,
    },
    Phone:{
        type:String
    },
    Note:{
        type:String
    },
    Private:{
        type:Boolean
    },
    Smoking:{
        type:Boolean
    },
    window:{
        type:Boolean
    },
    Booth:{
        type:Boolean
    },
    Boys:{
        type:Number
    },
    HighChairs:{
        type:Number
    },
    WheelChairs:{
        type:Number
    }    ,
    btnStatus:{
        type:String,
        enum:["Reservations","WaitingList","Tables"]
    },
    table:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'tables'
    },
    tableNo:{
        type:String,
    }
},
{timestamps:true});
const tableSelect=mongoose.model("tableRservationAndWaitingList",tableReservationAndWaitingListSchema);
export default tableSelect;