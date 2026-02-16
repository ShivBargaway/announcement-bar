import { ApiResponse } from "../helpers/common.js";
import { updateBarCount } from "../helpers/utils.js";
import { bulkWrite, create, deleteOne, find, findOne, findOneAndUpdate, findWithFields } from "../model/common.js";
import { postData } from "./PrivateMetaField.js";

const getAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  const { params } = req;
  let { shop } = req.shopify;
  try {
    let result = await find("annoucement", { _id: params.id, shopUrl: shop }, { created: 1 });
    if (result[0]) {
      rcResponse.data = result[0];
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAllCampaign = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { shop } = req.shopify;
  try {
    const result = await findWithFields({
      collection: "annoucement",
      query: { shopUrl: shop, slideType: "email" },
      fields: ["_id", "campaignTitle"],
    });
    rcResponse.data = result.map((e) => ({ label: e.campaignTitle, value: e._id }));
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAnnoucements = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { shop } = req.shopify;
  try {
    let user = await findOne("user", { shopUrl: shop });
    if (user) {
      let typeData;
      if (user.recurringPlanType === "Free") {
        typeData = await findOne("annoucement", { slideEnabled: true, shopUrl: shop });
      } else {
        typeData = await find("annoucement", { slideEnabled: true, shopUrl: shop });
      }
      rcResponse.data = typeData;
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const addAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body, query } = req;
  let { shop, graphqlClient } = req.shopify;
  try {
    let animation = await findOne("animation", { shopUrl: shop });
    body["shopUrl"] = shop;
    body["animationId"] = animation._id;
    rcResponse.data = await create("annoucement", body);
    updateBarCount(shop);
    await metafield(graphqlClient, shop);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const copyAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body } = req;
  let { shop, graphqlClient } = req.shopify;
  try {
    let copy = [];
    copy = await findOne("annoucement", { _id: body._id }, { _id: 0 });
    rcResponse.data = await create("annoucement", copy);
    await metafield(graphqlClient, shop);
    updateBarCount(shop);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { params, body } = req;
  let { shop, graphqlClient } = req.shopify;
  try {
    rcResponse.data = await findOneAndUpdate("annoucement", { _id: params.id }, { $set: body });
    await metafield(graphqlClient, shop);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const deleteAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { params } = req;
  let { shop, graphqlClient } = req.shopify;

  try {
    rcResponse.data = await deleteOne("annoucement", {
      _id: params.id,
    });
    await metafield(graphqlClient, shop);
    const updateIndex = [];
    const announcements = await find("annoucement", { shopUrl: shop }, { index: 1 });
    for (let i = 0; i < announcements.length; i++) {}
    announcements.map((announcement, index) => {
      updateIndex.push({
        updateOne: {
          filter: { _id: announcement._id },
          update: { $set: { index: index + 1 } },
        },
      });
    });
    await bulkWrite("annoucement", updateIndex);
    updateBarCount(shop);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const reOrderAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body } = req;
  let { shop, graphqlClient } = req.shopify;
  try {
    rcResponse.data = await bulkWrite("annoucement", body);
    await metafield(graphqlClient, shop);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const metafield = async (graphqlClient, shop) => {
  try {
    let user = await findOne("user", { shopUrl: shop });
    let result;
    if (user) {
      if (user.recurringPlanType === "Free") {
        result = await findOne("annoucement", { slideEnabled: true, shopUrl: shop }, {}, { index: 1 });
      } else {
        result = await find("annoucement", { slideEnabled: true, shopUrl: shop }, { index: 1 });
      }
    }
    await postData(graphqlClient, shop, result, "anncouement");
  } catch (error) {
    throw error;
  }
};

export {
  addAnnoucement,
  updateAnnoucement,
  deleteAnnoucement,
  copyAnnoucement,
  getAnnoucement,
  reOrderAnnoucement,
  getAnnoucements,
  metafield,
  getAllCampaign,
};
