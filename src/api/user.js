import { superUser, User } from '../models/User.js'
import employee from '../models/employee.js'
import jwt from "jsonwebtoken";


export const getUser = async (req, res) => {
  const user = await User.find(req)
  res.send(user)
}
export const getUserById = async (req, res) => {
  const user = await User.find(req.params)
  res.send(user)
}
export const getSuperUser = async (req, res) => {
  const user = await superUser.find(req)
  res.send(user)
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }) || await superUser.findOne({ email }) || await employee.findOne({ email })
  if (!user) {
    return res.status(400).send({ message: "User not found" });
  }
  if (user.password !== password) {
    return res.status(400).send({ message: "Wrong password" });
  }
  console.log('role: ', user.role);
  if (user.role == 'admin' || user.role == 'superadmin') {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    const userId = { _id: user._id }
    const role = user.role;
    const loginDate = user.createdDate
    return res.send({ message: "user login successfully", token, userId, role, loginDate, email: user.email });
  } else if (user.role == 'employee') {
    const userId = { _id: user.userId }
    return res.status(200).send({ message: "Employee Login Successfully", userId, startDate: user.startDate, employeId: user._id, firstName: user.firstName, lastName: user.lastName, role: user.role });
  }

}

export const updateUser = async (req, res) => {
  console.log(req.params)
  let data = await User.findByIdAndUpdate(
    { _id: req.params._id }, {
    $set: req.body
  }, {}, { new: true }
  );
  if (data) {
    res.send({ message: "User data updated successfully" });
  }
  else {
    res.send({ message: "User data cannot be updated successfully" })
  }
}
export const deleteUser = async (req, res) => {
  console.log(req.params)
  const { email } = req.params
  let data = await User.findOneAndDelete({ email })
  if (data) {
    res.send({ message: "User data delete successfully" });
  } else {
    res.send({ message: "User data cannot delete successfully" })
  }
}



