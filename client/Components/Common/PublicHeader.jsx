import { useTranslation } from "react-i18next";
import { Image, InlineStack, Text } from "@shopify/polaris";
import { AppLogo, ShopifyBagBlack } from "@/Assets/Index";

export function PublicHeader() {
  const { t } = useTranslation();

  const appUrl = process.env.SHOPIFY_STORE_APP_URL;
  return (
    <div
      style={{
        background: "#DDECF7",
      }}
    >
      <div
        className="page-container"
        style={{
          padding: "30px 0px",
          borderBottom: "1px solid #22465F",
        }}
      >
        <InlineStack align="space-between">
          <a href="/public/" className="logo-href">
            <Image source={AppLogo}></Image>
            <Text variant="headingXl" fontWeight="bold" as="h1">
              {process.env.SHOPIFY_APP_NAME}
            </Text>
          </a>
          <a href={appUrl} className="store-url" target="_blank">
            <button className="goto-app-button outline">
              <InlineStack gap="100" blockAlign="center" wrap={false}>
                <Image source={ShopifyBagBlack}></Image>
                {t("common.Go to Shopify App")}
              </InlineStack>
            </button>
          </a>
        </InlineStack>
      </div>
    </div>
  );
}
