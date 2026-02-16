import mongoose from "mongoose";

const Schema = mongoose.Schema;

const webVitalSchema = new Schema({
  shopUrl: { type: String },
  storeId: { type: String },
  webVitalReport: { type: Object },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

const index = { shopUrl: 1 };
webVitalSchema.index(index);

const webVital = mongoose.model("webVital", webVitalSchema);
export default webVital;
