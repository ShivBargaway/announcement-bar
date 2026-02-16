import mongoose from "mongoose";

const Schema = mongoose.Schema;

const contactUserSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Annoucement",
  },
  shopUrl: { type: String, required: true },
  customerId: { type: String },
});

const contact = mongoose.model("contact", contactUserSchema);
export default contact;
