/*
FileName : productSchema.js
Date : 12th March 2019
Description : This file consist of Product's model fields
*/
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const onboardingSchema = new Schema({
  shopUrl: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  onboarding: { type: Object },
  guide: { type: Object },
  suggestion: { type: Object },
});

const index = { shopUrl: 1 };
onboardingSchema.index(index);

const activePlan = mongoose.model("onboarding", onboardingSchema);
export default activePlan;
