import mongoose from 'mongoose'
import Joi from 'joi';

var current = new Date();
const timeStamp = new Date(Date.UTC(current.getFullYear(), 
current.getMonth(),current.getDate(),current.getHours(), 
current.getMinutes(),current.getSeconds(), current.getMilliseconds()));
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
  } ,
  userId:{
    type:String
  },
  stripe_acess_token:{
    type:String
  },
  stripe_account_id:{ 
    type:String
  },
  stripe_refresh_token:{
    type:String
  },
  createdDate:{
    type:Date,
    default:timeStamp
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
  },
  userId:{
    type:String
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

// export {User,superUser};
