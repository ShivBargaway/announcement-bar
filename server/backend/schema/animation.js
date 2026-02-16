/*
FileName : animation.js
Date : 17th Dec 2019
Description : This file consist of Product's model fields
*/
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const animationSchema = new Schema({
  shopUrl: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
  },
  rmvBtnColor: { type: String },
  rmvBtnEnabled: { type: Boolean, default: false },
  animationIn: { type: String },
  animationOut: { type: String },
  autoplayTime: { type: Number },
  slideHeight: { type: String },
  slidePadding: { type: Number, default: 10 },
  slidePosition: { type: String },
  type: { type: String },
  cssEnabled: { type: Boolean, default: false },
  customCss: { type: String },
  selector: { type: String },
  fixMobileSelector: { type: String },
  StrictSelector: { type: String },
  StrictMobileSelector: { type: String },
  absolutePosition: { type: String },
  customPosition: { type: String },
  animationTime: { type: Number },
  textAnimation: { type: Boolean, default: false },
  textAnimationTime: { type: Number },
  textAnimationBg: { type: String },
  textAnimationPadding: { type: Number },
  textAnimationWidth: { type: Number },
  textAnimationSliderWidth: { type: Number },
  timePerPixel: { type: Number },
  cartControls: { type: Array },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
});

animationSchema.index({ shopUrl: 1, type: 1 });
const animation = mongoose.model("Animation", animationSchema);
export default animation;