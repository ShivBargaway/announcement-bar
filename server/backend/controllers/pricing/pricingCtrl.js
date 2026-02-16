import {
  appCreateOnetimeQuery,
  appSubscriptionCancelQuery,
  recurringAppCreateQuery,
} from "../../graphql/pricingQuery.js";
import { ApiResponse, Plans } from "../../helpers/common.js";
import { createAndSendSlackMessage } from "../../helpers/slack.js";
import { bulkWrite, find, findOne, findOneAndUpdate } from "../../model/common.js";
import { thirdPartyIntegration } from "../ThirdPartyIntegration/thirdPartyIntegration.js";
import { metafield } from "../announcementCtrl.js";
import { postData } from "../PrivateMetaField.js";

const getPlan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    rcResponse.data = await findOne("activePlan", {
      shopUrl: shop,
    });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const recurringPlanVariable = (body) => {
  let price = body.price;
  if (body.purchasedPlanPrice) {
    price = body.purchasedPlanPrice;
    if (body.billingInterval === "Year") {
      price = body.purchasedPlanPrice * 12;
    }
  }
  const gVariables = {
    name: body.id,
    lineItems: [
      {
        plan: {
          appRecurringPricingDetails: {
            interval: body.interval,
            price: {
              amount: price,
              currencyCode: "USD",
            },
          },
        },
      },
    ],
    returnUrl: body.return_url,
    test: body.test,
    trialDays: body.trial_days,
  };
  if (body.discountObject && body?.discountObject?.value > 0) {
    if (body.discountObject.type == "percentage") {
      gVariables.lineItems[0].plan.appRecurringPricingDetails.discount = {
        durationLimitInIntervals: body.discountObject.interval,
        value: {
          percentage: body.discountObject.value / 100,
        },
      };
    } else {
      gVariables.lineItems[0].plan.appRecurringPricingDetails.discount = {
        durationLimitInIntervals: body.discountObject.interval,
        value: {
          amount: body.discountObject.value,
        },
      };
    }
  }
  return gVariables;
};

const onetimePlanVariable = (body) => {
  const gVariables = {
    name: body.id,
    price: {
      amount: body.finalPrice,
      currencyCode: "USD",
    },
    returnUrl: body.return_url,
    test: body.test,
  };

  return gVariables;
};

const createPlan = async (req, res, next) => {
  try {
    /* Contruct response object */
    let rcResponse = new ApiResponse();
    let { body } = req;
    const { graphqlClient } = req.shopify;
    let response;
    let gQuery = body.is_recurring ? recurringAppCreateQuery : appCreateOnetimeQuery;
    let gVariables = body.is_recurring ? recurringPlanVariable(body) : onetimePlanVariable(body);

    response = await graphqlClient.query({
      data: {
        query: gQuery,
        variables: gVariables,
      },
    });

    rcResponse.data = response.body.data;

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const activePlan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { body } = req;
    const { shop, session, graphqlClient, restClient } = req.shopify;
    let activePlanUpdate = {};

    let plan = await findOne("activePlan", {
      shopUrl: shop,
      chargeInfo: { $elemMatch: { id: body.charge_id } },
    });
    if (!plan) {
      let planData = await findOne("activePlan", {
        shopUrl: shop,
      });

      if (planData?.planId && planData.planName != "Free" && planData.is_recurring) {
        await cancelRecurringPlan(planData, graphqlClient);
      }

      const shopifyEndpoint = body.recurring ? "recurring_application_charges" : "application_charges";
      const shopifyResponse = await restClient.post({
        path: `${shopifyEndpoint}/${body.charge_id}/activate.json`,
      });
      const shopifyPlan =
        shopifyResponse.body[body.recurring ? "recurring_application_charge" : "application_charge"];

      let updatedPlan = updateActivePlan(body, shopifyPlan, shop); //update plan in database
      // let userData = await findOne("user", { shopUrl: shop });
      // activePlanUpdate = await activePlanChanges(req, res, userData, next, body, plan);

      let user = {
        recurringPlanName: body.name,
        recurringPlanType: "Paid",
        recurringPlanId: shopifyPlan.name,
        trial_days: shopifyPlan.trial_days,
        trial_start: new Date(),
        ...activePlanUpdate,
      };

      rcResponse.data = await findOneAndUpdate("user", { shopUrl: shop }, user, { accessToken: 0 });
      const { recurringPlanName, recurringPlanType, recurringPlanId } = rcResponse.data;
      const data = { recurringPlanName, recurringPlanType, recurringPlanId };
      await metafield(graphqlClient, shop);
      await postData(graphqlClient, shop, data, "abUser");
    } else {
      rcResponse.data = await findOne("user", { shopUrl: shop }, { accessToken: 0 });
    }

    thirdPartyIntegration(rcResponse.data);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const cancelPlan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    let { body } = req;
    const { shop, session, graphqlClient } = req.shopify;
    let cancelPlanUpdate = {};

    //update User Metafield
    let user = await findOne("user", { shopUrl: shop });
    // cancelPlanUpdate = await cancelPlanChanges(req, res, user, next);

    //cancel current recurring plan
    await cancelRecurringPlan(body.plan, graphqlClient);
    updateFreePlan(user);

    let info = {
      ...user,
      cancellationReason: body?.cancelReason?.reason,
      cancellationMessage: body?.cancelReason?.value,
    };
    createAndSendSlackMessage(info, "pricing");

    // update user in our database
    let userPayload = {
      ...cancelPlanUpdate,
      recurringPlanName: "Free",
      recurringPlanType: "Free",
      recurringPlanId: "Free",
      cancelReason: body?.cancelReason,
      trial_days: body.trial_days,
      $unset: {
        trial_start: 1,
      },
    };

    rcResponse.data = await findOneAndUpdate("user", { _id: user._id }, userPayload, { accessToken: 0 });
    await metafield(graphqlClient, shop);
    const { recurringPlanName, recurringPlanType, recurringPlanId } = rcResponse.data;
    const data = { recurringPlanName, recurringPlanType, recurringPlanId };
    await postData(graphqlClient, shop, data, "abUser");

    thirdPartyIntegration(rcResponse.data);

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const updateFreePlan = async (user) => {
  try {
    let data = {
      $set: {
        updated: new Date(),
        planName: "Free",
        planPrice: 0,
        type: "monthly",
        originalPrice: 0,
        discountedPrice: 0,
        code: null,
        discountValue: null,
        interval: 0,
        id: "Free",
        currentMonthStartDate: new Date(),
        nextMonthStartDate: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000),
      },
      $push: {
        chargeInfo: {
          startDate: new Date(),
          planName: "Free",
          planPrice: 0,
        },
      },
      $unset: {
        currentYearStartDate: 1,
        nextYearStartDate: 1,
        billingInterval: 1,
        intervalLable: 1,
        is_recurring: 1,
        showPriceShopifyPlanWise: 1,
      },
    };

    //update active plan
    await findOneAndUpdate("activePlan", { shopUrl: user.shopUrl }, data, {
      accessToken: 0,
    });
  } catch (err) {
    throw err;
  }
};

const getTimeWiseDate = (date) => {
  try {
    const finalDate = new Date(date || new Date());
    const currentTime = new Date();

    finalDate.setHours(currentTime.getHours());
    finalDate.setMinutes(currentTime.getMinutes());
    finalDate.setSeconds(currentTime.getSeconds());
    return finalDate;
  } catch (error) {
    throw error;
  }
};

const updateActivePlan = async (body, plan, shop) => {
  try {
    const trial_ends_on = getTimeWiseDate(plan?.trial_ends_on);

    let data = {
      $set: {
        updated: new Date(),
        planName: body.name,
        planId: plan.id,
        status: plan.status,
        activated_on: plan.activated_on,
        currentMonthStartDate: body.billingInterval !== "Year" ? trial_ends_on : null, //if trial days then currentYearStartDate is after trial end
        currentYearStartDate: body.billingInterval === "Year" ? trial_ends_on : null, //if trial days then currentYearStartDate is after trial end
        nextMonthStartDate:
          body.recurring && body.billingInterval !== "Year"
            ? new Date(new Date().getTime() + plan.trial_days * 24 * 60 * 60 * 1000 + 30 * 24 * 60 * 60 * 1000)
            : null,
        nextYearStartDate:
          body.recurring && body.billingInterval === "Year"
            ? new Date(new Date().getTime() + plan.trial_days * 24 * 60 * 60 * 1000 + 365 * 24 * 60 * 60 * 1000)
            : null,
        type: body.recurring ? "monthly" : "fixed",
        recurringPlanType: "Paid",
        planMeta: Plans[plan.name],
        code: body.code,
        discountValue: body.discountRate,
        interval: body.interval === "undefined" ? 0 : body.interval,

        planPrice: body.purOrgPrs ? body.purOrgPrs : body.planPrice, //body.planPrice,
        originalPrice: plan.price, //body.originalPrice
        discountedPrice: body.purDisPrs ? body.purDisPrs : body.finalPrice, //body.finalPrice,

        //added
        id: plan.name,
        is_recurring: body.recurring ? true : false,
        intervalLable: body.intervalLable,
        billingInterval: body.billingInterval,
        showPriceShopifyPlanWise: body?.showPriceShopifyPlanWise || false,
      },
      $push: {
        chargeInfo: {
          startDate: new Date(),
          planName: plan.name,
          planPrice: body.planPrice,
          id: plan.id,
          originalPrice: body.originalPrice,
          discountedPrice: body.finalPrice,
          code: body.code,
          discountValue: body.discountRate,
          interval: body.interval === "undefined" ? 0 : body.interval,
          billingInterval: body.billingInterval,
        },
      },
    };

    //update active plan
    await findOneAndUpdate("activePlan", { shopUrl: shop }, data);
  } catch (err) {
    throw err;
  }
};

const cancelRecurringPlan = async (body, graphqlClient) => {
  try {
    const gVariables = {
      id: `gid://shopify/AppSubscription/${body.planId}`,
    };
    await graphqlClient.query({
      data: {
        query: appSubscriptionCancelQuery,
        variables: gVariables,
      },
    });
  } catch (err) {
    if (err.response && err.response.statusCode === 404) {
      console.log("Metafield not found:", err.response.statusCode);
      return;
    }
    throw err;
  }
};

const recurringPlanCronJob = async () => {
  try {
    var today = new Date();
    let tomorrow = new Date(today);

    tomorrow.setDate(today.getDate() + 1);

    let plansArray = [];
    let findQuery = {
      $or: [
        { currentYearStartDate: { $gte: today, $lt: tomorrow } }, // if trial ongoing
        { nextYearStartDate: { $lte: today } },
        { currentMonthStartDate: { $gte: today, $lt: tomorrow } }, // if trial ongoing
        { nextMonthStartDate: { $lte: today } },
      ],
    };
    let plans = await find("activePlan", findQuery);
    // await generateUserArray(plans);

    plans.map((plan) => {
      plansArray.push({
        updateOne: {
          filter: { userId: plan.userId },
          update: {
            $set: {
              updated: new Date(),
              currentMonthStartDate: plan.billingInterval !== "Year" ? new Date() : null,
              nextMonthStartDate:
                plan.billingInterval !== "Year" ? new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000) : null,

              currentYearStartDate: plan.billingInterval === "Year" ? new Date() : null,
              nextYearStartDate:
                plan.billingInterval === "Year"
                  ? new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000)
                  : null,
            },
            $push: {
              chargeInfo: {
                startDate: new Date(),
                planName: plan.planName,
                planPrice: plan.planPrice,
                id: plan.planId,
              },
            },
          },
        },
      });
    });

    await bulkWrite("activePlan", plansArray);
    return true;
  } catch (err) {
    throw err;
  }
};

const activeSyncPlan = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { graphqlClient, shop } = req.shopify;

    let appSubscription = `query {
      appInstallation {
        activeSubscriptions {
          id
          name
          test
          status
          returnUrl
          trialDays
          currentPeriodEnd
          createdAt
        }
      }
    }`;

    const data = await graphqlClient.query({
      data: {
        query: appSubscription,
      },
    });
    let plan = data.body.data.appInstallation.activeSubscriptions[0];
    if (plan) {
      let { id, returnUrl } = plan;
      const urlParts = returnUrl.split("?");
      const responseArray = urlParts[1].split("&&");
      const body = {};

      responseArray.forEach((item) => {
        const [key, value] = item.split("=");
        const decodedValue = decodeURIComponent(value);
        body[key] = decodedValue;
      });
      const parts = id.split("/");
      plan.id = Number(parts[parts.length - 1]);

      let data = {
        $set: {
          planName: plan.name,
          planId: plan.id,
          planPrice: Number(body.final_price),
          status: plan.status,
          activated_on: plan.createdAt,
          currentMonthStartDate: plan.createdAt,
          nextMonthStartDate:
            body.is_recurring === "true"
              ? new Date(
                  new Date(plan.createdAt).getTime() +
                    plan.trialDays * 24 * 60 * 60 * 1000 +
                    30 * 24 * 60 * 60 * 1000
                )
              : "",
          type: body.is_recurring === "true" ? "monthly" : "fixed",
          recurringPlanType: "Paid",
          planMeta: Plans[plan.name],
          originalPrice: Number(body.original_price),
          discountedPrice: Number(body.final_price),
          code: body.code === "null" ? null : body.code,
          discountValue: body.discount_value === "null" ? null : body.discount_value,
          interval: body.interval === "undefined" ? 0 : body.interval,
        },
        $push: {
          chargeInfo: {
            startDate: plan.createdAt,
            planName: plan.name,
            planPrice: Number(body.final_price),
            id: plan.id,
            originalPrice: Number(body.original_price),
            discountedPrice: Number(body.final_price),
            code: body.code === "null" ? null : body.code,
            discountValue: body.discount_value === "null" ? null : body.discount_value,
            interval: body.interval === "undefined" ? 0 : body.interval,
          },
        },
      };

      //update active plan
      await findOneAndUpdate("activePlan", { shopUrl: shop }, data);

      let user = {
        $set: {
          recurringPlanName: body.name,
          recurringPlanType: "Paid",
          trial_days: plan.trial_days,
          trial_start: plan.createdAt,
          recurringPlanId: plan.name,
        },
      };

      rcResponse.data = await findOneAndUpdate("user", { shopUrl: shop }, user, { accessToken: 0 });
    }

    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export { getPlan, createPlan, activePlan, cancelPlan, activeSyncPlan, recurringPlanCronJob };
