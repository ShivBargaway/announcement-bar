/*
FileName : productSchema.js
Date : 12th March 2019
Description : This file consist of Product's model fields
*/
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const dismissSchema = new Schema({
  shopUrl: { type: String, required: true, unique: true },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now },
  banner: { type: Object },
  card: {
    type: Map, // Using Map to handle dynamic keys
    of: new Schema({
      lastReminder: { type: Date }, // Define lastReminder as Date
      dismiss: { type: Boolean },
    }),
  },
  videoCard: {
    type: Map, // Using Map to handle dynamic keys
    of: new Schema({
      lastReminder: { type: Date }, // Define lastReminder as Date
      dismiss: { type: Boolean },
    }),
  },
});

const index = { shopUrl: 1 };
dismissSchema.index(index);

const dismissProperty = mongoose.model("dismissProperty", dismissSchema);
export default dismissProperty;
