import React from "react";
import { BlockStack, Box, Card, Image, InlineStack, Text } from "@shopify/polaris";
import { t } from "i18next";
import VideoTitle from "@/Components/Common/VideoTitle";

export default function CustomMediaCard({ item, Action }) {
  return (
    <Box minHeight={"300px"}>
      <Card padding={0}>
        <BlockStack>
          <Image width="100%" style={{ objectFit: "cover", objectPosition: "center" }} source={item.image} />
          <div style={{ padding: "15px" }}>
            <BlockStack gap={200}>
              <VideoTitle
                selector={item.title}
                titleLabel={<Text variant="bold">{t(`common.${item.title}`)}</Text>}
              />
              <Text>{t(`common.${item.description}`)}</Text>
              <InlineStack> {Action}</InlineStack>
            </BlockStack>
          </div>
        </BlockStack>
      </Card>
    </Box>
  );
}
