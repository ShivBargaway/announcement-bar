import React from "react";
import { Card, InlineStack, Text } from "@shopify/polaris";
import MainDesign from "../../Announcement/MainDesign";

export default function MultipleCard({ cardVisibilityId, item, onChange, onSubmit, mobileView }) {
  if (cardVisibilityId !== item.id) return null;

  const initialValue = mobileView ? item.mobileSetting || item.desktopSetting : item.desktopSetting;

  return (
    <div style={{ cursor: "default", marginTop: "10px" }}>
      <Card>
        <InlineStack>
          {item.helpText && (
            <Text variant="headingSm" as="h6">
              {item.helpText}
            </Text>
          )}
        </InlineStack>
        <MainDesign
          handleFormChange={onChange}
          Component={item.component}
          initialValue={initialValue}
          handleSubmit={onSubmit}
          fieldsToRemove={item.fieldsToRemove || ""}
        />
      </Card>
    </div>
  );
}
