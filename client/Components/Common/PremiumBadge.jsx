import React, { useCallback, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, BlockStack, Button, Icon, InlineStack, Modal, Tooltip } from "@shopify/polaris";
import { LockIcon } from "@shopify/polaris-icons";
import { navigate } from "@/Components/Common/NavigationMenu";
import TabularPricing from "@/Pages/Pricing/TabularPricing";
import { ProfileContext } from "../../Context/ProfileContext";

export function PremiumBadge({ children }) {
  const { profileData } = useContext(ProfileContext);
  const { t } = useTranslation();

  if (profileData?.recurringPlanType !== "Free") {
    return <div>{children}</div>;
  } else {
    return <Badge tone="critical">{t("common.Premium")}</Badge>;
  }
}

export function PremiumButton({
  children,
  title,
  subTitle,
  unlockTitle,
  isWrappedWithinButton = true,
  redirectToPricing = false,
  type,
  priceConfig,
  buttonVariant,
  matchingPlan,
  customizeName,
  planCheckByName = false,
}) {
  const [activePremiumModal, setActivePremiumModal] = useState(false);
  const { profileData } = useContext(ProfileContext);
  const setNavigate = navigate();
  const { t } = useTranslation();
  const defaultPriceConfig = ["Free", "Premium", "Yearly"];

  const handleUnlockClick = useCallback(() => {
    if (redirectToPricing) setNavigate("/pricing");
    else setActivePremiumModal(!activePremiumModal);
  }, [activePremiumModal]);

  const ButtonContent = () => (
    <React.Fragment>
      {isWrappedWithinButton ? (
        <Button icon={LockIcon} onClick={handleUnlockClick} variant={buttonVariant}>
          {customizeName ? customizeName : t("common.Unlock")} {unlockTitle}
        </Button>
      ) : (
        <span onClick={handleUnlockClick}>
          <InlineStack blockAlign="center">
            <Icon source={LockIcon} tone="base" />
            &nbsp; {customizeName ? customizeName : t("common.Unlock")} {unlockTitle}
          </InlineStack>
        </span>
      )}
    </React.Fragment>
  );

  const renderUnlockComponent = ({ pricingConfig }) => (
    <React.Fragment>
      <Tooltip
        content={`${
          priceConfig?.includes("Pro-Yearly")
            ? "Pro"
            : priceConfig?.includes("Elite Yearly")
            ? "Elite"
            : priceConfig?.includes("Ultimate Monthly")
            ? "Ultimate"
            : "Premium"
        } Plan`}
      >
        <InlineStack align="center">
          <ButtonContent />
        </InlineStack>
      </Tooltip>
      <Modal size="large" titleHidden={true} open={activePremiumModal} onClose={handleUnlockClick}>
        <Modal.Section>
          <BlockStack gap="200" inlineAlign="start"></BlockStack>
          <TabularPricing
            hasBillingButton={true}
            title={title ? title : t("common.Unlock Premium features!")}
            config={pricingConfig}
            planCheckByName={planCheckByName}
          />
        </Modal.Section>
      </Modal>
    </React.Fragment>
  );

  // Improved logic for showing the icon or label
  if (type && profileData?.featureData) {
    if (profileData?.featureData?.[type] === "false" || !profileData?.featureData?.[type]) {
      return renderUnlockComponent({ pricingConfig: { plans: defaultPriceConfig } });
    }
    return <div>{children}</div>;
  } else if (
    profileData?.recurringPlanType === "Free" ||
    (matchingPlan && !matchingPlan?.includes(profileData?.recurringPlanId))
  ) {
    return renderUnlockComponent({ pricingConfig: { plans: priceConfig || defaultPriceConfig } });
  } else return <div>{children}</div>;
}
