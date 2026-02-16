import React from "react";
import { Text } from "@shopify/polaris";

const TruncatedText = ({ text, maxLines, maxLength, color, variant, fontWeight }) => {
  let truncatedText = text;
  if (maxLength) truncatedText = text?.length - 3 > maxLength ? text.slice(0, maxLength) + "..." : text;
  return maxLength ? (
    <Text as="p" tone={color} variant={variant || ""} fontWeight={fontWeight}>
      {truncatedText}
    </Text>
  ) : (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .truncated-text {
          display: -webkit-box; 
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5em;
          -webkit-line-clamp: ${maxLines};
          color: ${color};
          white-space: normal;
        }
      `,
        }}
      />
      <p className="truncated-text"> {text}</p>
    </div>
  );
};

export default TruncatedText;
