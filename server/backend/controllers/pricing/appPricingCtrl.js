import { ApiResponse } from "../../helpers/common.js";
import { sendSlackMessage } from "../../helpers/slack.js";
import { bulkWrite, find, findOne, findOneAndUpdate } from "../../model/common.js";
import { postData } from "../PrivateMetaField.js";
import { metafield } from "../announcementCtrl.js";
import { appCreateOnetimeQuery } from "./../../graphql/pricingQuery.js";

export const activePlanChanges = async (req, res, userData, next, body, shopifyPlan, oldPlanData) => {
  try {
    //manage all your content here when user is going to active plan

    return true;
  } catch (err) {
    throw err;
  }
};

export const cancelPlanChanges = async (req, res, userData, next) => {
  try {
    //manage all your content here when user is going to cancle plan
    return true;
  } catch (err) {
    next(err);
  }
};

export const generateUserArray = async (plans) => {
  try {
    let metaTag = {
      Free: 5,
      default: 5,
      "Premium-Monthly": 100,
      "Pro-Monthly": 100,
      "Premium-Yearly": 1200,
      "Pro-Yearly": 1200,
    };
    let imageCredit = {
      Free: 50,
      default: 50,
      "Premium-Monthly": 1000,
      "Pro-Monthly": 1000,
      "Premium-Yearly": 12000,
      "Pro-Yearly": 12000,
    };
    let userArray = [];
    plans.map((plan) => {
      userArray.push({
        updateOne: {
          filter: { shopUrl: plan.shopUrl },
          update: {
            $set: {
              aiCredits: {
                metaTags: metaTag[plan?.id ? plan.id : "default"],
              },
              imageCredit: imageCredit[plan?.id ? plan.id : "default"],
              trial_days: 0,
            },
          },
        },
      });
    });
    await bulkWrite("user", userArray);
  } catch (err) {
    throw err;
  }
};

export const acceptPremium100Plan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop, graphqlClient } = req.shopify;

    const planData = {
      $set: {
        updated: new Date(),
        planName: "Premium",
        currentMonthStartDate: new Date(),
        nextMonthStartDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
        type: "monthly",
        planPrice: 0,
        originalPrice: 0,
        discountedPrice: 0,
        id: "Premium100",
        is_recurring: true,
        intervalLable: "Month",
        billingInterval: "Month",
      },
      $push: {
        chargeInfo: {
          startDate: new Date(),
          planName: "Premium",
          planPrice: 0,
        },
      },
      $unset: { currentYearStartDate: 1, nextYearStartDate: 1 },
    };
    let userData = {
      recurringPlanName: "Premium",
      recurringPlanType: "Paid",
      recurringPlanId: "Premium100",
      $unset: { trial_start: 1 },
    };

    const [plan, user] = await Promise.all([
      findOneAndUpdate("activePlan", { shopUrl: shop }, planData),
      findOneAndUpdate("user", { shopUrl: shop }, userData, { accessToken: 0 }),
    ]);

    await Promise.all([metafield(graphqlClient, shop), postData(graphqlClient, shop, userData, "abUser")]);

    rcResponse.data = { plan, user };

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const oneTimePurchasePlan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    let { body } = req;
    const { graphqlClient } = req.shopify;

    let response = await graphqlClient.query({
      data: {
        query: appCreateOnetimeQuery,
        variables: {
          name: body.name,
          price: {
            amount: body.price,
            currencyCode: "USD",
          },
          returnUrl: body.return_url,
          test: body.test,
        },
      },
    });

    rcResponse.data = response.body.data;

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const saveMoreCredit = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    let { charge_id } = req?.body;
    const { shop, restClient } = req.shopify;

    let activePlan = await findOne("activePlan", {
      shopUrl: shop,
      purchaseCreditChargeInfo: { $elemMatch: { id: charge_id } },
    });
    let user = await findOne("user", { shopUrl: shop }, { accessToken: 0 });

    if (!activePlan) {
      const shopifyResponse = await restClient.post({
        path: `application_charges/${charge_id}/activate.json`,
      });
      const plan = shopifyResponse.body["application_charge"];

      const url = new URL(plan.return_url);
      const params = new URLSearchParams(url.search);

      const metaTags = params.get("metaTags");
      const aiImageAltText = params.get("aiImageAltText");

      let planData = {
        $push: {
          purchaseCreditChargeInfo: {
            id: charge_id,
            created_at: plan.created_at,
            planName: plan.name,
            planPrice: plan.price,
            aiMetaTags: metaTags,
            aiImageAltText: aiImageAltText,
          },
        },
      };

      let metaTagsValue = user?.credits?.purchase?.aiMetaTags;
      let aiImageAltCreditValue = user?.credits?.purchase?.aiImageAltText;

      let parsedMetaTags = isNaN(metaTagsValue) ? 0 : parseInt(metaTagsValue);
      let parsedAltImageCredit = isNaN(aiImageAltCreditValue) ? 0 : parseInt(aiImageAltCreditValue);

      let userData = {
        $set: {
          credits: {
            ...user.credits,
            purchase: {
              aiMetaTags: parsedMetaTags + parseInt(metaTags),
              aiImageAltText: parsedAltImageCredit + parseInt(aiImageAltText),
            },
          },
        },
      };

      await findOneAndUpdate("activePlan", { shopUrl: shop }, planData);
      rcResponse.data = await findOneAndUpdate("user", { shopUrl: shop }, userData, { accessToken: 0 });
    } else {
      rcResponse.data = user;
    }

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const getCreditInfo = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  const { shop } = req.shopify;
  const { planName } = req.body;

  try {
    let result = await findOne("activePlan", {
      shopUrl: shop,
    });

    if (planName) {
      rcResponse.data = { rows: result?.purchaseCreditChargeInfo?.filter((e) => e?.planName === planName) || [] };
    } else rcResponse.data = { rows: result?.purchaseCreditChargeInfo || [] };

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const activeOneTimeCharge = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    let { charge_id, planName } = req?.body;
    const { shop, restClient } = req.shopify;
    const userData = await findOne("user", { shopUrl: shop });

    let activePlan = await findOne("activePlan", {
      shopUrl: shop,
      purchaseCreditChargeInfo: { $elemMatch: { id: charge_id } },
    });

    if (!activePlan) {
      const shopifyResponse = await restClient.post({
        path: `application_charges/${charge_id}/activate.json`,
      });
      const plan = shopifyResponse.body["application_charge"];

      let planData = {
        $push: {
          purchaseCreditChargeInfo: {
            id: charge_id,
            created_at: plan.created_at,
            planName: plan.name,
            planPrice: plan.price,
          },
        },
      };

      rcResponse.data = await findOneAndUpdate("activePlan", { shopUrl: shop }, planData);

      const message = `\n\n :moneybag::moneybag: *${planName} Purchase*\n
        *Shop url:* ${shop}\n
        *charge_id:* ${charge_id}\n
        *planName:* ${plan.name}\n
        *planPrice:* ${plan.price}\n
        *Open in Shopify Partner:* <https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${userData.storeId}|Click here>\n
        *Open in our Admin Panel:* <${process.env.SHOPIFY_APP_URL}/admin/user?shopUrl=${userData.shopUrl}|Click here>\n`;

      sendSlackMessage(message);
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
