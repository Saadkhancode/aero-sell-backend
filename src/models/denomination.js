import mongoose from 'mongoose';

const billSchema  = new mongoose.Schema({
    denominations:[{
     type:{
         type:String
     },
     quantity:{
        type:Number
     },
     total:{
        type:Number
     },
     id:{
        type: String,
     }

 }
 ],
 totalCashOnhand: { 
    type: Number,    
    required: true   
  },
  EnteredBy:{
    type: String,    
    required: true  
  }
}, { timestamps: true })
const BillDenomination = mongoose.model('Denominations', billSchema);
export default BillDenomination




