import React from "react";
import { BlockStack, Card, InlineGrid, InlineStack, Text } from "@shopify/polaris";
import { frillWidgetList } from "../../../Assets/Mocks/Frill.mock";
import { CommonIcon } from "../../../Components/Common/CommonIcon";

export default function Frill() {
  return (
    <BlockStack gap={400}>
      <InlineGrid gap="400" columns={2}>
        {frillWidgetList.map((item, index) => (
          <Card key={index}>
            <BlockStack gap="200">
              <InlineStack gap="200">
                <InlineStack>
                  <CommonIcon data={{ icon: item?.icon, color: item?.color }} size="10" />
                </InlineStack>
                <Text variant="headingMd" as="span">
                  {item?.title}
                </Text>
              </InlineStack>
              <Text>{item?.tagLine}</Text>
              {item?.button}
            </BlockStack>
          </Card>
        ))}
      </InlineGrid>
    </BlockStack>
  );
}
