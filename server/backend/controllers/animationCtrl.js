import { ApiResponse } from "../helpers/common.js";
import { findAllSlide, findWithSlide } from "../model/animation.js";
import { findOne, findOneAndUpdate} from "../model/common.js";
import { postData } from "./PrivateMetaField.js";

const announcementWebappData = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  const { query } = req;
  let { shop } = req.shopify;
  try {
    let result = await findAllSlide("animation", { type: query.type, shopUrl: shop });
    if (result[0]) {
      rcResponse.data = result[0];
    } else {
      rcResponse.data = null;
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAnimation = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { shop } = req.shopify;
  try {
    rcResponse.data = await findOne("animation", { shopUrl: shop });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateAnimation = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body, params } = req;
  const { graphqlClient, shop } = req.shopify;
  try {
    rcResponse.data = await findOneAndUpdate("animation", { _id: params.id }, { $set: body });
    let field = await findOne("animation", { shopUrl: shop });
    await postData(graphqlClient, shop, field, "animation");
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const announcementData = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  const { query } = req;
  try {
    let user;
    if (query.deleted && query.deleted == "true") {
      user = await findOne("deletedUser", { shopUrl: query.shopUrl });
      if (user) {
        delete user._id;
        user["_id"] = user.userId;
      }
    } else {
      user = await findOne("user", { shopUrl: query.shopUrl });
    }
    if (user) {
      let searchQuery = { type: { $in: ["all", query.type] }, shopUrl: query.shopUrl };
      let typeData;
      if (user.recurringPlanType === "Free") {
        typeData = await findWithSlide(searchQuery, "Free");
      } else {
        typeData = await findWithSlide(searchQuery);
      }

      let typeResult = {};
      if (typeData.length > 1) {
        typeResult = typeData.find((element) => {
          return element.type == query.type && element.annoucements.length > 0;
        });

        if (!typeResult) {
          typeResult = typeData[0];
        }
      } else {
        typeResult = typeData[0];
      }
      if (user.recurringPlanType === "Free") {
        typeResult["plan"] = "Free";
      } else {
        typeResult["plan"] = user.recurringPlanName;
      }
      rcResponse.data = typeResult;
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export {
  updateAnimation,
  announcementWebappData,
  announcementData,
  getAnimation,
};
