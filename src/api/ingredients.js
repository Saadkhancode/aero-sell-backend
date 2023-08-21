import IngredientModel from '../models/ingredients.js';

export const getIngredients = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await IngredientModel.find(filter);
    res.send(data);
}
export const getIngredient = async (req, res) => {
    let data = await IngredientModel.findOne(req.params);
    res.send(data);
}

export const postIngredient = async (req, res) => {
    const { IngredientName, userId,Description,UnitofMeasurement,Unitprice,Supplier,CurrentStock ,ThresholdLevel,Allergens,ShelfLife,StorageInstructions,CategoryType,Alternative,NutritionalInformation,Notes,Active } = req.body;
    try {
        const lastProduct = await IngredientModel.findOne({}, {}, { sort: { '_id': -1 } });
        console.log("last product : ", lastProduct)
        
        let numericCount = 1; // Default value if no previous data

        if (lastProduct && lastProduct.IngredientID) {
            const lastNumericCount = parseInt(lastProduct.IngredientID.slice(3), 10);
            numericCount = lastNumericCount + 1;
        }
        
        const IngredientID = `ING${numericCount.toString().padStart(4, '0')}`;

        const data = new IngredientModel({ IngredientID, IngredientName, userId,Description,UnitofMeasurement,Unitprice,Supplier,CurrentStock ,ThresholdLevel,Allergens,ShelfLife,StorageInstructions,CategoryType,Alternative,NutritionalInformation,Notes,Active });
        const result = await data.save();
        console.log(result, "Ingredient data saved to the database")
        res.json({
            IngredientID: result.IngredientID,
            IngredientName: result.IngredientName,
            userId: result.userId,
            Description: result.Description,
            UnitofMeasurement: result.UnitofMeasurement,
            Unitprice: result.Unitprice,
            Supplier: result.Supplier,
            CurrentStock: result.CurrentStock,
            ThresholdLevel: result.ThresholdLevel,
            Allergens:result.Allergens,
            ShelfLife:result.ShelfLife,
            StorageInstructions:result.StorageInstructions,
            CategoryType:result.CategoryType,
            Alternative:result.Alternative,
            NutritionalInformation:result.NutritionalInformation,
            Notes:result.Notes,
            Active:result.Active
        });
    } catch (err) {
        res.status(400).send('Unable to save to the database');
        console.log(err);
    }
};


export const updateIngredient = async (req, res) => {
    console.log(req.params.id)
    let data = await IngredientModel.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "Ingredient data updated successfully" });
    }
    else {
        res.send({ message: "Ingredient data cannot be updated successfully" })
    }
}
export const deleteIngredient = async (req, res) => {
    console.log(req.params)
    let data = await IngredientModel.deleteOne(req.params)
    if (data) {
        res.send({ message: "Ingredient data delete successfully" });
    }
    else {
        res.send({ message: "Ingredient data cannot delete successfully" })
    }
}