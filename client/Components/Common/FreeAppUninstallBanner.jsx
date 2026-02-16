import React, { useMemo } from "react";
import { useContext } from "react";
import { Banner, Text } from "@shopify/polaris";
import { t } from "i18next";
import { ProfileContext } from "@/Context/ProfileContext";

export default function FreeAppUninstallBanner() {
  const { profileData } = useContext(ProfileContext);

  const userCount = useMemo(
    () => (profileData?.appInstallNumber > 930 ? 930 : profileData?.appInstallNumber || 304),
    [profileData]
  );

  return (
    <Banner title={t("common.Don't uninstall app - You're an early access user!")} tone="critical">
      <Text as="p">
        {t("common.You are one of our first 1000 users")}{" "}
        <b>
          ({t("common.currently")} #{userCount}){" "}
        </b>{" "}
        {t("common.and have")} <b>{t("common.lifetime free access")}</b> {t("common.to")}{" "}
        <b>{t("common.all premium schema")}</b>. {t("common.If you uninstall now and reinstall later, you may")}{" "}
        <b>{t("common.lose this exclusive benefit")}</b> {t("common.as we're")}{" "}
        <b>{t("common.approaching our limit")}</b>.
      </Text>
    </Banner>
  );
}
