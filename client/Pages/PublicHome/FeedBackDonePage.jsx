import React from "react";
import { BlockStack, Card, Page, Text } from "@shopify/polaris";

export default function FeedBackDonePage() {
  return (
    <Page title="Feedback submitted">
      <Card>
        <BlockStack gap={400} inlineAlign="center">
          <Text />
          <Text />
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <BlockStack gap={200} inlineAlign="center">
            <Text>Thank You for Your Feedback!</Text>
            <div style={{ width: "70%" }}>
              <Text as="p" variant="bodyMd" color="subdued">
                Your video feedback has been submitted! Once approved, you’ll unlock one premium feature of your
                choice.
              </Text>
            </div>

            <Card>
              <BlockStack gap={200} inlineAlign="start">
                <Text variant="headingMd">What's Next?</Text>
                <BlockStack gap={100} inlineAlign="start">
                  <Text> ✅ Our team will review your submission (24–48 hours).</Text>
                  <Text>
                    ✅ You’ll receive an email confirmation with instructions to choose your premium feature.
                  </Text>
                  <Text> ✅ Your premium feature will be unlocked automatically on your account.</Text>
                </BlockStack>
              </BlockStack>
            </Card>
          </BlockStack>
        </BlockStack>
      </Card>
    </Page>
  );
}
