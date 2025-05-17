import mongoose from 'mongoose';
const { Schema } = mongoose;

const installShopSchema = new Schema({
  shop:{type: String},
  accessToken: { type: String, },
  chargeId: { type: String, },
  appStatus: { type: String, },
  installDate: { type: String, },
  
}, { timestamps: true })

const InstallShop = mongoose.model("InstallShop", installShopSchema);

export default InstallShop;
