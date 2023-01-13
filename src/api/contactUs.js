import contactUsModel from "../models/contactUs.js";
import recieveMail from '../middlewares/recievemail.js'


export const postRecieveEmail = async (req, res) => {
    try {
        const { fullName, email, phone,message } = req.body
        const recievemail = await new contactUsModel({ fullName,phone, email, message })
        const recieverData = recievemail.save();
        await recieveMail(email,`<h4>${fullName}</h4><h4> ${phone}</h4>
        <p>${message}</p> `);
        return res.json({ message: `link send to patronworks email ${recieverData}` })

    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

}