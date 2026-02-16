import React from "react";
import { Box, Divider, InlineStack, Text } from "@shopify/polaris";

export function AdminPublicHeader() {
  return (
    <React.Fragment>
      <Box padding="200" background="border-warning">
        <InlineStack align="center">
          <Text variant="headingMd" fontWeight="bold" as="h6">
            {process.env.SHOPIFY_APP_NAME} Admin Panel
          </Text>
        </InlineStack>
      </Box>
      <Divider borderColor="border" />
    </React.Fragment>
  );
}
