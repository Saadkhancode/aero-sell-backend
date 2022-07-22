import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
     id:{
        type:Number
     },
    categoryParents: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category"
    }],
    barCode: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    inHouseTaxValue: {
        type: Number
    },
    takeawayTaxValue: {
        type: Number
    },
    shortDescription: {
        type: String
    },
    fullDescription: {
        type: String
    },
    order: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"order" 
    }],
    active: {
        type: Boolean
    },
    categoryId:
   [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'category'
   }],
    inHouseTaxId: {
        type: Number   
    },
    takeawayTaxId: {
        type: Number
    },
    hasPicture: {
        type: Boolean
    },
    extraData: {
        type: String
    },
    translations: {
        type: String
    },
    productPictureId: {
        type: String
    },
    productType: {
        type: String
    }

})
const product = mongoose.model('product', productSchema)
export default product;