import React from "react";
import { BlockStack, Text } from "@shopify/polaris";

const MainDesign = ({ Component, heading, ...props }) => (
  <BlockStack gap="400">
    {heading && (
      <Text variant="headingMd" fontWeight="bold" as="h5">
        {heading}
      </Text>
    )}
    <Component {...props} />
  </BlockStack>
);

export default MainDesign;
