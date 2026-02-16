import React from "react";
import { InlineStack } from "@shopify/polaris";
import PartnerGrowthButton from "@/Components/Common/PartnerGrowthButton";

export default function RightSideButton() {
  return (
    <div className="right-side-button">
      <div style={{ position: "relative", display: "inline-block" }}>
        <InlineStack gap="400" align="center" blockAlign="center">
          <PartnerGrowthButton />
        </InlineStack>
      </div>
    </div>
  );
}
