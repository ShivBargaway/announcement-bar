import React from "react";
import { Badge, BlockStack, Card, Divider, Icon, InlineGrid, InlineStack, Text } from "@shopify/polaris";
import { CheckCircleIcon } from "@shopify/polaris-icons";
import { t } from "i18next";

export default function FreePlan({ plan }) {
  return (
    <div
      style={
        plan?.selected
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
              {plan.name}
            </Text>
            {plan.selected && (
              <Badge tone="success">
                <Text variant="bodyMd">{t(`common.Current`)}</Text>
              </Badge>
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
            {plan?.features.map((feature, index) => (
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
