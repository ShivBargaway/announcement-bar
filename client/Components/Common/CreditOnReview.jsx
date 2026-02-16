import React, { useContext, useEffect, useState } from "react";
import { Badge, Icon, InlineStack, Link, Text, Tooltip } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";
import { differenceInCalendarDays } from "date-fns";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ProfileContext } from "@/Context/ProfileContext";
import { logger } from "@/Services/Logger/Index";
import { isAdmin } from "@/Utils/Index";

export default function CreditOnReview({}) {
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const [showPopup, setShowPopup] = useState(false);
  const fetch = useAuthenticatedFetch();
  const reviewText = profileData?.recurringPlanType === "Free" ? "free" : "app";

  const countTrueFeatures = () => {
    const lastButtonClickTime = differenceInCalendarDays(
      new Date(),
      new Date(profileData?.reviewCredit?.reviewTime)
    );
    const lastReviewCheck = profileData?.reviewCredit?.giveCreditForReview && lastButtonClickTime < 2;
    const hasReview = profileData?.reviewRequest?.isReviewPosted;

    setShowPopup(!hasReview && !lastReviewCheck ? true : false); // add your condition here
  };
  const openReview = async (e) => {
    const adminLine = isAdmin() ? " --- Clicked By Admin" : "";
    const res = await fetch.put(
      "/user/update",
      JSON.stringify({ reviewCredit: { giveCreditForReview: true, reviewTime: new Date() } })
    );
    logger.error(`Credit Review Button Click - ${res?.data?.storeName}${adminLine}`, {
      extras: { user: res?.data },
    });
    updateProfileData(res?.data);
    e?.stopPropagation();
    window.open(`${process.env.SHOPIFY_STORE_APP_URL}#modal-show=WriteReviewModal`, "_blank");
  };
  useEffect(() => profileData && countTrueFeatures(), [profileData]);

  return <></>;
  return (
    <>
      {showPopup && (
        <Tooltip content={t(`common.If you like our ${reviewText} features then please leave us a review !!`)}>
          <div className="review-btoon">
            <Link onClick={(e) => openReview(e)}>
              <Badge tone="info">
                <InlineStack blockAlign="center" gap={100}>
                  <Icon source={StarFilledIcon} tone="success" />
                  <Text fontWeight="bold"> {t("common.Leave Us a Review !!")} </Text>
                  <Text />
                </InlineStack>
              </Badge>
            </Link>
          </div>
        </Tooltip>
      )}
    </>
  );
}
