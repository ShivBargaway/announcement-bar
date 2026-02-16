import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";

export function AppBlockStatus({ name }) {
  const { appStatus } = useContext(ProfileContext);
  const { t } = useTranslation();

  if (!appStatus) {
    return <></>;
  }
  if (appStatus[name]) {
    return (
      <Badge size="small" tone="success">
        {t("common.On")}
      </Badge>
    );
  }
  return <Badge size="small">{t("common.Off")}</Badge>;
}
