import mongoose, { mongo } from "mongoose";
const supplierSchema=new mongoose.Schema({
    SupplierID:{
        type:String
    },
    SupplierName:{
        type:String
    },
    EmailAddress:{
        type:String
    },
    ContactNumber:{
        type:Number
    } ,
    BussinessAddress:{
        type:String
    },
    TaxIdentification:{
        type:String
    },
    OtherInformation:{
        type:String
    },
    ProductOffered:{
        type:String
    }, 
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
    
},{timestamps:true})
const SupplierModel= mongoose.model('Supplier',supplierSchema)
export default SupplierModel
