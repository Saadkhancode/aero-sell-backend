import mongoose from 'mongoose'
import Joi from 'joi';

const Schema = mongoose.Schema
const UserSchema = new Schema({
  name:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase:true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  },
  isActive:{
    type:Boolean,
    default:true
  } 
},{timestamps:true})

const superUserSchema = new Schema({
  name:{
    type: String,
  },
  email: {
    type: String,
    required: true,
    lowercase:true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
  }
})

// UserSchema.pre('save', async function (next) {
//   try {

//     if (this.isNew) {
//       const salt = await bcrypt.genSalt(10)
//       const hashedPassword = await bcrypt.hash(this.password, salt)
//       this.password = hashedPassword
//     }
//     next()
//   } catch (error) {
//     next(error)
//   }
// })

// UserSchema.methods.isValidPassword = async function (password) {
//   try {
//     return await bcrypt.compare(password, this.password)
//   } catch (error) {
//     throw error
//   }
// }
export const validate = (user) => {
  const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
  });
  return schema.validate(user);
};

export  const User = mongoose.model('user', UserSchema)
export const superUser=mongoose.model('superUser',superUserSchema)

export default {User,superUser};
