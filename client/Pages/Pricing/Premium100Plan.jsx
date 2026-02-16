import React from "react";
import { Badge, BlockStack, Button, Card, Divider, Icon, InlineGrid, InlineStack, Text } from "@shopify/polaris";
import { CheckCircleIcon } from "@shopify/polaris-icons";
import { t } from "i18next";

const features = () => [
  { text: "Unlimited Slides Creation" },
  { text: "Multiple Placement Options" }, // Clearer than "Position"
  { text: "Instant Contact Bar" },
  { text: "Add to Cart Bar" }, // Adds action context
  { text: "Advanced Analytics Dashboard" },
  { text: "Free Shipping Promo Bar" }, // Explains purpose
  { text: "Rich Text Editor" }, // Emphasizes ease
  { text: "Country-Specific Filtering" },
  { text: "Reusable Countdown Timer" }, // Better than "Repeated"
  { text: "Full Design Customization" },
  { text: "Custom Background Images" }, // More natural phrasing
  { text: "24/7 Live Chat Support" }, // Added availability
];

export default function Premium100Plan({ selectedPlan, fetch, setSelectedPlan, updateProfileData }) {
  const acceptPremium100Plan = async () => {
    const res = await fetch.post("acceptPremium100Plan", {});
    if (res?.data?.plan) setSelectedPlan(res?.data?.plan);
    if (res?.data?.user) updateProfileData(res?.data?.user);
  };

  return (
    <div
      style={
        selectedPlan?.id === "Premium100"
          ? {
              border: "2px solid #008060",
              borderRadius: "15px",
              boxShadow: "0 0 .3125rem #aee9d1,0 .0625rem .125rem #aee9d1",
              width: "100%",
            }
          : { width: "100%" }
      }
    >
      <Card>
        <BlockStack gap={400}>
          <InlineStack blockAlign="center" align="space-between">
            <Text variant="headingLg" as="h2">
              Premium
            </Text>
            {selectedPlan?.id === "Premium100" ? (
              <Badge tone="success">
                <Text variant="bodyMd">{t(`common.Current`)}</Text>
              </Badge>
            ) : (
              <Button variant="primary" onClick={acceptPremium100Plan}>
                {t("common.Get freely access premium plan")}
              </Button>
            )}
          </InlineStack>
          <Divider />
          <InlineGrid
            gap="100"
            columns={{
              xs: "1",
              sm: "2",
              md: "3",
              lg: "4",
            }}
          >
            {features().map((feature, index) => (
              <InlineStack gap="100" key={index} blockAlign="center" wrap={false}>
                <Icon size="large" source={CheckCircleIcon} tone="success" className="custom-icon" />
                <Text wrap as="p">
                  {t(`common.${feature.text}`)}
                </Text>
              </InlineStack>
            ))}
          </InlineGrid>
        </BlockStack>
      </Card>
    </div>
  );
}
