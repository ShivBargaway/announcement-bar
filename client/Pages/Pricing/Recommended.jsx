import "react";
import { BlockStack, Box, Button, Card, Icon, InlineGrid, InlineStack, Text, Thumbnail } from "@shopify/polaris";
import { StarFilledIcon } from "@shopify/polaris-icons";
import { AppList } from "../../Assets/Mocks/CommonPricing.mock";

export default function Recommended() {
  return (
    <div>
      <Card>
        <BlockStack gap="500">
          <Text variant="headingMd" as="span">
            Recommended Apps
          </Text>
          <InlineGrid gap="500" columns={2}>
            {AppList.filter((i) => !i.hide).map((app, index) => (
              <InlineStack key={index} gap={500} wrap={false} blockAlign="center">
                <Box style={{ position: "relative", overflow: "hidden" }}>
                  <Thumbnail source={app.image} size="large" alt="Small document" />
                  {app?.popular && (
                    <div className="recommendedApp">
                      <div style={{ marginLeft: "10px" }}>Most Popular</div>
                    </div>
                  )}
                </Box>
                <BlockStack gap={200} align="start">
                  <InlineStack wrap={false} gap={200} blockAlign="center">
                    <Text variant="headingMd" as="span">
                      {app.title}
                    </Text>
                  </InlineStack>

                  <InlineStack align="start">
                    <Text as="p" variant="bodySm" tone="subdued">
                      {app.starRate}
                    </Text>
                    <div style={{ width: "20px", height: "16px" }}>
                      <Icon source={StarFilledIcon} tone="success" />
                    </div>
                    <Text as="p" variant="bodySm" tone="subdued">
                      ({app.reviweCount}) • Free plan available
                    </Text>
                  </InlineStack>
                  <InlineStack align="start">
                    <Button url={app.link} target="_blank">
                      Install Now
                    </Button>
                  </InlineStack>
                </BlockStack>
              </InlineStack>
            ))}
          </InlineGrid>
        </BlockStack>
      </Card>
    </div>
  );
}
