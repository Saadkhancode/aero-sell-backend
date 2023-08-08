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
    let productData = await product.find(filter, filter2).populate('categoryId').populate('categoryParents', 'name').populate('userId').populate('order').populate('unit')
    let islock = productData.filter((item) => item.isLock == false)
    res.send(islock);

}
export const getFilteredProduct = async (req, res) => {
    let productData = await product.find().populate('categoryId').populate('categoryParents', 'name').populate('userId').populate('order').populate('unit')

    let ActiveProduct = productData?.filter((item) => item.userId?.isActive === true)
    res.send(ActiveProduct);
}
export const getProductById = async (req, res) => {
    let productData = await product.findOne(req.params).populate('categoryId', 'name').populate('order').populate('categoryParents', 'name').populate('unit')
    res.send(productData);
}
export const getProductByKey = async (req, res) => {
    let productData = await product.find({
        "$or": [{
            name: { $regex: req.params.key }
        }]
    }).populate('categoryId', 'name').populate('order').populate('categoryParents', 'name').populate('unit')
    let isLock = productData.filter((item) => item.isLock == false)
    res.send(isLock);
}

export const postProduct = async (req, res) => {
    const { lavel, rows, cols, categoryParents, barCode, name, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, totalQuantity, productId, productType, userId, unit } = req.body;
    const Product_pic = req.file ? req.file.location : null

    try {
        const lastProduct = await product.findOne({}, {}, { sort: { '_id': -1 } });
        const lastProductCount = lastProduct ? (lastProduct.ProductId || 0) : 0;
        let numericCount
        if (lastProductCount != 0) {

            numericCount = parseInt(lastProductCount.slice(2), 10) + 1;
        } else {

            numericCount = Number("0001")
        }
        const ProductId = `PR${numericCount.toString().padStart(4, '0')}`


        const productData = new product({ lavel, rows, cols, categoryParents, totalQuantity, barCode, name, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, productId, productType, userId, Product_pic, unit, ProductId });

        const savedProduct = await productData.save();

        res.json({
            lavel: savedProduct.lavel,
            cols: savedProduct.cols,
            rows: savedProduct.rows,
            unit: savedProduct.unit,
            ProductId: savedProduct.ProductId,
            categoryParents: savedProduct.categoryParents,
            barCode: savedProduct.barCode,
            name: savedProduct.name,
            price: savedProduct.price,
            retailPrice: savedProduct.retailPrice,
            totalQuantity: savedProduct.totalQuantity,
            order: savedProduct.order,
            active: savedProduct.active,
            categoryId: savedProduct.categoryId,
            hasPicture: savedProduct.hasPicture,
            productPictureId: savedProduct.productPictureId,
            productId: savedProduct.productId,
            productType: savedProduct.productType,
            userId: savedProduct.userId,
            Product_pic: savedProduct.Product_pic
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(400).send('Unable to save to database');
    }
}

export const updateProduct = async (req, res) => {
    const { lavel, rows, cols, categoryParents, barCode, name, Product_pic, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, totalQuantity, productId, productType, userId, unit } = req.body;
    const Product = await product.findById({ _id: req.params._id });
    if (!Product) {
        return res.status(404).send({ message: "Product data not found." });
    }
    let userId1
    if (Product.price != price) {
        await product.findByIdAndUpdate({ _id: req.params._id }, {
            $set: { "isLock": true }
        }, { new: true }).then(result => {
            userId1 = result.userId
        }).catch(error => {
            console.error(error)
            res.status(500).send({ message: "Error updating product data." });
        });
        const { lavel, rows, cols, categoryParents, barCode, name, Product_pic, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, totalQuantity, productId, productType, userId, unit } = req.body;
        const newProduct = await new product({ lavel, rows, cols, categoryParents, totalQuantity, barCode, name, price, retailPrice, shortDescription, fullDescription, order, active, categoryId, hasPicture, productPictureId, productId, productType, userId: userId1, Product_pic, unit });
        await newProduct.save().then(result => {
            return res.send({ message: "Product data saved successfully." });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({ message: "Error saving product data." });
        });
    } else {
        await product.findByIdAndUpdate({ _id: req.params._id }, {
            $set: req.body, Product_pic: Product_pic, isLock: false
        }, { new: true }).then(result => {
            return res.send({ message: "Product data updated successfully." });
        }).catch(error => {
            console.error(error);
            return res.status(500).send({ message: "Error updating product data." });
        });
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
