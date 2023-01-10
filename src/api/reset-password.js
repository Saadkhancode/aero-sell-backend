import User from '../models/User.js'
import Token from '../models/token.js';
import sendMail from '../middlewares/send-email.js';
import jwt from "jsonwebtoken";
import Joi from 'joi';
import express from "express"
const router = express.Router()
//reset password throght email
router.post("/", async (req, res) => {
    try {
        const schema = Joi.object({ email: Joi.string().email().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:'20min'})
            }).save();
        }

        const link = `${process.env.BASE_URL}/reset-password/${user._id}/${token.token}`;
        await sendMail(user.email, "Password Reset Link", `<h2>click on given link to reset ur password.</h2>
        ${link} `);
        return res.json({ message: `password-reset link send to your gmail account ` })

    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});

router.post("/:userId/:token", async (req, res) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).json({message:"invalid userId or expired"});

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).json({message:"Invalid Token or expired"});

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.json({
            message: 'Password Reset Successfully'
        });
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});
export default router;