import loyalty from '../models/loyalty-offers.js';

export const getLoyalty = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    let data = await loyalty.find(filter);
    res.send(data);
}

export const postLoyalty = async (req, res) => {
    const { productName,offerQty,description,userId} = req.body;
    const data = await new loyalty({ productName,offerQty,description,userId });
    await data.save().then(result => {
        console.log(result, "loyalty data save to database")
        res.json({
            productName: result.productName,
            offerQty:result.offerQty,
            description:result.description,
            userId:result.userId
        })
    }
    ).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    }
    )
}
export const updateLoyalty = async (req, res) => {
    let data = await loyalty.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },
        { new: true }
    )
    if (data) {
        res.send({ message: "loyalty data updated successfully" });
    }
    else {
        res.send({ message: "loyalty data cannot be updated successfully" })
    }
}

export const deleteLoyalty = async (req, res) => {
    console.log(req.params)
    const loyaltyId = req.params
    let data = await loyalty.deleteOne(loyaltyId)
    if (data) {
        res.send({ message: "loyalty data delete successfully" });
    }
    else {
        res.send({ message: "loyalty data cannot delete successfully" })
    }
}
