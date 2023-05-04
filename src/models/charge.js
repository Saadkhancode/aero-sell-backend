import mongoose from 'mongoose'
const userChargeSchema = new mongoose.Schema({
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
    default:'AppCharge'
  }
})
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
})
const ChargeSchema = new mongoose.Schema({
  charge: {
    type: String
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  chargeFor:{
    type:String,
    default:'OrderCharge'
  }
})
export const chargeModal = mongoose.model('charge', userChargeSchema)
export const chargModal = mongoose.model('chargeCustomer', ChargeSchema)
export const chargHardware = mongoose.model('chargeHardwate', userHardareSchema)
export default { chargModal, chargeModal,chargHardware }