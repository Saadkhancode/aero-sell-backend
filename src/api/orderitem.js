
import orderitem from '../models/orderitem.js'

export const getOrderItemByUserId = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }else if(req.query.orderId){
        filter={orderId:req.query.orderId.split(',')}
    }
    let data = await orderitem.find(filter).populate({path:"product",populate:{path:"categoryId",model:"category",populate:{path:"displayManagerId",model:"display"}}})

    res.send(data);
}

export const getOrderItemById = async (req, res) => {

    let data = await orderitem.findOne(req.params).populate({path:"product",populate:{path:"categoryId",model:"category",populate:{path:"displayManagerId",model:"display"}}})
    res.send(data);
}

export const postOrderItem = async (req, res) => {
    const { orderId, product, points, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text ,userId} = req.body;
    const data = await new orderitem({ orderId, product, points, taxValue, productWithQty, priceExclTax, lineValueExclTax, lineValueTax, lineValue, units, text,userId });
    await data.save().then(result => {
        console.log(result, "OrderItem data save to database")
        res.json({
            orderId: result.orderId,
            product: result.product,
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
            userId:result.userId,
        })
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
    if (data) {
        res.send({ message: "orderitem data updated successfully" });
    }
    else {
        res.send({ message: "orderitem data cannot be updated successfully" })
    }
}

export const deleteOrderItem = async (req, res) => {
    console.log(req.params)
    let data = await orderitem.deleteOne(req.params)
    if (data) {
        res.send({ message: "orderitem data delete successfully" });
    }
    else {
        res.send({ message: "orderitem data cannot delete successfully" })
    }
}


