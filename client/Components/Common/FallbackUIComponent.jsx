import React from "react";
import { Link, Text } from "@shopify/polaris";
import { t } from "i18next";

export default function FallbackUIComponent() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
      }}
    >
      <br />
      <br />
      <Text variant="heading2xl" as="h2" tone="critical">
        {t("common.Oops! Something went wrong.")}
      </Text>
      <br />
      <Text variant="headingMd" as="h4" tone="caution">
        {t("common.Let's try that again, please refresh the page.")}
      </Text>
      <Text variant="headingMd" as="h4" tone="caution">
        {t("common.If you're still stuck, contact us by chat support or")} &nbsp;
        <Link url="mailto:support@webrexstudio.com" target="_blank">
          {t("common.support@webrexstudio.com")}
        </Link>
        &nbsp;{t("common.so we can help!")}
      </Text>
    </div>
  );
}
