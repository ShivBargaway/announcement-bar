import React, { useCallback, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";
import DismissibleBanner from "./DismissibleBanner";

export function AppStatusBanner({ appName, tone }) {
  const { getAppBlockStatus, appStatus, profileData } = useContext(ProfileContext);
  const { t } = useTranslation();
  const title = t("common.Enable Announcement Bar to get started");

  useEffect(() => {
    getAppBlockStatus();
  }, []);

  const gotoAppExtensionPage = useCallback(() => {
    const storeUrl = profileData?.shopUrl?.split(".myshopify.com")[0];
    window.open(
      `https://admin.shopify.com/store/${storeUrl}/themes/current/editor?context=apps&template=index&activateAppId=${process.env.REACT_APP_EXTENSION_UUID_KEY}/app-embed`,
      "_blank"
    );
  }, [profileData]);
  return (
    appStatus?.[appName] === false && (
      <DismissibleBanner
        title={title}
        action={{ content: "Activate embeds", onAction: () => gotoAppExtensionPage() }}
        secondaryAction={{ content: "Sync status", onAction: () => getAppBlockStatus() }}
        tone={tone}
        skipRemove={true}
        bannerText={
          <Text fontWeight="medium">
            {t(`common.To see our app features, you need to activate the`)}{" "}
            <b>Webrex Announcement Bar App Embed</b> {t("common.block in your store's theme customization.")}
            {t(`common.To see our app features, you need to activate the`)}{" "}
            <b>Webrex Announcement Bar App Embed</b> {t("common.block in your store's theme customization.")}
          </Text>
        }
        bannerName={"appStatusWarningBanner"}
      />
    )
  );
}
