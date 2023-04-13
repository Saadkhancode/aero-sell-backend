import order from '../models/order.js';
import orderitem from '../models/orderitem.js';
import customer from '../models/customer.js'
import sendMail from '../middlewares/send-email.js          '
export const getOrder = async (req, res) => {
    let filter = {}
    if (req.query.userId)
        filter = { userId: req.query.userId.split(',') }
    else if (req.query.customerId)
        filter = { customerId: req.query.customerId.split(',') }

    let data = await order.find(filter).populate('customerId').populate('employeeId')
    res.send(data);

}

export const postOrder = async (req, res) => {
    const { tableNo, tableName, currentOrderId, startDate, orderDate,orderValueExclTax, orderValueTax, orderValue, parentOrderNo, orderStatus, orderType, isHold, userId, operator, discount,loyalty,dueamount ,recieptId, distype , employeeId, customerId } = req.body;

    const data = await new order({ tableNo, tableName, currentOrderId, startDate, orderDate,  orderValueExclTax, orderValueTax, orderValue, parentOrderNo, orderStatus, orderType, isHold, userId, operator,recieptId, discount,dueamount,loyalty, distype, employeeId, customerId });
    await data.save().then(async (result) => {
        const customerData = await customer.findById(customerId)
        if(customerData){

            if (req.body.loyalty > 0){
                console.log("loyalty points :",req.body.loyalty)
                await customer.findByIdAndUpdate(customerId,{ $set: { "CustomerLoyalty.Points": customerData.CustomerLoyalty.Points - 100 } })
            }
            await sendMail(customerData.Email, "Thanks Message", `<h2>Thanks for Visiting Out Store</h2>`)
            console.log("thanks email send to customer successfully")
            console.log(result, "Order data save to database")
            res.json({
                tableNo: result.tableNo,
                dueamount: result.dueamount,
                tableName: result.tableName,
                currentOrderId: result._id,
                startDate: result.startDate,
                orderDate: result.orderDate,
                points: result.points,
                orderValueExclTax: result.orderValueExclTax,
                orderValueTax: result.orderValueTax,
                orderValue: result.orderValue,
                parentOrderNo: result.parentOrderNo,
                orderStatus: result.orderStatus,
                orderType: result.orderType,
                userId: result.userId,
                discount: result.discount,
                operator: result.operator,
                isHold: result.isHold,
                distype: result.distype,
                employeeId:result.employeeId,
                customerId: result.customerId,
                loyalty:result.loyalty
            })
        }else{
            res.json({
                tableNo: result.tableNo,
                dueamount: result.dueamount,
                tableName: result.tableName,
                currentOrderId: result._id,
                startDate: result.startDate,
                orderDate: result.orderDate,
                points: result.points,
                orderValueExclTax: result.orderValueExclTax,
                orderValueTax: result.orderValueTax,
                orderValue: result.orderValue,
                parentOrderNo: result.parentOrderNo,
                orderStatus: result.orderStatus,
                orderType: result.orderType,
                userId: result.userId,
                discount: result.discount,
                operator: result.operator,
                isHold: result.isHold,
                distype: result.distype,
                employeeId:result.employeeId,
                customerId: result.customerId,
                loyalty:result.loyalty
            })
            
        }
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateOrderItemByOrderId = async (req, res) => {
    const { orderId } = req.query
    console.log("orderId", orderId);
    let orderItem = await orderitem.findOneAndUpdate({
        "$or": [
            { orderId: orderId }
        ]
},{
    $set:req.body
})
    if (orderItem) {
        res.send({ message: "orderitem data by orderId update successfully" });
    } else {
        res.send({ message: "orderitem data cannot update successfully" })
    }
}

export const deleteOrderItemByOrderId = async (req, res) => {
    const { orderId } = req.query
    console.log("orderId", orderId);
    let orderItem = await orderitem.findOneAndDelete({
        "$or": [
            { orderId: orderId }
        ]
    })
    if (orderItem) {
        res.send({ message: "orderitem data by orderId delete successfully" });
    } else {
        res.send({ message: "orderitem data cannot delete successfully" })
    }
}
export const updateOrder = async (req, res) => {

    let data = await order.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    )
    if (data) {
        res.status(200).json(
            { data, message: "order data updated successfully" });
    }
    else {
        res.send({ message: "order data cannot be updated successfully" })
    }

}


export const deleteOrder = async (req, res) => {
    console.log(req.params)
    let data = await order.deleteOne(req.params)
    if (data) {
        res.send({ message: "order data delete successfully" });
    }
    else {
        res.send({ message: "order data cannot delete successfully" })
    }
}