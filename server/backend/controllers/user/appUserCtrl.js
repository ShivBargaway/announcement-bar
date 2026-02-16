import { ApiResponse } from "../../helpers/common.js";
import { findOne, findOneAndUpdate, updateMany } from "../../model/common.js";

const getOnboardingData = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;

    rcResponse.data = await findOne("onboarding", { shopUrl: shop }, { accessToken: 0 });

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const putOnboardingData = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop } = req.shopify;
    rcResponse.data = await findOneAndUpdate("onboarding", { shopUrl: shop }, { $set: body });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const postSuggestionStatus = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop } = req.shopify;
    const onboarding = await findOne("onboarding", { shopUrl: shop });
    rcResponse.data = await findOneAndUpdate(
      "onboarding",
      { shopUrl: shop },
      { suggestion: { ...onboarding?.suggestion, ...body } }
    );
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateEarningPoints = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop } = req.shopify;
    const { earningId = "aiMetaTags", earnCredit = 0, creditId = "aiMetaTags" } = body;
    const userObj = {
      $set: { [`earningPoints.${earningId}`]: true },
      $inc: { [`credits.normal.${creditId}`]: earnCredit },
    };
    rcResponse.data = await findOneAndUpdate("user", { shopUrl: shop }, userObj, { accessToken: 0 });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const removeFreeAccessCronJob = async () => {
  try {
    const result = await updateMany(
      "user",
      {
        premiumFeatureAccess: {
          $exists: true,
          $ne: [],
          $elemMatch: { accessEndDate: { $lt: new Date() } },
        },
        // recurringPlanId: "Free",
        "featureData.technicalSeo": true,
      },
      { "featureData.technicalSeo": false }
    );
    return result;
  } catch (err) {
    throw err;
  }
};

export {
  getOnboardingData,
  putOnboardingData,
  postSuggestionStatus,
  updateEarningPoints,
  removeFreeAccessCronJob,
};
