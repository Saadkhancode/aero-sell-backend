import SupplierModel from '../models/supplier.js';

export const getSuppliers = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let data = await SupplierModel.find(filter);
    res.send(data);
}
export const getSupplier = async (req, res) => {
    let data = await SupplierModel.findOne(req.params);
    res.send(data);
}

export const postSupplier = async (req, res) => {
    const { SupplierName, userId, EmailAddress, ContactNumber, BussinessAddress, TaxIdentification, OtherInformation, ProductOffered } = req.body;
    try {
        const lastProduct = await SupplierModel.findOne({}, {}, { sort: { '_id': -1 } });
        console.log("last product : ", lastProduct)
        
        let numericCount = 1; // Default value if no previous data

        if (lastProduct && lastProduct.SupplierID) {
            const lastNumericCount = parseInt(lastProduct.SupplierID.slice(3), 10);
            numericCount = lastNumericCount + 1;
        }
        
        const SupplierID = `SUP${numericCount.toString().padStart(4, '0')}`;

        const data = new SupplierModel({ SupplierID, SupplierName, userId, EmailAddress, ContactNumber, BussinessAddress, TaxIdentification, OtherInformation, ProductOffered });
        const result = await data.save();
        console.log(result, "Supplier data saved to the database")
        res.json({
            SupplierID: result.SupplierID,
            SupplierName: result.SupplierName,
            userId: result.userId,
            EmailAddress: result.EmailAddress,
            ContactNumber: result.ContactNumber,
            BussinessAddress: result.BussinessAddress,
            TaxIdentification: result.TaxIdentification,
            OtherInformation: result.OtherInformation,
            ProductOffered: result.ProductOffered
        });
    } catch (err) {
        res.status(400).send('Unable to save to the database');
        console.log(err);
    }
};


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