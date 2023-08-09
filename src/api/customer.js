
import customer from '../models/customer.js'

export const getCustomer = async (req, res) => {
    let filter = {}
    if (req.query.userId) {
        filter = { userId: req.query.userId.split(',') }
    }
    let customerData = await customer.find(filter)
    res.send(customerData);

}
export const getCustomerById = async (req, res) => {
    let customerData = await customer.find(req.params)
    res.send(customerData);
}
export const searchCustomer = async (req, res) => {
    const { userId, FirstName, LastName, Email, Phone, Address1, City, State, PostalCode, CompanyName, CustomerId } = req.params
    console.log('req.params: ', req.params);

    let customerData = await customer.find({
        "$and": [
            { userId }
            ,
            {
                "$or": [
                    { FirstName: { $regex: new RegExp(String(FirstName),'i') } },
                    { LastName: { $regex: new RegExp(String(LastName),'i') } },
                    { Email: { $regex: String(Email) } },
                    { Phone: { $in: Number(Phone) } },
                    { Address1: { $regex: String(Address1) } },
                    { City: { $regex: String(City) } },
                    { State: { $regex: String(State) } },
                    { PostalCode: { $in: Number(!isNaN(PostalCode), true) } },
                    { CompanyName: { $regex: String(CompanyName) } },
                    { CustomerId: { $in: Number(!isNaN(CustomerId), true) } },
                ]
            }
        ]
    })
    console.log('customerData : ', customerData );
    
    return res.send(customerData);

}

export const postCustomer = async (req, res) => {
    const { CustomerId, userId, FirstName, LastName, Phone, Address1, Address2, Address3, postalCode, City, State, CompanyName,Email, Membership, CustomerLoyalty } = req.body;
    const customerData = await new customer({ CustomerId, userId, FirstName, LastName, Phone, Address1, Address2, Address3, postalCode, City, State, CompanyName,Email, Membership, CustomerLoyalty });
    await customerData.save().then(result => {
        console.log(result, "Customer data save to database")
        res.json({
            CustomerId: result.CustomerId,
            FirstName: result.FirstName,
            userId: result.userId,
            LastName: result.LastName,
            Phone: result.Phone,
            Address1: result.Address1,
            Address2: result.Address2,
            Address3: result.Address3,
            postalCode: result.postalCode,
            City: result.City,
            State: result.State,
            CompanyName: result.CompanyName,
            Email : result.Email,
            Membership: result.Membership,
            CustomerLoyalty: result.CustomerLoyalty,
            _id: result._id
            // CardNo:result.CardNo,
            // Type:result.Type,
            // StartDate:result.StartDate,
            // ExpiresIn:result.ExpiresIn,
            // Communication:result.Communication,
            // BirthDate:result.BirthDate,
            // Gender:result.Gender,
            // History:result.History,
            // Notes:result.Notes
        })
    }).catch(err => {
        res.status(400).send('unable to save database');
        console.log(err)
    })
}
export const updateCustomer = async (req, res) => {

    console.log(req.params.id)
    let data = await customer.findByIdAndUpdate(
        { _id: req.params._id }, {
        $set: req.body
    },

        { new: true }
    );
    if (data) {
        res.send({ message: "customer data updated successfully" });
    }
    else {
        res.send({ message: "customer data cannot be updated successfully" })
    }
}
export const deleteCustomer = async (req, res) => {
    console.log(req.params)
    let data = await customer.deleteOne(req.params)
    if (data) {
        res.send({ message: "customer data delete successfully" });
    }
    else {
        res.send({ message: "customer data cannot delete successfully" })
    }
}
