import { useTranslation } from "react-i18next";
import { InlineStack, Link, Text, TopBar } from "@shopify/polaris";

export function PublicFooter() {
  const { t } = useTranslation();

  return (
    <div style={{ background: "#0F4062", color: "fff", padding: "30px" }}>
      <div className="footer page-container">
        <InlineStack align="space-between">
          <Text tone="text-inverse" as="p" alignment="center" fontWeight="regular">
            {t("common.© 2021 Webrex. All rights reserved.")}
          </Text>
          <InlineStack gap="400">
            <Link tone="#fff" url="/public/privacy-policy" removeUnderline>
              {t("common.Privacy Policy")}
            </Link>
            <Link tone="#fff" url="/public/terms-of-service" removeUnderline>
              {t("common.Terms of Service")}
            </Link>
          </InlineStack>
        </InlineStack>
      </div>
    </div>
  );
}
