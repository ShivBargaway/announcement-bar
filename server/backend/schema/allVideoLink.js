import mongoose from "mongoose";

const { Schema } = mongoose;

const AllVideoLinkSchema = new Schema(
  {
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
  },
  { strict: false }
);

const AllVideoLink = mongoose.model("allVideoLink", AllVideoLinkSchema);
export default AllVideoLink;
