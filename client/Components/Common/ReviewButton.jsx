import React, { useCallback, useContext } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Button } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ToastContext } from "@/Context/ToastContext";
import { slackChannelMsg } from "@/Utils/Index";

export default function ReviewButton({ profileData, sentryMessage, buttonProps }) {
  const fetch = useAuthenticatedFetch();
  const app = useAppBridge();
  const { showToast } = useContext(ToastContext);

  const openReviewModal = useCallback(async () => {
    const message = slackChannelMsg(sentryMessage, profileData);
    if (message) fetch.post(`/slack-channel-message`, { message }, false);
    const result = await app.reviews.request();
    if (!result.success) {
      showToast(`Review modal not displayed. Reason: ${result.code}: ${result.message}`);
    }
  }, [profileData, fetch]);

  return (
    <Button variant="primary" onClick={openReviewModal} {...buttonProps}>
      {t("common.Leave a review")}
    </Button>
  );
}
