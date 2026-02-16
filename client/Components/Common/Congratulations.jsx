import React from "react";
import { BlockStack, Card, Text } from "@shopify/polaris";
import { t } from "i18next";

export default function Congratulations({ planName, purchasePlanInfo, price }) {
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <Card background="bg-surface-info">
        <BlockStack gap={200} align="center" inlineAlign="center">
          <Text variant="headingXl">🎉 {t("common.Congratulations")}!</Text>
          <Text variant="bodyLg" tone="subdued">
            {t("common.You've successfully purchased the")}
          </Text>
          <Card padding={"600"}>
            <BlockStack gap={200} align="center" inlineAlign="center">
              <Text variant="headingMd" alignment="center">
                {planName}
              </Text>
              <Text variant="headingLg" tone="success" fontWeight="bold" alignment="center">
                ${purchasePlanInfo?.planPrice || price}
              </Text>
            </BlockStack>
          </Card>
          <Text variant="bodyLg" tone="subdued">
            {t("common.Our customer support team will contact you shortly to proceed further.")}
          </Text>
        </BlockStack>
      </Card>
    </div>
  );
}
