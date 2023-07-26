
import tax from '../models/tax.js'
export const getTax = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    let data = await tax.find(filter);
    res.send(data);
}
export const getTaxById = async (req, res) => {
    let data = await tax.findOne(req.params);
    res.send(data);
}

export const postTax = async (req, res) => {
    const { name, taxValue,userId,active,byDefault } = req.body;
    const data = await new tax({ name, taxValue,userId,active,byDefault });
    await data.save().then(result => {
        console.log(result, "Tax data save to database")
        res.json({
            name: result.name,
            taxValue: result.taxValue,
            active:result.active,
            byDefault: result.byDefault
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateTax = async (req, res) => {
    console.log(req.params)
    let data = await tax.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    }, { new: true }
    );
    if (data) {
        res.send({ message: "tax data updated successfully" });
    }
    else {
        res.send({ message: "tax data cannot be updated successfully" })
    }
}
export const deleteTax = async (req, res) => {
    console.log(req.params)
    let data = await tax.deleteOne(req.params)
    if (data) {
        res.send({ message: "tax data delete successfully" });
    }
    else {
        res.send({ message: "tax data cannot delete successfully" })
    }
}

