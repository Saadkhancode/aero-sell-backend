import product from '../models/product.js';
import sendMail from '../middlewares/send-email.js'

export const getProduct = async (req, res) => {
    let filter = {}
    if (req.query.categoryId) {
        filter = { categoryId: req.query.categoryId.split(',') }
    }
    let filter2 = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let productData = await product.find(filter, filter2).populate('categoryId').populate('categoryParents', 'name').populate('userId').populate('order')
    let filteredProductsName = []
    let userEmail = productData[0].userId.email
    productData?.filter((item) => {
        if (item.totalQuantity <= 5) {
            filteredProductsName.push(item.name)
        }
    })

    sendMail(userEmail, "Low Stock Alerts", `<h2 style="background-color: #f1f1f1; padding: 20px;width:50%">These Products Are  Low  In  Stock</h2><br><h3 style="background-color: #f1f1f1; width:60%">${filteredProductsName}</h3>`)

    res.send(productData);

}
export const getFilteredProduct = async (req, res) => {
    let productData = await product.find().populate('categoryId').populate('categoryParents', 'name').populate('userId').populate('order')
    let ActiveProduct = productData?.filter((item) => item.userId.isActive === true)
    res.send(ActiveProduct);
}
export const getProductById = async (req, res) => {
    let productData = await product.findOne(req.params).populate('categoryId', 'name').populate('order').populate('categoryParents', 'name')

    res.send(productData);

}
export const getProductByKey = async (req, res) => {
    let productData = await product.find({
        "$or": [{
            name: { $regex: req.params.key }
        }]
    }).populate('categoryId', 'name').populate('order').populate('categoryParents', 'name')
    res.send(productData);

}

export const postProduct = async (req, res) => {
    const { lavel, rows, cols, categoryParents, barCode, name, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, totalQuantity, productId, productType, userId } = req.body;
    const Product_pic = req.file ? req.file.location : null

    const productData = await new product({ lavel, rows, cols, categoryParents, totalQuantity, barCode, name, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, productId, productType, userId, Product_pic });
    await productData.save().then(result => {
        console.log(result, "Product data save to database")
        res.json({
            lavel: result.lavel,
            cols: result.cols,
            rows: result.rows,
            categoryParents: result.categoryParents,
            barCode: result.barCode,
            name: result.name,
            price: result.price,
            retailPrice: result.retailPrice,
            totalQuantity: result.totalQuantity,
            order: result.order,
            active: result.active,
            categoryId: result.categoryId,
            hasPicture: result.hasPicture,
            productPictureId: result.productPictureId,
            productId: result.productId,
            productType: result.productType,
            userId: result.userId,
            Product_pic: result.Product_pic
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateProduct = async (req, res) => {
    const Product_pic = req.file ? req.file.location : null
    console.log(req.params._id)
    let data = await product.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body, Product_pic: Product_pic
    },
        { new: true }
    );
    if (data) {
        res.send({ message: "product data updated successfully" });
    }
    else {
        res.send({ message: "product data cannot be updated successfully" })
    }
}
export const deleteProduct = async (req, res) => {
    console.log(req.params)
    let data = await product.deleteOne(req.params)
    if (data) {
        res.send({ message: "product data delete successfully" });
    }
    else {
        res.send({ message: "product data cannot delete successfully" })
    }
}
