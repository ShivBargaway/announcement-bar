import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Button, InlineError, InlineStack, Text } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { EmbeddedEnable } from "@/Assets/Index";
import ImageWithPlaceholder from "@/Components/Common/ImageWithPlaceholder";
import { ProfileContext } from "@/Context/ProfileContext";
import DismissibleBanner from "./DismissibleBanner";

export function AppStatus(props) {
  const { t } = useTranslation();

  const { appUrlEndPoint, title, showSucessBanner, aspectRatio, url, showWarningBanner, setShowWarningBanner } =
    props;
  const fetch = useAuthenticatedFetch();
  const { profileData } = useContext(ProfileContext);

  const [appStatus, setAppStatus] = useState(false);

  const getAppBlockStatus = async () => {
    try {
      const response = await fetch.get("app-block-status");
      setAppStatus(response?.data?.[appUrlEndPoint] || false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAppBlockStatus();
  }, []);

  const handleURLRedirect = useCallback(() => {
    setAppStatus(false);
    const storeUrl = profileData?.shopUrl?.split(".myshopify.com")[0];
    window.open(
      url ||
        `https://admin.shopify.com/store/${storeUrl}/themes/current/editor?context=apps&template=index&activateAppId=${
          process.env.REACT_APP_EXTENSION_UUID_KEY
        }/${appUrlEndPoint || "webrexSeoEmbed"}`,
      "_blank"
    );
  }, [profileData]);
  const DissmissableBanner = () => {
    setShowWarningBanner(false);
  };

  return (
    <>
      {/* {showWarningBanner && (
        <InlineError message={t("common.Please enable our app extension.")} fieldID="appExtension" />
      )} */}
      <br />
      {!appStatus && (
        <BlockStack gap="400">
          <InlineStack blockAlign="baseline" gap="1000" align="space-between">
            <Text variant="bodyMd">{title} Embed is currently disabled</Text>
            <Button onClick={handleURLRedirect} variant="primary" alignment="end">
              {t("common.Enable App")}
            </Button>
          </InlineStack>
          <BlockStack gap="400">
            <Text variant="bodyMd">{t("common.1. Click on Enable App.")}</Text>

            <Text variant="bodyMd">
              {t("common.2. Enable")} {title}
              {t("common.App Embed as shown in image and save setting.")}{" "}
            </Text>
          </BlockStack>
          <ImageWithPlaceholder src={EmbeddedEnable} alt={"demo"} aspectRatio={aspectRatio} />
        </BlockStack>
      )}
      {showSucessBanner && appStatus && (
        <DismissibleBanner
          tone="success"
          bannerName={`appStatusSuccessBanner`}
          skipRemove={true}
          bannerText={
            <Text variant="headingSm" tone="success">
              {t("common.Well done!! you have successfully enable our app.")}
            </Text>
          }
        />
      )}
    </>
  );
}
