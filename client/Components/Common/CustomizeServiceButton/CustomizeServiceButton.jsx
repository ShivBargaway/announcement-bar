import React, { useCallback, useContext } from "react";
import { InlineStack } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { navigate } from "@/Components/Common/NavigationMenu";
import { ProfileContext } from "@/Context/ProfileContext";
import { slackChannelMsg } from "@/Utils/Index";

export default function CustomizeServiceButton() {
  const fetch = useAuthenticatedFetch();
  const { profileData } = useContext(ProfileContext);
  const setNavigate = navigate();

  const openSupportChatBox = useCallback(
    async (type) => {
      const title =
        type === "header"
          ? "Store customization from pricing header"
          : "Store customization know more button from feature";
      const message = slackChannelMsg(`${title} Click`, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
      setNavigate("/pricing/custom-plan/theme");
    },
    [profileData]
  );

  const openSEOPlan = useCallback(
    async (type) => {
      const message = slackChannelMsg(`${type} Click`, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
      setNavigate("/pricing/custom-plan/seo");
    },
    [profileData]
  );

  return (
    <InlineStack gap={200} blockAlign="center">
      <button className="cro-button" onClick={() => openSupportChatBox("header")}>
        <InlineStack gap={100} align="center" blockAlign="center">
          {t("common.Affordable store customization")} - 10H {t("common.free")} {t("common.trial")}
        </InlineStack>
      </button>
      <button className="seo-button" onClick={() => openSEOPlan("Custom SEO Services from header")}>
        {t("common.Affordable SEO services")} - 10H {t("common.free")} {t("common.trial")}
      </button>
    </InlineStack>
  );
}
