import React from "react";
import { Card, EmptyState, Page, Text } from "@shopify/polaris";
import { EmptyReuslt } from "@/Assets/Index";

export default function NoAccessStoreDesign() {
  return (
    <Page padding="500">
      <div style={{ marginTop: "80px" }}>
        <Card padding={1000}>
          <EmptyState image={EmptyReuslt} fullWidth>
            <br />
            <Text
              variant="bodyLg"
              fontWeight="semibold"
            >{`Sorry, ${process.env.SHOPIFY_APP_NAME} no longer supports development stores.`}</Text>
            <br />
            <Text variant="bodyMd">{`Users, agencies, or store builders seeking to continue using the ${process.env.SHOPIFY_APP_NAME} for specific purposes are kindly requested to contact our customer service team for assistance.`}</Text>
          </EmptyState>
        </Card>
      </div>
    </Page>
  );
}
