import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({

    lavel: {
        type: Number
    },
    rows: {
        type: Number
    },
    cols: {
        type: Number
    },
    categoryParents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "parentcategory"
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    ingredient: [{
        ingredientId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'ingredientsModel', 
          required: true
        },
        quantity: {
          type: Number,
          required: true
        }
      }],
    totalQuantity: {
        type: Number
    },
    barCode: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    retailPrice: {
        type: Number
    },
    isLock: {
        type: Boolean,
        default: false
    },
    shortDescription: {
        type: String
    },
    fullDescription: {
        type: String
    },
    ProductId: {
        type: String,
      },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mu'
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order'
    },
    active: {
        type: String
    },
    categoryId:
        [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'category'
        }],
    Product_pic: {
        type: String,
    },
    productPictureId: {
        type: String
    },
    productType: {
        type: String
    },
    hasPicture: {
        type: Boolean
    },
    value:{
        type:Number
    },
    startTime:{
        type:String
    },
    endTime:{
        type:String
    },
    courseDate:{
        type:String

    }

})
const product = mongoose.model('product', productSchema)
export default product;