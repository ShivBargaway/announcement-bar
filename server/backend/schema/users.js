/*
FileName : userModel.js
Date : 30th March 2023
Description : This file consist of User's model fields
*/
import mongoose from "mongoose";
import validator from "validator";

const Schema = mongoose.Schema;

const appUserSchema = {
  created_bars: { type: Number, required: true },
  anncouementMetafield: { type: Object },
  animationMetafield: { type: Object },
  abUserMetafield: { type: Object },
  pricingRequest: {
    lastRequested: { type: Date },
    request: { type: Number, default: 0 },
  },
  showVideoRequest: { type: Number, default: 0 },
  initialDiscountInfo: {
    monthlyCode: { type: String },
    yearlyCode: { type: String },
  },
  emailInfo: {
    isComeFromEmail: { type: Boolean },
    emailClickedDate: { type: Date },
  },
};

const userSchema = new Schema({
  storeName: { type: String },
  shopUrl: {
    type: String,
    unique: [true, "That shopUrl is taken."],
    require: [true, "Enter shopUrl."],
  },
  storeId: {
    type: Number,
    unique: [true, "That storeId is taken."],
    require: [true, "Enter storeId."],
  },
  email: {
    type: String,
    require: [true, "Enter an email address."],
    lowercase: true,
    validate: [validator.isEmail, "Enter a valid email address."],
  },
  phone: { type: String },
  password_enabled: { type: Boolean },
  shop_owner: { type: String },
  role: { type: Number, default: 2 },
  domain: { type: String },
  customer_email: { type: String },
  lastLogin: { type: Date, default: Date.now },
  googleAuthTokens: { type: Object },
  accessToken: { type: String, unique: true, required: true },
  currency: { type: String },
  country_name: { type: String },
  country_code: { type: String },
  userLanguage: { type: String },
  appLanguage: { type: String },
  productCount: { type: Number },
  scope: { type: String },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  created_at: { type: Date },
  isOnBoardingDone: { type: Boolean, default: false },
  stepCount: { type: Number, default: 1 },
  recurringPlanType: { type: String },
  recurringPlanName: { type: String },
  recurringPlanId: { type: String },
  plan_display_name: { type: String },
  plan_name: { type: String },
  trial_days: { type: Number },
  trial_start: { type: Date },
  cancelReason: { type: Object },
  reviewRequest: {
    isReviewPosted: { type: Boolean, default: false },
    lastRequested: { type: Date },
    request: { type: Number, default: 0 },
    reviewMeta: { type: Object },
  },
  lastLogin: { type: Date, default: Date.now },
  onboardingFinishLater: { type: Boolean, default: false },
  onboardingIsDone: { type: Boolean, default: false },
  ...appUserSchema,
  discountAppliedDate: { type: Date, default: Date.now },
  review: { type: Object },
  reviewCredit: {
    giveCreditForReview: { type: Boolean },
    reviewTime: { type: Date },
  },
  eligible_for_payments: { type: Boolean },
  enabled_presentment_currencies: { type: Object },
  uninstallReason: { type: Object },
  lastLoginArray: [{ date: { type: Date }, userInfo: { type: Object } }],
  associated_user: { type: Object },
  timezone: { type: String },
  iana_timezone: { type: String },
  idealCustomerRate: { type: Number, default: 0 },
  // markets: { type: Object },
});

const index = { shopUrl: 1, storeId: 1, storeName: 1 };
userSchema.index(index);

userSchema.index({ storeName: "text" }, { name: "storeName" });

const user = mongoose.model("Users", userSchema);
export default user;
