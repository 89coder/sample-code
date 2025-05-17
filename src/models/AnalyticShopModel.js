import mongoose from 'mongoose';
const { Schema } = mongoose;

const analyticShopSchema = new Schema({
  shop:{type: String},
  customerEmail: { type: String, },
  status: { type: String, },
  customerName: { type: String, }
  
}, { timestamps: true })

const AnalyticShop = mongoose.model("AnalyticShop", analyticShopSchema);

export default AnalyticShop;
