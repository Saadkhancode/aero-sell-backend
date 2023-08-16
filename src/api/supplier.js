import SupplierModel from '../models/supplier.js';

export const getSuppliers = async (req, res) => {
    let filter={}
    if(req.query.userId){
     filter={userId:req.query.userId.split(',')}
    }
    let data = await SupplierModel.find(filter);
    res.send(data);
}
export const getSupplier = async (req, res) => {
    let data = await Supplier.findOne(req.params);
    res.send(data);
}

export const postSupplier = async (req, res) => {
    const { SupplierID,SupplierName, userId,EmailAddress,ContactNumber,BussinessAddress,TaxIdentification,OtherInformation,ProductOffered } = req.body;
    const data = await new SupplierModel({  SupplierID,SupplierName, userId,EmailAddress,ContactNumber,BussinessAddress,TaxIdentification,OtherInformation,ProductOffered});
    await data.save().then(result => {
        console.log(result, "Supplier data save to database")
        res.json({
            SupplierID: result.SupplierID,
            SupplierName: result.SupplierName,
            userId:result.userId,
            EmailAddress:result.EmailAddress,
            ContactNumber:result.ContactNumber,
            BussinessAddress:result.BussinessAddress,
            TaxIdentification:result.TaxIdentification,
            OtherInformation:result.OtherInformation,
            ProductOffered:result.ProductOffered
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateSupplier = async (req, res) => {
    console.log(req.params.id)
    let data = await SupplierModel.findByIdAndUpdate(
        { _id: req.body._id },
        {
            $set: req.body
        });
    if (data) {
        res.send({ message: "Supplier data updated successfully" });
    }
    else {
        res.send({ message: "Supplier data cannot be updated successfully" })
    }
}
export const deleteSupplier = async (req, res) => {
    console.log(req.params)
    let data = await SupplierModel.deleteOne(req.params)
    if (data) {
        res.send({ message: "Supplier data delete successfully" });
    }
    else {
        res.send({ message: "Supplier data cannot delete successfully" })
    }
}