import React from "react";
import { Box, Icon } from "@shopify/polaris";

export function CommonIcon({ data, size = 36 }) {
  return (
    <div className="common-icon">
      <Box
        minWidth={`${size}px`}
        minHeight={`${size}px`}
        background={`bg-surface-${data.color}`}
        borderRadius="200"
        borderColor={`border-${data.color}`}
        borderWidth="025"
        width="100%"
        height="100%"
      >
        <Icon source={data.icon} tone={data.color} />
      </Box>
    </div>
  );
}
