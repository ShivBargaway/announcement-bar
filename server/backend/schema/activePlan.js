/*
FileName : productSchema.js
Date : 12th March 2019
Description : This file consist of Product's model fields
*/
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const planSchema = new Schema({
  shopUrl: { type: String, required: true, unique: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    unique: true,
  },
  planName: { type: String, required: true },
  planId: { type: Number },
  planPrice: { type: Number, required: true },
  status: { type: String, required: true },
  type: { type: String, required: true },
  activated_on: { type: Date },
  currentMonthStartDate: { type: Date },
  nextMonthStartDate: { type: Date },
  currentYearStartDate: { type: Date },
  nextYearStartDate: { type: Date },
  chargeInfo: [
    {
      id: { type: Number },
      startDate: { type: Date },
      planName: { type: String },
      planPrice: { type: Number },
      originalPrice: { type: Number },
      discountedPrice: { type: Number },
      code: { type: String },
      discountValue: { type: String },
      interval: { type: Number },
      billingInterval: { type: String },
    },
  ],
  proCharge: { type: Object },
  planMeta: { type: Object },
  products: { type: Number },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  originalPrice: { type: Number },
  discountedPrice: { type: Number },
  code: { type: String },
  discountValue: { type: String },
  interval: { type: Number },
  id: { type: String },
  is_recurring: { type: Boolean },
  intervalLable: { type: String },
  oldPlan: { type: String },
  billingInterval: { type: String },
  showPriceShopifyPlanWise: { type: Boolean, default: false },
  purchaseCreditChargeInfo: [
    {
      id: { type: Number },
      created_at: { type: Date },
      planName: { type: String },
      planPrice: { type: Number },
      aiMetaTags: { type: Number },
      aiImageAltText: { type: Number },
    },
  ],
});

const index = { shopUrl: 1 };
planSchema.index(index);

const activePlan = mongoose.model("plans", planSchema);
export default activePlan;
