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
// const Category1 = mongoose.model('Category1', category1Schema);

// Define the API endpoint for updating quantity
// app.put('/updateQuantity', async (req, res) => {
export const updatemod =async (req, res) => {
  try {
    const productId = req.body.productId; // Assuming you pass productId in the request body
    const subcategoryName = req.body.subcategoryName; // Assuming you pass subcategoryName in the request body
    const newQuantity = req.body.newQuantity; // Assuming you pass newQuantity in the request body

    // Find the document that matches the productId and userId
    console.log("category : ::::::: : ",req.body.productId)
    console.log("category : ::::::: : ",productId)
    const category = await Category1.findOne({ productId: productId });
    console.log("category : ::::::: : ",category)

    if (!category) {
      return res.status(404).json({ error: 'Category not found.' });
    }

    // Find the subcategory by name
    const subcategory = category.categories.find(cat => cat.subcategories.find(subcat => subcat.name === subcategoryName));

    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found.' });
    }

    // Update the totalQuantity field in the subcategory
    subcategory.subcategories.forEach(subcat => {
      if (subcat.name === subcategoryName) {
        subcat.totalQuantity = newQuantity;
      }
    });

    // Save the updated document
    await category.save();

    return res.status(200).json({ message: 'Quantity updated successfully.' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};




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