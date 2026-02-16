import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Button, InlineStack, Layout, Page } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { SuggestedItems } from "@/Components/Common/SuggestedItems/SuggestedItems";
import { ReviewModalContext } from "@/Context/ReviewContext";
import OnBoardingPage from "@/Pages/OnBoarding/OnBoardingPage";
import { ProfileContext } from "../../Context/ProfileContext";

function HomePage() {
  const fetch = useAuthenticatedFetch();
  const { reviewModalData, setReviewModalData } = useContext(ReviewModalContext);
  const { profileData } = useContext(ProfileContext);
  const { t } = useTranslation();

  const fetchData = async (user) => {
    let data = {
      user: user,
      template: "speedStatus",
      subject: "Test Mail",
    };
    await fetch.post("send-test-mail", data);
  };

  const sendTestMail = useCallback(
    async (user) => {
      await fetchData(user);
    },
    [profileData]
  );

  return (
    <Page>
      <BlockStack gap="500">
        {!profileData?.onboardingIsDone && <OnBoardingPage />}
        {(profileData?.onboardingFinishLater || profileData?.onboardingIsDone) && (
          <BlockStack gap="500">
            <InlineStack gap="500"> {t("startKit")}</InlineStack>
            <InlineStack gap="500">
              <Button
                onClick={() => {
                  setReviewModalData({
                    isOpen: true,
                    type: "image-optimization-feedback",
                  });
                }}
              >
                Open Review
              </Button>
              <Button
                onClick={() => {
                  sendTestMail(profileData);
                }}
              >
                Send test mail to :{profileData?.email && <>{profileData.email}</>}
              </Button>
            </InlineStack>

            <SuggestedItems />
          </BlockStack>
        )}
      </BlockStack>
    </Page>
  );
}

export default HomePage;
