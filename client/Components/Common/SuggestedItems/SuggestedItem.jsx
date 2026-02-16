import React from "react";
import { Badge, BlockStack, Box, InlineStack, SkeletonBodyText, Text } from "@shopify/polaris";
import { t } from "i18next";
import { CommonIcon } from "@/Components/Common/CommonIcon";
import { navigate } from "@/Components/Common/NavigationMenu";

export function SuggestedItem({ index, item }) {
  const setNavigate = navigate();
  const availableColors = ["caution", "info", "success", "critical", "warning"];
  const randomColor = availableColors[index % availableColors.length];

  return (
    <div
      className="suggested-item"
      onClick={() => {
        if (item.navigate) {
          setNavigate(`${item.navigate}`);
        }
      }}
    >
      <BlockStack gap="400">
        <Box
          minWidth="280px"
          padding="500"
          borderWidth="025"
          borderRadius="200"
          background="bg-surface"
          borderColor="bg-surface"
        >
          <BlockStack gap="200">
            <InlineStack align="start" blockAlign="center">
              <div style={{ width: "34px" }}>
                <CommonIcon data={{ color: randomColor, icon: item.icon }} size="34" />
              </div>
              <div
                className="title"
                style={{
                  width: "calc(100% - 34px)",
                  color: `var(--p-color-text-${randomColor})`,
                  paddingLeft: "var(--p-space-300)",
                }}
              >
                <InlineStack blockAlign="start">
                  {item?.title?.length > 0 ? (
                    <BlockStack inlineAlign="start" gap={100}>
                      <Text variant="headingMd" as="h5">
                        {item.title}
                      </Text>
                      {item?.showBadge && (
                        <Badge tone={item.badgeStatus ? "success" : "critical"} size="small">
                          {item.badgeStatus ? t("common.On") : t("common.Off")}
                        </Badge>
                      )}
                    </BlockStack>
                  ) : (
                    <SkeletonBodyText lines={1} />
                  )}
                </InlineStack>
              </div>
            </InlineStack>
            {item?.description?.length > 0 ? (
              <Text variant="bodyText">{item.description}</Text>
            ) : (
              !item?.noDescription && <SkeletonBodyText lines={2} />
            )}
          </BlockStack>
        </Box>
      </BlockStack>
    </div>
  );
}
