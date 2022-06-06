import express from "express";
import userModel from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//Register Api

router.get('/register',async(req,res)=>{
   const user=await userModel.find(req.data)
   res.send(user)
})

router.post("/register", async (req, res) => {

  const { fullName, email, password } = req.body;
  const userRegister = await userModel.findOne({ email });
  if (userRegister) {
      return res.send("this user is already registered")
  }
  const newUser = new userModel({ fullName, email, password });
  const savedUser = await newUser.save();
  // .catch((err) => {
  //   console.log("Error: ", err);
  // });
  
  if (savedUser) {
  return res.send({ message: "Thanks for registering" });
  }else{

    return res.send({ error: "Cannot register user at the moment!" });
  }

});

//Login Api
 router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  
  const userWithEmail = await userModel.findOne({ email }).catch(
    (err) => {
      console.log("Error: ", err);
    }
  );
  if (!userWithEmail)
  return res.send({ message: "Email  does not match!" });
  
  if (userWithEmail.password !== password)
  return res.send({ message: "password does not match!" });
  

  const jwtToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_SECRET
  );

  res.json({ fullName:userWithEmail.fullName,email:userWithEmail.email,password:userWithEmail.password, token: jwtToken });
});

export default router;

