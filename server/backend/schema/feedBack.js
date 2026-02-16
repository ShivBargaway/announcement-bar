import mongoose from "mongoose";

const { Schema } = mongoose;

const FeedBackSchema = new Schema(
  {
    shopUrl: {
      type: String,
      unique: [true, "That shopUrl is taken."],
      require: [true, "Enter shopUrl."],
    },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  { strict: false }
);

const FeedBack = mongoose.model("feedBack", FeedBackSchema);
export default FeedBack;
