import customer from '../models/customer.js';
import jwt from 'jsonwebtoken'

export const customerRegister = async (req, res) => {
const { FirstName, LastName, Email, Password, ConfirmPassword } = req.body
    try {
        const user = await customer.findOne({ Email, FirstName, LastName })

        if (user && !user.Password) {
            const customerUpdate = await customer.findOneAndUpdate({ Email, FirstName, LastName }, {
                Password: req.body.Password, ConfirmPassword: req.body.ConfirmPassword
            })
            if (customerUpdate) {
                res.status(200).send({ message: "Existing Customer register Successfully" })
            } else {
                res.status(400).send({ message: "Existing Customer cannot register Successfully" })
            }

        } else if(!user)  {
            const NewCustomer = await new customer({ FirstName, LastName, Email, Password, ConfirmPassword })
            const savedCustomer=NewCustomer.save();
            if (savedCustomer) {
                return res.status(200).send({ message: "New Customer register Successfuly" })
            } else {
                res.status(400).send({ message: "New Customer cannot register Successfully" })
            }
        }else{
            res.status(400).send({message:"customer is already register"})
        }
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
}
export const customerLogin = async (req, res) => {
    const { Email, Password } = req.body;
    const user = await customer.findOne({ Email })
    if (!user) {
        return res.status(400).send({ message: "User not found" });
    }
    if (user.Password !== Password) {
        return res.status(400).send({ message: "Wrong password" });
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const UserName=user.FirstName+ '' + user.LastName
    const  _id=user._id
    res.status(200).send({ message: "customer login successfully", token, UserName,_id });

}