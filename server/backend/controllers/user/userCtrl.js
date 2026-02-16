import jwt from "jsonwebtoken";
import { ApiResponse } from "../../helpers/common.js";
import { sendSlackMessage } from "../../helpers/slack.js";
import { calculateIdealCustomerRate, getMarkets, getProductcount, setAppLanguage } from "../../helpers/utils.js";
import { create, findOne, findOneAndUpdate } from "../../model/common.js";
import { createCustomerlyMsg, thirdPartyIntegration } from "../ThirdPartyIntegration/thirdPartyIntegration.js";
import { mailWithTemplate } from "../emails/emailCtrl.js";

const getUserProfile = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    if (!req?.decoded?.adminId) {
      rcResponse.data = await findOneAndUpdate(
        "user",
        { shopUrl: shop },
        { $set: { lastLogin: Date.now() } },
        { accessToken: 0 }
      );
      thirdPartyIntegration(rcResponse.data);
    } else {
      rcResponse.data = await findOne("user", { shopUrl: shop }, { accessToken: 0 });
    }

    if (process.env.FrillSSOKey) {
      const frillSSOToken = generateFrillSSOToken(rcResponse.data);
      rcResponse.data = { ...rcResponse.data, frillSSOToken };
    }

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const generateFrillSSOToken = (user) => {
  try {
    var userData = {
      email: user.email,
      id: user._id,
      name: user.storeName,
    };
    return jwt.sign(userData, process.env.FrillSSOKey, { algorithm: "HS256" });
  } catch (err) {
    throw err;
  }
};

const getAppEnableStatus = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  try {
    const { session, shop, restClient } = req.shopify;
    let announcementBar = "";
    if (process.env.ENV == "prod") {
      announcementBar = "8847685616676869210";
    } else if (process.env.ENV == "stg") {
      announcementBar = "16993460247840759690";
    } else {
      announcementBar = "8850393767603930020";
    }
    const comparisonBlocks = {
      announcementBar: announcementBar,
    };
    const themes = await restClient.get({ path: "themes.json" });
    let activeTheme = themes.body.themes.find((theme) => theme.role == "main");
    const data = await restClient.get({
      path: `themes/${activeTheme.id}/assets.json?asset[key]=config/settings_data.json`,
    });
    const value = JSON.parse(data.body.asset.value);
    const blocks = value?.current?.blocks || {};
    let freeFeatures = ["announcementBar"];
    let user = await findOne("user", { shopUrl: shop }, { accessToken: 0 });
    let results = Object.entries(comparisonBlocks).reduce((result, [key, value]) => {
      if (user.recurringPlanType !== "paid") {
        result[key] = freeFeatures.includes(key) && blocks[value]?.disabled === false;
      } else {
        result[key] = blocks[value]?.disabled === false;
      }
      return result;
    }, {});
    rcResponse.data = results;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    if (err?.response?.code === 403) return res.status(rcResponse.code).send(rcResponse);
    else next(err);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop, session } = req.shopify;

    const lastLoginArray = body?.lastLoginArray;
    if (lastLoginArray?.length > 0 && Array.isArray(lastLoginArray)) {
      const associated_user = session?.onlineAccessInfo?.associated_user;
      lastLoginArray[lastLoginArray.length - 1].userInfo = associated_user;
      body.lastLoginArray = lastLoginArray;
    }

    rcResponse.data = await findOneAndUpdate("user", { shopUrl: shop }, { $set: body }, { accessToken: 0 });
    !req?.decoded?.adminId && thirdPartyIntegration(rcResponse.data);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateUserCredit = async (shop, incObject) => {
  try {
    return await findOneAndUpdate("user", { shopUrl: shop }, { $inc: incObject }, { accessToken: 0 });
  } catch (err) {
    throw err;
  }
};

const updateFeatureStatus = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    const { body } = req;
    const user = await findOne("user", { shopUrl: shop });
    await findOneAndUpdate(
      "user",
      { shopUrl: shop },
      { featureStatus: { ...(user.featureStatus || {}), ...body } }
    );
    rcResponse.data = true;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const createProfileObj = (shop, session, product_count) => {
  let data = {
    storeName: shop.name,
    shopUrl: shop.myshopify_domain,
    shop_owner: shop.shop_owner,
    domain: shop.domain,
    storeId: shop.id,
    email: shop.email,
    productCount: product_count,
    currency: shop.currency,
    userLanguage: shop.primary_locale,
    appLanguage: setAppLanguage(shop.primary_locale),
    country_code: shop.country_code,
    country_name: shop.country_name,
    plan_display_name: shop.plan_display_name,
    plan_name: shop.plan_name,
    phone: shop.phone,
    customer_email: shop.customer_email,
    accessToken: session.accessToken,
    scope: session.scope,
    password_enabled: shop.password_enabled,
    created_at: shop.created_at,
    eligible_for_payments: shop.eligible_for_payments,
    enabled_presentment_currencies: shop.enabled_presentment_currencies,
    // markets: markets,
  };
  return data;
};
const syncProfile = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { restClient, session, shop, graphqlClient } = req.shopify;
    const shopResponse = await restClient.get({ path: "shop.json" });
    let productCountResponse;
    // const markets = await getMarkets(graphqlClient);

    if (process.env.PRODUCT_COUNT == "true") {
      productCountResponse = await getProductcount(graphqlClient);
    }

    const shopData = shopResponse.body.shop;
    const productCount = productCountResponse || 0;

    const data = createProfileObj(shopData, session, productCount);

    const updateUserDate = await findOneAndUpdate("user", { shopUrl: shop }, { $set: data }, { accessToken: 0 });
    const idealCustomerRate = calculateIdealCustomerRate(updateUserDate);

    if (idealCustomerRate !== updateUserDate?.idealCustomerRate) {
      rcResponse.data = await findOneAndUpdate(
        "user",
        { shopUrl: shop },
        { $set: { idealCustomerRate: calculateIdealCustomerRate(updateUserDate) } },
        { accessToken: 0 }
      );
    } else rcResponse.data = updateUserDate;

    !req?.decoded?.adminId && thirdPartyIntegration(rcResponse.data);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const postUserReview = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop } = req.shopify;
    const user = await findOneAndUpdate("user", { shopUrl: shop }, { $set: body }, { accessToken: 0 });
    await mailWithTemplate({
      user: {
        ...user,
        email: "webrexseosupport@webrexstudio.com",
        userEmail: user?.email,
      },
      subject: "SEO customer review",
      template: "customerReview",
    });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const postWebVitals = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    const updateData = {
      shopUrl: shop,
      storeId: req?.body?.shopId,
      webVitalReport: req?.body,
      updated: new Date(),
    };
    rcResponse.data = await create("webVital", updateData);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const sendMsgToSlackChannel = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { message, sendInPriceChannel, sendInExtraInfoChannel } = req?.body;
    let channelId;
    if (sendInPriceChannel) channelId = process.env.SLACK_PLAN_CANCEL_CHANNEL;
    else if (sendInExtraInfoChannel) channelId = process.env.SLACK_EXTRA_INFO_CHANNEL;
    if (message) sendSlackMessage(message, channelId);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const sendMsgToCustomerlyUser = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { message, setDataInUser, pushDataInUser } = req?.body;
    const { shop } = req.shopify;
    const userData = await findOneAndUpdate(
      "user",
      { shopUrl: shop },
      { $set: setDataInUser, $push: pushDataInUser },
      { accessToken: 0 }
    );

    rcResponse.data = userData;
    // if (message && userData?.email) createCustomerlyMsg(message, userData?.email);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
export {
  getUserProfile,
  getAppEnableStatus,
  updateUserCredit,
  updateUser,
  updateFeatureStatus,
  syncProfile,
  postUserReview,
  postWebVitals,
  sendMsgToSlackChannel,
  sendMsgToCustomerlyUser,
};
