import React, { useCallback, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ProfileContext } from "@/Context/ProfileContext";
import { removeBasePriceURL, slackChannelMsgForCustomServices } from "@/Utils/Index";

export default function PurchaseOneTimePlan({
  buttonName = t(`common.Purchase plan`),
  buttonProps,
  price = 9.99,
  planName = "One Time Plan",
  returnNavigateUrl = "/oneTimeCharge",
  hideSentry,
  isPurchasePlan = true,
}) {
  const { profileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);

  const submitOneTimePlan = useCallback(async () => {
    const { shopUrl, email } = profileData;

    if (!hideSentry) {
      const title = `${planName} Click Focus on him he want technical SEO plan`;
      const message = slackChannelMsgForCustomServices(title, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message, channelType: "customServices" }, false);
    }

    const storeUrl = shopUrl.split(".myshopify.com")[0];
    const newPlan = {
      name: planName,
      price,
      return_url: `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}${returnNavigateUrl}`,
      test: email?.includes("webrexstudio.com"),
    };

    const response = await fetch.post("plan/oneTimePurchase", newPlan);
    const confirmationUrl = response.data?.["appPurchaseOneTimeCreate"].confirmationUrl;
    if (confirmationUrl) {
      const redirectUrl = confirmationUrl.includes("admin.shopify.com")
        ? removeBasePriceURL(confirmationUrl)
        : confirmationUrl;

      open(redirectUrl, "_top");
    }
  }, [profileData, price]);

  const acceptPlan = useCallback(
    async (charge_id) => {
      const response = await fetch.post("activeOneTimeCharge", { charge_id, planName });
    },
    [profileData]
  );

  useEffect(() => {
    const charge_id = getUrlParam("charge_id");
    if (charge_id && isPurchasePlan) acceptPlan(charge_id);
  }, []);

  return (
    <Button onClick={submitOneTimePlan} {...buttonProps}>
      {buttonName}
    </Button>
  );
}
