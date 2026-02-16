import React from "react";
import { BlockStack, Box, Card, Divider, InlineStack, Link, Scrollable, Text, Tooltip } from "@shopify/polaris";
import { BlogIcon, QuestionCircleIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { CommonIcon } from "./CommonIcon";

export default function LearnMore({
  type,
  data = [],
  heading = "",
  multipleAllow = false,
  textAboveIcon = false,
  textVariant = "",
}) {
  const tooltipContent = (data) => (
    <Box padding="100">
      <Scrollable style={{ height: "100px" }}>
        <Box padding="200">
          <BlockStack gap="200">
            {data?.map((obj, index) => (
              <div key={index}>
                <InlineStack key={index} gap="200">
                  <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
                  <Link url={obj?.url} target="_blank">
                    <Text variant={textVariant}>{obj?.title}</Text>
                  </Link>
                </InlineStack>
              </div>
            ))}
          </BlockStack>
        </Box>
      </Scrollable>
    </Box>
  );

  const renderIcon = () => {
    if (multipleAllow) {
      return (
        <Tooltip content={tooltipContent(data)}>
          <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
        </Tooltip>
      );
    } else if (textAboveIcon) {
      return (
        <InlineStack gap="200">
          <Text variant={textVariant}>{data?.[0]?.title}</Text>
          <Link url={data?.[0]?.url} target="_blank">
            <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
          </Link>
        </InlineStack>
      );
    } else {
      return (
        <Link url={data?.[0]?.url} target="_blank">
          <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
        </Link>
      );
    }
  };

  const renderFooter = () => (
    <BlockStack gap="300">
      <Text />
      <InlineStack gap="100" align="center">
        <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
        <Text variant={textVariant}>{t("common.Learn more about")}</Text>
        <Link url={data?.[0].url} target="_blank">
          {data?.[0]?.title}
        </Link>
      </InlineStack>
      <Text />
    </BlockStack>
  );

  const renderTextLink = () => (
    <Text variant={textVariant}>
      <Link url={data?.[0].url} target="_blank">
        {data?.[0]?.title}
      </Link>
    </Text>
  );

  const renderFaqSection = () => (
    <Card>
      <BlockStack gap="400">
        {heading && (
          <BlockStack gap="200">
            <InlineStack gap="200">
              <CommonIcon data={{ icon: BlogIcon, color: "info" }} size="20" />
              <Text variant="headingMd">{heading}</Text>
            </InlineStack>
            <Divider />
          </BlockStack>
        )}
        <BlockStack gap="200">
          {data?.map((obj, index) => (
            <InlineStack key={index} gap="200">
              <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="10" />
              <Link url={obj?.url} target="_blank">
                <Text variant="headingSm">{obj?.title}</Text>
              </Link>
            </InlineStack>
          ))}
        </BlockStack>
      </BlockStack>
    </Card>
  );

  return (
    <>
      {type === "icon" && renderIcon()}
      {type === "footer" && renderFooter()}
      {type === "faqSection" && data.length > 0 && renderFaqSection()}
      {type === "textLink" && renderTextLink()}
    </>
  );
}
