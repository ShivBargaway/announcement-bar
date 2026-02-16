/*
FileName : userModel.js
Date : 11th March 2019
Description : This file consist of User's model fields
*/
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const deletedUserSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { strict: false }
);

const index = { shopUrl: 1 };
deletedUserSchema.index(index);

const deletedUser = mongoose.model("DeletedUsers", deletedUserSchema);
export default deletedUser;
