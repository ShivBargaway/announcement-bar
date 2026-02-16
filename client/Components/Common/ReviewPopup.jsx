import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BlockStack, Modal, Text } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { defaultReview } from "@/Assets/Mocks/Review.mock.jsx";
import { ProfileContext } from "@/Context/ProfileContext";
import { ReviewModalContext } from "@/Context/ReviewContext";
import { logger } from "@/Services/Logger/Index";
import { isAdmin } from "@/Utils/Index";

export default function ReviewPopup() {
  const { reviewModalData, setReviewModalData } = useContext(ReviewModalContext);
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();
  const [isOpen, setIsOpen] = useState(false);
  const requestDay = [1, 2, 3, 4, 5, 10, 20, 30, 60, 90, 120, 150, 180, 210, 240];
  requestDay.unshift(reviewModalData?.isBestFeature ? 0 : 0.5);
  const currentRequestDay = useMemo(() => {
    return requestDay[profileData?.reviewRequest?.request ?? 0];
  }, [profileData, requestDay]);
  const lastRequestTime = useMemo(() => {
    return profileData?.reviewRequest?.lastRequested ?? profileData?.created;
  }, [profileData]);
  const canRequest = useMemo(() => {
    const nextRequestTime = new Date(lastRequestTime).getTime() + currentRequestDay * 24 * 60 * 60 * 1000;
    const currentTime = new Date();
    if (currentTime > nextRequestTime) {
      return true;
    } else {
      return false;
    }
  }, [currentRequestDay, lastRequestTime]);

  // console.log(currentRequestDay, lastRequestTime, canRequest, requestDay);

  const handleChange = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      async function updateReviewData() {
        const reviewRequest = {
          isReviewPosted: false,
          lastRequested: new Date(),
          request: profileData?.reviewRequest?.request ? profileData?.reviewRequest?.request + 1 : 0 + 1,
        };
        await fetch.put("/user/update", JSON.stringify({ ...profileData, reviewRequest: reviewRequest }));
        updateProfileData({ ...profileData, reviewRequest: reviewRequest });
      }
      updateReviewData();
    }
  }, [isOpen]);

  const featureStatus = useMemo(() => {
    return (
      typeof profileData?.featureStatus === "object" &&
      Object.values(profileData?.featureStatus).filter((value) => value === true).length > 3
    );
  }, [profileData]);

  useEffect(() => {
    // console.log(
    //   reviewModalData.isOpen,
    //   canRequest,
    //   !Boolean(isAdmin()),
    //   !profileData?.reviewRequest?.isReviewPosted
    // );
    if (
      !reviewModalData.isOpen ||
      !canRequest ||
      Boolean(isAdmin()) ||
      profileData?.reviewRequest?.isReviewPosted ||
      !featureStatus
    ) {
      return;
    }
    setReviewModalData({ ...reviewModalData, ...{ isOpen: false } });
    setIsOpen(true);
    logger.error(t("common.Review Popup Show"), { extras: { user: profileData } });
  }, [reviewModalData, profileData]);

  // const review = useMemo(() => {
  //   return Reviews.find((i) => i.type === reviewModalData.type);
  // }, [Reviews, reviewModalData]);

  const reviewDescription = useMemo(() => {
    if (profileData?.recurringPlanName !== "Free") {
      return t(`common.ReviewPopup.${defaultReview.premiumDescription}`);
    } else {
      return t(`common.ReviewPopup.${defaultReview.description}`);
    }
  }, [profileData]);

  const handleReviewUs = useCallback(() => {
    window.open(`${process.env.SHOPIFY_STORE_APP_URL}#modal-show=WriteReviewModal`, "_blank");
    logger.error(t("common.click on review us"), { extras: { user: profileData } });
  }, [profileData]);

  return (
    <Modal
      open={isOpen}
      onClose={handleChange}
      title={t(`common.ReviewPopup.${defaultReview?.title}`)}
      primaryAction={{
        content: t("common.Review Us"),
        onAction: handleReviewUs,
      }}
      secondaryActions={[
        {
          content: t("common.Cancel"),
          onAction: handleChange,
        },
      ]}
    >
      <Modal.Section>
        <BlockStack gap="500">
          <Text fontWeight="bold" as="p">
            {reviewDescription}
          </Text>
          <Text as="p" fontWeight="bold" tone="caution">
            {t("common.Note: Feel free to leave a star rating without writing a review!")}
          </Text>
        </BlockStack>
      </Modal.Section>
    </Modal>
  );
}
