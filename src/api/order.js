import order from '../models/order.js';

export const getOrder = async (req, res) => {
    let filter = {}
    if (req.query.tableId) {
        filter = { tableId: req.query.tableId.split(',') }
    }
    let data = await order.find(filter).populate('tableId', '_id').populate('tableNo', 'tableNo')
    res.send(data);

}

export const postOrder = async (req, res) => {
    const { tableId, orderNo, startDate, orderDate, points, orderValueExclTax, orderValueTax, orderValue, tableNo, parentOrderNo, orderStatus, orderType } = req.body;

    const data = await new order({ tableId, orderNo, startDate, orderDate, points, orderValueExclTax, orderValueTax, orderValue, tableNo, parentOrderNo, orderStatus, orderType });
    await data.save().then(result => {
        console.log(result, "Order data save to database")
        res.json({
            tableId: result.tableId,
            orderNo: result.orderNo,
            startDate: result.startDate,
            orderDate: result.orderDate,
            points: result.points,
            orderValueExclTax: result.orderValueExclTax,
            orderValueTax: result.orderValueTax,
            orderValue: result.orderValue,
            tableNo: result.tableNo,
            parentOrderNo: result.parentOrderNo,
            orderStatus: result.orderStatus,
            orderType: result.orderType
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateOrder = async (req, res) => {
    console.log(req.params)
    let data = await order.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    );

    if (data) {
        res.send({ message: "order data updated successfully" });
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