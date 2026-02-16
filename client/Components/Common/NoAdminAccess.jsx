import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Text } from "@shopify/polaris";

export default function NoAdminAccess() {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "100px",
        width: "100%",
      }}
    >
      <br />
      <br />
      <Text variant="heading2xl" as="h2" tone="critical">
        {t("common.Oops! Something went wrong. Admin token is malformed")}
      </Text>
      <br />
      <Text variant="headingMd" as="h4" tone="caution">
        {t("common.Let's try that again, please refresh the page.")}
      </Text>
      <Text variant="headingMd" as="h4" tone="caution">
        {t("common.If you're still stuck, contact")}&nbsp;
        <Link url="mailto:support@webrexstudio.com" target="_blank">
          {t("common.support@webrexstudio.com")}
        </Link>
        &nbsp;{t("common.so we can help!")}
      </Text>
    </div>
  );
}
