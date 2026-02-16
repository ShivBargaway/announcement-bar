import { ApiResponse } from "../../helpers/common.js";
import { findOne, findOneAndUpdate } from "../../model/common.js";

export const updateDismissProperty = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop } = req.shopify;
    rcResponse.data = await findOneAndUpdate(
      "dismissProperty",
      { shopUrl: shop },
      { $set: body },
      { _id: 0, __v: 0 }
    );
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const getDismissProperty = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    rcResponse.data = await findOne("dismissProperty", { shopUrl: shop }, { _id: 0, __v: 0 });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
