import React from "react";
import { BlockStack, Button, InlineStack, Text } from "@shopify/polaris";
import { PremiumButton } from "@/Components/Common/PremiumBadge";

export default function CustomizeSync({
  handleSyncOpen,
  showPremium,
  premiumType,
  unlockTitle,
  priceConfig,
  gap,
  customizeButton,
  planCheckByName = false,
  title = "",
}) {
  const ButtonContent = () => {
    return customizeButton ? (
      customizeButton
    ) : (
      <Button variant="primary" onClick={handleSyncOpen}>
        {unlockTitle}
      </Button>
    );
  };
  return (
    <BlockStack gap={gap >= 0 ? gap : 3200}>
      <Text />
      <InlineStack gap="400" align="center">
        {showPremium ? (
          <PremiumButton
            unlockTitle={unlockTitle}
            type={premiumType}
            priceConfig={priceConfig}
            planCheckByName={planCheckByName}
            buttonVariant="primary"
            title={title}
          >
            <ButtonContent />
          </PremiumButton>
        ) : (
          <ButtonContent />
        )}
      </InlineStack>
      <Text />
    </BlockStack>
  );
}
