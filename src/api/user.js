import {User,validate} from '../models/User.js'
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  const user = await User.find(req.params)
  res.send(user)
}

export const register = async (req, res) => {

  const { name, email, password ,role} =req.body;
 
  const userRegister = await User.findOne({email});
  
    if (userRegister) {
      return res.send({ message: "this user is already registered" })
    }
    const newUser = new User({ name,email, password,role });
    const savedUser = await newUser.save();
  if (savedUser) {
    res.send({ message: "Thanks for registering" });
  } else {
    res.status(400).send({ error: "Cannot register user at the moment!" });
  }

}
export const login = async (req, res) => {
  const { email, password } =req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  if (user.password !== password) {
    return res.status(400).send({ message: "Wrong password" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.send({ message: "user login successfully",token });
}

export const deleteUser=async(req,res)=>{
  console.log(req.params)
  const {email}=req.params
  let data = await User.findOneAndDelete({email})
  if (data) {
      res.send({ message: "User data delete successfully" });
  } else {
      res.send({ message: "User data cannot delete successfully" })
  }
}



