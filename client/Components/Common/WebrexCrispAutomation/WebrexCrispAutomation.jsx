import React, { useCallback, useContext, useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { Crisp } from "crisp-sdk-web";
import { t } from "i18next";
import { ProfileContext } from "@/Context/ProfileContext";
import { getLocalStorageItem, isAdmin, setLocalStorageItem } from "@/Utils/Index";

export default function WebrexCrispAutomation() {
  const { profileData } = useContext(ProfileContext);

  let shopify = "";
  if (!isAdmin()) shopify = useAppBridge();
  const sleep = async (mils) => new Promise((resolve) => setTimeout(resolve, mils));
  const reviewUrl = `${process.env.SHOPIFY_STORE_APP_URL}#modal-show=WriteReviewModal`;

  const sendCrispReviewMessage = () => {
    const reviewMessage = `Enjoying our app? We'd love your feedback!

 👉 Leave a review: ${reviewUrl}

Thanks a ton! ⭐⭐⭐⭐⭐`;

    Crisp.message.showText(reviewMessage);
  };

  const handleReviewRequest = useCallback(async () => {
    // Check 60-day cooldown period
    const parseLocalStorageItem = JSON.parse(getLocalStorageItem("webrexReviewPopup"));
    const isShowPopup = parseLocalStorageItem?.expiryDate
      ? new Date() > new Date(parseLocalStorageItem?.expiryDate)
      : true;
    const isReviewPosted = profileData?.reviewRequest?.isReviewPosted;

    if (!isShowPopup || isReviewPosted) return;
    await sleep(3000);

    if (!isAdmin()) {
      const response = await shopify.reviews.request();
      if (!response.success) sendCrispReviewMessage();
    } else {
      sendCrispReviewMessage();
    }
    // Set 60-day expiry
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 10);
    setLocalStorageItem("webrexReviewPopup", JSON.stringify({ expiryDate }));
  }, [profileData, shopify]);

  const handleCrispEvent = useCallback(
    async (event) => {
      const { type, ...eventData } = event.detail || {};

      if (!type) return;
      switch (type) {
        case "reviewRequest":
          await handleReviewRequest();
          break;

        default:
          break;
      }
    },
    [handleReviewRequest]
  );

  useEffect(() => {
    window.addEventListener("crispAutomation", handleCrispEvent);
    return () => {
      window.removeEventListener("crispAutomation", handleCrispEvent);
    };
  }, [handleCrispEvent]);

  return <React.Fragment></React.Fragment>;
}

// sample event
// window.dispatchEvent(
//   new CustomEvent("crispAutomation", {
//     detail: {
//       type: "reviewRequest",
//       message: "please review the app",
//     },
//   })
// );
