import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  InlineError,
  Page,
  PageActions,
  Scrollable,
} from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import Meeting from "@/Components/Common/Meeting";
import { navigate } from "@/Components/Common/NavigationMenu";
import { AppStatus } from "../../Components/Common/AppStatus";
import OnBoarding from "../../Components/Common/Steps";
import { ProfileContext } from "../../Context/ProfileContext";
import Pricing from "../Pricing/Pricing";
import OnBoardingPricing from "./OnBoardingPricing";

const getField = () => [
  {
    step: 1,
    name: t("common.Enable Our App"),
  },
  // {
  //   step: 2,
  //   name: t("common.Book Onboarding Demo"),
  //   addSkip: true,
  // },
  {
    step: 2,
    name: t("common.Pricing"),
  },
];

export default function OnBoardingTrial() {
  const fetch = useAuthenticatedFetch();
  const [stepCount, setStepCount] = useState(1);
  const [active, setActive] = useState(true);
  const setNavigate = navigate();
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const field = getField();

  const appUrlEndPoint = "announcementBar";
  const title = "Multi Announcement Bar";
  const storeUrl = profileData?.shopUrl.split(".myshopify.com")[0];
  const url = `https://admin.shopify.com/store/${storeUrl}/themes/current/editor?context=apps&template=index&activateAppId=${process.env.REACT_APP_EXTENSION_UUID_KEY}/app-embed`;

  const customCSS = `
  .Polaris-Modal__Body+.Polaris-InlineStack .Polaris-Box {
    width: 100%;
  }
  .Polaris-Modal-CloseButton{
    display:none;
  }
  /* Add any other custom styles here */
`;
  const pricingConfig = {
    hideHeader: true,
    plans: ["Free", "Premium"],
  };

  const previousStep = useCallback(() => {
    updateBoardingOnUser({ stepCount: stepCount - 1 });
  }, [stepCount]);

  const nextStep = useCallback(async () => {
    if (stepCount === 1) {
      const response = await fetch.get("app-block-status");
      if (response?.data[appUrlEndPoint]) {
        updateBoardingOnUser({ stepCount: stepCount + 1 });
        setShowWarningBanner(false);
      } else {
        setShowWarningBanner(true);
      }
    } else {
      updateBoardingOnUser({ stepCount: stepCount + 1 });
    }
  }, [stepCount, showWarningBanner]);

  // Disable/enable the Next button based on app enable status
  const isNextButtonDisabled = () => {
    if (stepCount === 2) {
      // Check if exactly 3 features are selected
      return Object.values(features).filter((isSelected) => isSelected).length !== 3;
    }
  };

  const updateBoardingOnUser = useCallback(
    async (extras) => {
      await fetch.put("/user/update", JSON.stringify({ ...profileData, ...extras }));
      await updateProfileData({ ...profileData, ...extras });
    },
    [profileData]
  );

  const onFinish = useCallback(() => {
    updateBoardingOnUser({ isOnBoardingDone: true, stepCount: 3 });
    setNavigate("/");
  }, [updateBoardingOnUser]);

  useEffect(() => {
    setStepCount(profileData?.stepCount || 1);
  }, [profileData]);

  const handleAcceptPlan = async (plan) => {
    onFinish();
  };

  return (
    <Page>
      <Card padding="300">
        <style dangerouslySetInnerHTML={{ __html: customCSS }} />
        <OnBoarding field={field} stepCount={stepCount} />
        <Scrollable style={{ maxHeight: "calc(100vh - 250px)", minHeight: "calc(100vh - 250px)" }}>
          <Box padding="1000" paddingBlockStart="0">
            {stepCount === 1 && (
              <>
                <AppStatus
                  appUrlEndPoint={appUrlEndPoint}
                  title={title}
                  showSucessBanner={true}
                  url={url}
                  showWarningBanner={showWarningBanner}
                  setShowWarningBanner={setShowWarningBanner}
                  aspectRatio={0.56}
                />
              </>
            )}
            {/* {stepCount === 2 && <Meeting page="https://appt.link/webrex-studio/announcement-bar-demo"></Meeting>} */}
            {/* {stepCount === 2 && <Pricing config={pricingConfig} onAcceptPlan={handleAcceptPlan} />} */}
            {stepCount === 2 && <OnBoardingPricing />}
          </Box>
        </Scrollable>
        <Divider borderColor="border" />
        <PageActions
          primaryAction={
            <ButtonGroup>
              {showWarningBanner && stepCount == 1 && (
                <InlineError message={t("common.Please enable our app extension.")} fieldID="appExtension" />
              )}
              {stepCount > 1 ? (
                <Button variant="secondary" size="medium" onClick={previousStep}>
                  {t("common.Prev")}
                </Button>
              ) : (
                <span className="empty" />
              )}
              <Button variant="primary" size="medium" onClick={stepCount < field.length ? nextStep : onFinish}>
                {stepCount < field.length ? t("common.Next") : t("common.Finish")}
              </Button>
            </ButtonGroup>
          }
        />
      </Card>
    </Page>
  );
}
