import { Category1, productModifierModel } from "../models/productmodifier.js";
export const getProductModifier = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    } else if (req.query.productId) {
        filter = { productId: req.query.productId.split(',') }
    }
    let modifierData = await productModifierModel.find(filter).populate("Size").populate("productId", 'name')
    res.send(modifierData)
}
export const postProductModifier = async (req, res) => {
    const { Size, Caffein, Espresso, Flavors, userId, productId } = req.body
    const modifier = new productModifierModel({ Size, Caffein, Espresso, Flavors, userId, productId })
    await modifier.save().then(results => {
        console.log("modifier data send to database")
        res.json({
            Size: results.Size,
            Caffein: results.Caffein,
            Espresso: results.Espresso,
            Flavors: results.Flavors,
            userId: results.userId,
            productId: results.productId
        })
    }).catch(err => {
        res.status(400).send('unable to save modifier data to database')
        console.log(err);
    })
}
export const updateProductModifier = async (req, res) => {
    const modifier = await productModifierModel.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    }, { new: true })
    if (modifier) {
        res.status(200).send("modifier data updated successfully")
    } else {
        res.status(400).send("modifier data cannot be updated")
    }
}
export const deleteModifier = async (req, res) => {
    const modifier = await productModifierModel.findByIdAndDelete({ _id: req.params._id })
    if (modifier) {
        res.status(200).send("modifier data delete successfully")
    } else {
        res.status(400).send("modifier data cannot be deleted")
    }
}



//get
// export const getaddnewcategory = async (req, res) => {
//     const categories = await Category1.find();
//     res.json(categories);
// };


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

//post
export const addnewcategory = async (req, res) => {
    const { categories, subcategories, productId, userId } = req.body;

    // const newCategory = await new Category1({ categories: req.body.categories, Size: req.body.Size, productId: req.body.productId, userId: req.body.userId });
    const newCategory = await new Category1({ categories: req.body.categories, productId: req.body.productId, userId: req.body.userId });
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
};

//put 

export const putaddnewcategory = async (req, res) => {
    const { id } = req.params;
    const { name, subcategories } = req.body;

    const updatedCategory = await Category1.findOneAndUpdate(
        { _id: id },
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