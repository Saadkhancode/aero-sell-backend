import orderitem from '../models/orderitem.js'
import customer from '../models/customer.js'
import Product from '../models/product.js'
import sendMail from '../middlewares/send-email.js'

export const getOrderItemByUserId = async (req, res) => {
    let filter = {}
    if (req.query.userId){
        filter = { userId: req.query.userId.split(',') }
    } else if (req.query.orderId){
        filter = { orderId: req.query.orderId.split(',') }
    } else if (req.query.orderStatus){
        filter = { orderStatus: req.query.orderStatus.split(',') }
    }
    let data = await orderitem.find(filter).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate("selectedModifiers").populate('paymentType').populate('table').populate('orderId')

    res.send(data);
}

export const getOrderItemById = async (req, res) => {

    let data = await orderitem.findOne(req.params).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate('paymentType').populate('table').populate('orderId')
    res.send(data);
}

export const getOrderItems = async (req, res) => {

    let data = await orderitem.find(req.params).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate('paymentType').populate('table').populate({ path: "product", populate: { path: "userId", model: "user"}}).populate('orderId')
    res.send(data);
}

export const postOrderItem = async (req, res) => {
    const { orderId, table, product, selectedModifiers,loyalityOffer, points,orderStatus, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text, customerId, dueamount, createdAt, updatedAt, userId, paymentType } = req.body;
    const data = await new orderitem({ orderId, table, product,orderStatus, selectedModifiers, loyalityOffer,points, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text, customerId, dueamount, createdAt, updatedAt, userId, paymentType });
    let prod = []
    prod = product
    await data.save().then(async (result) => {
        const customerPoints = priceExclTax / 5;
        const customerById = await customer.findById(customerId)
        console.log("prod",prod);
        prod.map(async (item) => {
            const products = await Product.findOne({ _id: item._id }).populate('userId')
            await Product.findOneAndUpdate({_id:products._id}, { $set: { "totalQuantity": products.totalQuantity - item.quantity } })
            let filteredProductsName = []
            let userEmail = products.userId.email
            if (products.totalQuantity <= 5) {
                filteredProductsName.push(products.name)
            }
            if (products && userEmail && filteredProductsName) {
                sendMail(userEmail, "Low Stock Alerts", `<h2 style="background-color: #f1f1f1; padding: 20px;width:50%">These Products Are  Low  In  Stock</h2><br><h3 style="background-color: #f1f1f1; width:60%">${filteredProductsName}</h3>`)
            }
        })
        if (customerById) {
            const customerdata = await customer.findByIdAndUpdate(customerById, { $set: { "CustomerLoyalty.Points": customerById.CustomerLoyalty.Points + customerPoints } })
            console.log("customerAfterAddedPoints", customerdata);
            res.json({
                orderId: result.orderId,
                product: result.product,
                table: result.table,
                selectedModifiers: result.selectedModifiers,
                loyalityOffer:result.loyalityOffer,
                dueamount: result.dueamount,
                points: result.points,
                taxValue: result.taxValue,
                productWithQty: result.productWithQty,
                priceExclTax: result.priceExclTax,
                productPrice: result.productPrice,
                lineValueExclTax: result.lineValueExclTax,
                lineValueTax: result.lineValueTax,
                lineValue: result.lineValue,
                units: result.units,
                text: result.text,
                userId: result.userId,
                customerId: result.customerId,
                paymentType: result.paymentType,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                orderStatus:result.orderStatus
            })
        } else {
            res.json({
                orderId: result.orderId,
                product: result.product,
                dueamount: result.dueamount,
                loyalityOffer:result.loyalityOffer,
                points: result.points,
                taxValue: result.taxValue,
                productWithQty: result.productWithQty,
                priceExclTax: result.priceExclTax,
                productPrice: result.productPrice,
                lineValueExclTax: result.lineValueExclTax,
                lineValueTax: result.lineValueTax,
                lineValue: result.lineValue,
                units: result.units,
                text: result.text,
                userId: result.userId,
                customerId: result.customerId,
                paymentType: result.paymentType,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt,
                orderStatus:result.orderStatus
            })
        }

    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateOrderItem = async (req, res) => {

    console.log(req.params.id)
    let data = await orderitem.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    );
    if (data)
        res.send({ message: "orderitem data updated successfully" });
    else
        res.send({ message: "orderitem data cannot be updated successfully" })
}

export const deleteOrderItem = async (req, res) => {
    console.log(req.params)
    let data = await orderitem.deleteOne(req.params)
    if (data)
        res.send({ message: "orderitem data delete successfully" });
    else
        res.send({ message: "orderitem data cannot delete successfully" })
}


