import reciept from '../models/reciept.js'

export const getReciept = async (req, res) => {
    let filter={}
    if(req.query.userId){
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await reciept.find(filter);
    res.send(data);
    

}

export const getRecieptById = async (req, res) => { 
    let data = await reciept.findById(req.params);
    res.send(data);

}

export const postReciept = async (req, res) => { 
    // let { recieptNo, tableNo, customer, operator, product, itemTotal, discount, subtotal, tax, loyality, total } = req.params;
    // const data = await new reciept({ recieptNo, tableNo, customer, operator, product, itemTotal, discount, subtotal, tax, loyality, total });
    const data = await new reciept(req.body);
    await data.save().then(result => {
        console.log(result, "Reciept data save to database")
        res.json({
            result,
          message : "Reciept data save to database",
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}


export const updateReciept = async (req, res) => {
    console.log(req.params.id)
    let data = await reciept.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "reciept data updated successfully" });
    }
    else {
        res.send({ message: "reciept data cannot be updated successfully" })
    }
}
export const deleteReciept = async (req, res) => {
    console.log(req.params)
    let data = await reciept.deleteOne(req.params)
    if (data) {
        res.send({ message: "reciept data delete successfully" });
    }
    else {
        res.send({ message: "reciept data cannot delete successfully" })
    }
}