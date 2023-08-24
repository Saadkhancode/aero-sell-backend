import ingredientCategoryModel from '../models/ingredient-category.js';

export const getIngredientCategorys = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await ingredientCategoryModel.find(filter);
    res.send(data);
}
export const getIngredientCategory = async (req, res) => {
    let data = await ingredientCategoryModel.findOne(req.params);
    res.send(data);
}

export const postIngredientCategory = async (req, res) => {
    const {  name,userId } = req.body;
    try {
        const data = new ingredientCategoryModel({ name,userId  });
        const result = await data.save();
        console.log(result,{ message: "Ingredient-category data delete successfully" })
        res.json({
            message:"Data successfully saved!",
            name: result.name,
            userId:result.userId,
        });
    } catch (err) {
        res.status(400).send({ message: "Ingredient-category data delete successfully" });
        console.log(err);
    }
};


export const updateIngredientCategory = async (req, res) => {
    console.log(req.params.id)
    let data = await ingredientCategoryModel.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "Ingredient-category data updated successfully" });
    }
    else {
        res.send({ message: "Ingredient-category data cannot be updated successfully" })
    }
}
export const deleteIngredientCategory = async (req, res) => {
    console.log(req.params)
    let data = await ingredientCategoryModel.deleteOne(req.params)
    if (data) {
        res.send({ message: "Ingredient-category data delete successfully" });
    }
    else {
        res.send({ message: "Ingredient-category data cannot delete successfully" })
    }
}