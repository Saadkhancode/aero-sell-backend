import coupens from '../models/coupens.js'

export const getCoupens = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await coupens.find(filter);
    res.send(data);


}

export const getCoupensById = async (req, res) => {
    let data = await coupens.findById(req.params);
    res.send(data);

}

export const postCoupens = async (req, res) => {
    // const data = await new coupens(req.body);\
    const {series, description, discount, start, end, startDate, endDate, userId} = req.body;
    const couponData = await new coupens({ series, description, discount, start, end, startDate, endDate, userId });
    await couponData.save().then(result => {

        console.log(result, "coupens data save to database")
        res.json({
            series : result.series,
            descrition : result.description,
            discount: result.discount,
            start: result.start,
            end : result.end,
            startDate : result.startDate,
            endDate : result.endDate,
            userId: result.userId,
            message: "coupens data save to database",
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}


export const updateCoupens = async (req, res) => {
    console.log(req.params.id)
    let data = await coupens.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "coupens data updated successfully" });
    }
    else {
        res.send({ message: "coupens data cannot be updated successfully" })
    }
}
export const deleteCoupens = async (req, res) => {
    console.log(req.params)
    let data = await coupens.deleteOne(req.params)
    if (data) {
        res.send({ message: "coupens data delete successfully" });
    }
    else {
        res.send({ message: "coupens data cannot delete successfully" })
    }
}