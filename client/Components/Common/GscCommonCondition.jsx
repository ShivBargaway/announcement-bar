import React, { useCallback } from "react";
import { InlineStack, Link, Text } from "@shopify/polaris";
import { t } from "i18next";
import DismissibleBanner from "./DismissibleBanner";
import { navigate } from "./NavigationMenu";
import { PremiumButton } from "./PremiumBadge";

export default function GscCommonCondition({ profileData }) {
  const setNavigate = navigate();

  const handleNavigate = useCallback((event) => {
    event.stopPropagation();
    setNavigate("/google-search-console");
  }, []);

  return !profileData?.featureData?.googleIndexStatus ? (
    <DismissibleBanner
      tone="critical"
      skipRemove={true}
      bannerName="schemaErrorBanner2"
      bannerText={
        <InlineStack gap={200}>
          <Text>{t("common.Unlock to activate Schema Analysis")}</Text>
          <PremiumButton
            unlockTitle=""
            type="googleIndexStatus"
            priceConfig={["Free", "Pro-Yearly", "Pro-Monthly"]}
            title={t("common.Unlock advanced features!")}
          />
        </InlineStack>
      }
    />
  ) : !profileData?.googleAuthTokens?.access_token ? (
    <DismissibleBanner
      tone="critical"
      bannerName="schemaErrorBanner1"
      skipRemove={true}
      bannerText={
        <Text as="span">
          {`${t("common.Your")} google search console ${t("common.is not connected. Connect now from")}`}{" "}
          <Link variant="monochromePlain" onClick={handleNavigate}>
            {t("common.here")}.
          </Link>
        </Text>
      }
    />
  ) : null;
}
