import mongoose from "mongoose";

const { Schema } = mongoose;

const DiscountCodeSchema = new Schema({
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  code: { type: String },
  planName: { type: Array },
  value: { type: Number },
  trialDays: { type: Number },
  codeType: { type: String },
  upgradeManual: { type: Boolean, default: false },
  type: { type: String },
});

const DiscountCode = mongoose.model("discountCode", DiscountCodeSchema);
export default DiscountCode;
