import { useEffect } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { Badge, BlockStack, Card, InlineStack, Text } from "@shopify/polaris";
import { t } from "i18next";

function OnBoardingPricing() {
  return (
    <BlockStack gap={300}>
      <BlockStack align="center" inlineAlign="center" gap={300}>
        <ConfettiExplosion width={2000} height={1000} duration={3000} zIndex={1000000} />
        <Text tone="critical" variant="headingLg" as="div">
          <div style={{ fontSize: "30px", fontWeight: "bold", color: "rgb(234 53 114)" }}>
            🎊{t("common.Congratulations")}!!🎊
          </div>
        </Text>
      </BlockStack>

      <ConfettiExplosion width={2000} height={1000} duration={3000} zIndex={1000000} />
      <Card>
        <BlockStack gap="200">
          <InlineStack align="start" blockAlign="center" gap={100}>
            <Text variant="headingLg" as="h2" alignment="center">
              {t("common.Enjoy a Full Access — For Free!")}
            </Text>
          </InlineStack>

          <BlockStack>
            <Text style="background:#e6ffed; padding:12px; border-radius:6px; font-size:16px;">
              ✅ <strong>{t("common.All Premium Features. Now Free for you.")}</strong>
              <br /> {t("common.We’ve removed all pricing barriers so you can grow faster without limits.")}
            </Text>
          </BlockStack>
        </BlockStack>
      </Card>
      <Text variant="bodyMd" as="p" alignment="center" tone="subdued">
        ⚠️ {""}
        {t("common.Important")}:{""}
        {t(
          "common.This is a permanent upgrade offer. If you uninstall the app, You may not get this offer again."
        )}
      </Text>
    </BlockStack>
  );
}

export default OnBoardingPricing;
