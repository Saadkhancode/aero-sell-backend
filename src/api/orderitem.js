import orderitem from '../models/orderitem.js'
import customer from '../models/customer.js'
import Product from '../models/product.js'

export const getOrderItemByUserId = async (req, res) => {
    let filter = {}
    if (req.query.userId)
        filter = { userId: req.query.userId.split(',') }
    else if (req.query.orderId)
        filter = { orderId: req.query.orderId.split(',') }
    let data = await orderitem.find(filter).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate("selectedModifiers").populate('paymentType').populate('table')

    res.send(data);
}

export const getOrderItemById = async (req, res) => {

    let data = await orderitem.findOne(req.params).populate({ path: "product", populate: { path: "categoryId", model: "category", populate: { path: "displayManagerId", model: "display" } } }).populate('customerId').populate('paymentType').populate('table')
    res.send(data);
}

export const postOrderItem = async (req, res) => {
    const { orderId,table, product, selectedModifiers,points, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text,customerId,dueamount,createdAt,updatedAt, userId,paymentType } = req.body;
    const data = await new orderitem({ orderId,table, product,selectedModifiers, points, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text,customerId, dueamount,createdAt,updatedAt, userId,paymentType });
    await data.save().then(async (result) => {
        const customerPoints =priceExclTax / 5;
        console.log("customerpoints:",customerPoints);
        const customerById=await customer.findById(customerId)
        console.log("customerBeforeAddedPoints",customerById);
        // const selectedProds=result.product?.filter((item=> item._id) )
        // const filter=Object.assign({},selectedProds)
        // console.log('filter: ', filter);
        // const productsById=await Product.find().populate('product')
        // console.log('productById: ', productsById);
        
        if(customerById){
            const  customerdata=  await customer.findByIdAndUpdate(customerById, { $set: { "CustomerLoyalty.Points": customerById.CustomerLoyalty.Points + customerPoints } })
            console.log("customerAfterAddedPoints",customerdata);
            res.json({
                orderId: result.orderId,
                product: result.product,
                table:result.table,
                selectedModifiers:result.selectedModifiers,
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
                paymentType:result.paymentType,
                createdAt:result.createdAt,
                updatedAt:result.updatedAt
            })
        }else{
            res.json({
                orderId: result.orderId,
                product: result.product,
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
                paymentType:result.paymentType,
                createdAt:result.createdAt,
                updatedAt:result.updatedAt
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


