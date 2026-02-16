import { WebClient } from "@slack/web-api";
import { logger } from "./../services/logger/index.js";
import { shouldIgnore, timeAgo } from "./utils.js";

const token = process.env.SLACK_BOT_TOKEN;
const channelId = process.env.SLACK_CHANNEL;
const web = new WebClient(token);

export const sendSlackMessage = async (message, customizedChannelId) => {
  try {
    await web.chat.postMessage({
      channel: customizedChannelId || channelId,
      text: message,
      link_names: 1,
    });
  } catch (error) {
    logger.error(error);
  }
};

const commonSlackMessage = (info, userType) => {
  return {
    "Our App Plan Name": info.recurringPlanName,
    "Premium with Us": info.trial_start,
    "Time with Us": info.created,
    "Open in our admin panel": `<${process.env.SHOPIFY_APP_URL}/admin/${userType}?shopUrl=${info.shopUrl}|Click here>`,
    "Open in shopify partner": `<https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${info.storeId}|Click here>`,
    "Store url": info.shopUrl,
    "Shopify Plan Name": info.plan_display_name,
    "Store created date": info.created_at,
    "Store name": info.storeName,
    channelId: process.env.SLACK_PLAN_CANCEL_CHANNEL,
  };
};

const pricingMessage = (info) => {
  return {
    topic: ":x: :x: [PLAN CANCELLED]. Focus on him he is online in our app",
    "Cancellation Reason": info.cancellationReason,
    "Cancellation Message": info.cancellationMessage,
    ...commonSlackMessage(info, "user"),
  };
};

const uninstallMessage = (info) => {
  return {
    topic: ":cry::cry: [APP UNINSTALL]. Send Personalized followup email",
    ...commonSlackMessage(info, "deleteuser"),
  };
};

const installFromEmailMessage = (info) => {
  return {
    topic: ":smile::grin::boom::email: [APP REINSTALL]. User come from email",
    monthlyCode: info?.initialDiscountInfo?.monthlyCode,
    yearlyCode: info?.initialDiscountInfo?.yearlyCode,
    "App Uninstall Date": info?.deleted,
    ...commonSlackMessage(info, "user"),
  };
};

const skipTrialMessage = (info) => {
  return {
    topic: ":moneybag::moneybag: [user upgrade plan with skip trial]",
    "Skip trial plan name": info?.skipTrialPlanName,
    ...commonSlackMessage(info, "user"),
  };
};

export const createAndSendSlackMessage = (info, type) => {
  if (!info) return;

  if (!shouldIgnore(info)) {
    if (type === "uninstall") info = uninstallMessage(info);
    else if (type === "installFromEmail") info = installFromEmailMessage(info);
    else if (type === "trialSkip") info = skipTrialMessage(info);
    else info = pricingMessage(info);

    let message = `\n\n\n *${info.topic}:*\n`;
    for (let key in info) {
      if (key === "topic" || key === "channelId") continue;
      let value = info[key];
      if (!value) continue;

      let formattedKey = key.split(/(?=[A-Z])/).join(" ");
      if (Date.parse(value)) {
        value = timeAgo(new Date(value));
      }

      message += `*${formattedKey}:* ${value}\n`;
    }
    sendSlackMessage(message, info.channelId);
  }
};
