import mongoose from 'mongoose'
const orderChargeSchema = new mongoose.Schema({
  charge: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  superUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'superUser',
  },
  chargeFor:{
    type:String,
    default:'orderCharge'
  }
},{timestamps:true})
const userHardareSchema = new mongoose.Schema({
  charge: {
    type: String
  },
  superUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'superUser',
  },
  chargeFor:{
    type:String,
    default:'HardwareCharge'
  },
  plan:{
    type:String
  }
},{timestamps:true})
const AppChargeSchema = new mongoose.Schema({
  charge: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  superUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'superUser',
  },
  chargeFor:{
    type:String,
    default:'appCharge'
  },
  plan:{
    type:String
  }
},{timestamps:true})
export const chargeOrder = mongoose.model('charge', orderChargeSchema)
export const chargeApp = mongoose.model('chargeCustomer', AppChargeSchema)
export const chargeHardware = mongoose.model('chargeHardwate', userHardareSchema)
export default { chargeOrder, chargeApp,chargeHardware }