import wastageModel from '../models/stock-wastage.js';

export const getStockWastages = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await wastageModel.find(filter);
    res.send(data);
}
export const getStockWastage = async (req, res) => {
    let data = await wastageModel.findOne(req.params);
    res.send(data);
}

export const postStockWastage = async (req, res) => {
    const { IngredientName, userId, Quantity, ReasonOfWastage, PersonResponsible, Cost, Supplier, LocationOfWastage,DisposalPlan,PreventiveMeasure } = req.body;
    try {
        const data = new wastageModel({ IngredientName, userId, Quantity, ReasonOfWastage, PersonResponsible, Cost, Supplier, LocationOfWastage,DisposalPlan,PreventiveMeasure  });
        const result = await data.save();
        console.log(result, "StockWastage data saved to the database")
        res.json({
            IngredientName: result.IngredientName,
            Quantity: result.Quantity,
            userId: result.userId,
            ReasonOfWastage: result.ReasonOfWastage,
            PersonResponsible: result.PersonResponsible,
            Cost: result.Cost,
            Supplier: result.Supplier,
            LocationOfWastage: result.LocationOfWastage,
            DisposalPlan: result.DisposalPlan,
            PreventiveMeasure:res.PreventiveMeasure
        });
    } catch (err) {
        res.status(400).send('Unable to save to the database');
        console.log(err);
    }
};


export const updateStockWastage = async (req, res) => {
    console.log(req.params.id)
    let data = await wastageModel.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "StockWastage data updated successfully" });
    }
    else {
        res.send({ message: "StockWastage data cannot be updated successfully" })
    }
}
export const deleteStockWastage = async (req, res) => {
    console.log(req.params)
    let data = await wastageModel.deleteOne(req.params)
    if (data) {
        res.send({ message: "StockWastage data delete successfully" });
    }
    else {
        res.send({ message: "StockWastage data cannot delete successfully" })
    }
}