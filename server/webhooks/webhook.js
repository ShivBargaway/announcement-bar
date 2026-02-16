import SessionModel from "../../utils/models/SessionModel.js";
import StoreModel from "../../utils/models/StoreModel.js";
import { thirdPartyIntegration } from "../backend/controllers/ThirdPartyIntegration/thirdPartyIntegration.js";
import { createAndSendSlackMessage } from "./../backend/helpers/slack.js";
import { deleteMany, findOne, findOneAndUpdate } from "./../backend/model/common.js";
import { logger } from "./../backend/services/logger/index.js";

const getTrialDays = (trialDays, trialStart = new Date()) => {
  const now = new Date();
  const trialEnd = new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
  const diffMs = trialEnd - now;
  const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return remainingDays > 0 ? remainingDays : 0;
};

const appUninstallHandler = async (topic, shop, webhookRequestBody) => {
  try {
    await StoreModel.findOneAndUpdate({ shop }, { isActive: false });
    await SessionModel.deleteMany({ shop });
    let user = await findOne("user", { shopUrl: shop });
    if (user) {
      user.userId = user._id;
      user.deleted = new Date();

      if (user?.recurringPlanType === "Paid") {
        let plan = await findOne("activePlan", { shopUrl: shop });
        if (plan?.billingInterval === "Year") createAndSendSlackMessage(user, "uninstall");
      }

      if (user?.trial_start) user.trial_days = getTrialDays(user?.trial_days, user?.trial_start);

      delete user.trial_start;
      delete user._id;
      delete user.initialDiscountInfo;
      delete user.emailInfo;

      thirdPartyIntegration({ ...user, ...{ uninstalled: true, uninstalled_at: new Date(Date.now()) } });

      await findOneAndUpdate("deletedUser", { shopUrl: user.shopUrl }, { $set: user });
      let promise = [
        deleteMany("user", { shopUrl: user.shopUrl }),
        deleteMany("activePlan", { shopUrl: user.shopUrl }),
        deleteMany("annoucement", { shopUrl: user.shopUrl }),
      ];
      await Promise.all(promise)
        .then(async () => {
          return true;
        })
        .catch((err) => {
          throw err;
        });
    }
  } catch (err) {
    logger.identifyUser({ username: shop });
    logger.error(err, {
      extras: {
        type: "err in appUninstallHandler",
      },
    });
    return false;
  }
};

const shopUpdateHandler = async (topic, shop, webhookRequestBody) => {
  try {
    let findUser = await findOne("user", { shopUrl: shop });
    if (findUser) {
      let body = JSON.parse(webhookRequestBody);
      let bodyData = {
        country_code: body.country_code,
        country_name: body.country_name,
        currency: body.currency,
        customer_email: body.customer_email,
        domain: body.domain,
        email: body.email,
        phone: body.phone,
        plan_display_name: body.plan_display_name,
        plan_name: body.plan_name,
        storeId: body.id,
        storeName: body.name,
        userLanguage: body.primary_locale,
        password_enabled: body.password_enabled,
      };

      await findOneAndUpdate("user", { shopUrl: shop }, bodyData);
    }
    return true;
  } catch (err) {
    logger.identifyUser({ username: shop });
    logger.error(err, {
      extras: {
        type: "err in shopUpdateHandler",
      },
    });
    return false;
  }
};

export { appUninstallHandler, shopUpdateHandler };
