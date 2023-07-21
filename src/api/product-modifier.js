import { Category1 } from "../models/productmodifier.js";

export const getaddnewcategory = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    } else if (req.query.productId) {
        filter = { productId: req.query.productId.split(',') }
    }
    let modifierData = await Category1.find(filter).populate("productId")
    res.send(modifierData)
}
export const getaddnewcategoryById = async (req, res) => {
    let modifierData = await Category1.findOne(req.params)
    res.send(modifierData)
}

//post
export const addnewcategory = async (req, res) => {
    const newCategory = await new Category1({ categories: req.body.categories, productId: req.body.productId, userId: req.body.userId });
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
};

//put 

export const putaddnewcategory = async (req, res) => {
    const { _id } = req.params;
    const { name, subcategories } = req.body;

    const updatedCategory = await Category1.findOneAndUpdate(
        { _id: _id },
        { name, subcategories },
        { new: true }
    );
    res.json(updatedCategory);
};

//delete

export const dleteaddnewcategory = async (req, res) => {
    const { id } = req.params;
    await Category1.deleteOne({ _id: id });
    res.sendStatus(204);
};