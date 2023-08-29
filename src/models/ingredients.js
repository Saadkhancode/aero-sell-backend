import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ingredientSchema = new mongoose.Schema({
    IngredientID: {
        type: String
    },
    IngredientName: {
        type: String
    },
    Description: {
        type: String
    },
    UnitofMeasurement: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'mu'
    },
    supplierId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    ThresholdLevel: {
        type: String
    },
    Allergens: {
        type: String
    },
    ShelfLife: {
        type: String
    },
    StorageInstructions: {
        type: String
    },
    CategoryType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ingredientCategoryModel'
    },
    Alternative: {
        type: String
    },
    stockHistory: [stockSchema],

    NutritionalInformation: {
        type: String
    },
    Notes: {
        type: String
    },
    Active: {
        type: Boolean
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    }
}, { timestamps: true });

const IngredientsModel = mongoose.model("ingredientsModel", ingredientSchema);
export default IngredientsModel;
