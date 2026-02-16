import React, { useCallback } from "react";
import { Badge, BlockStack, Card, Divider, Icon, InlineGrid, InlineStack, List, Text } from "@shopify/polaris";
import { ChatIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { Crisp } from "crisp-sdk-web";

export default function CustomServiceDesign({ profileData, type }) {
  const defaultFeatureList = [
    "Custom store setup and management",
    "Product and collection page design",
    "Cart and checkout customization",
    "Store migration services",
    "Theme customization",
    "Custom apps and integrations",
    "SEO and website optimization",
    "Analytics and tracking setup",
    "Ongoing website management",
    "Custom landing pages and forms",
    "App installation and setup",
  ];

  const seoFeatureList = [
    "Google search console set-up ",
    "Basic seo settings",
    "Basic reporting + recommendations",
    "Index coverage check",
    "Basic site performance overview",
    "Niche & competitor analysis",
    "Primary keyword set - collection",
    "Long-tail keyword suggestions - product",
    "Google analytics 4 setup",
    "Blog setup & integration",
    "Link relevant product with blog-post",
    "Home page image optimization",
    "Shopify seo audit",
    "Google tools setup",
  ];

  const featureList = type === "seo" ? seoFeatureList : defaultFeatureList;

  const getPriceShopifyPlanWise = (userData, hour, discount) => {
    const shopifyAdvancePlan = ["Shopify Plus", "Advanced", "Advanced Shopify", "Grow", "Shopify"];
    const mainPrice = shopifyAdvancePlan?.includes(userData?.plan_display_name) ? 15 : 10;
    const orgPrice = mainPrice * hour;
    return { price: orgPrice * (1 - discount / 100), hour: `${hour}H`, orgPrice, discount };
  };

  const openSupportChatBox = useCallback(async () => {
    let msg = "";
    if (type === "theme") {
      msg = `I'd like to use my free 10H of store customization service.\nCan you guide me through the process?`;
    } else if (type === "seo") {
      msg = `I'd like to use my free 10H of SEO service.\nCan you guide me through the process?`;
    }
    Crisp.message.setMessageText(msg);
  }, []);

  const offers = [
    {
      title: "First 10 hours free",
      mainDescription: (
        <Text tone="subdued">
          {t("common.We'll work on your store for 10 hours completely")} <b>{t("common.free")}</b>{" "}
          {t("common.of charge.🚀")}
        </Text>
      ),
      badge: (
        <>
          {t("common.Save")} <b>100%</b>
        </>
      ),
      badgeColor: "info",
    },
    {
      title: "Next 10 hours",
      mainDescription: (
        <Text tone="subdued">
          {t("common.Enjoy")} <b>{t("common.half-price customization")}</b> {t("common.for another")}{" "}
          <b>{t("common.10 hours")}</b> {t("common.after the free period.")}
        </Text>
      ),
      badge: (
        <InlineStack gap={200}>
          <Text>{t("common.Save")} 50% - </Text>
          <Text fontWeight="bold">{`$${getPriceShopifyPlanWise(profileData, 1, 0)?.price / 2}/hour`}</Text>
        </InlineStack>
      ),
      badgeColor: "success",
    },
    {
      title: "After discount period",
      mainDescription: (
        <Text tone="subdued">
          {t("common.After your discounted hours, we'll continue at our regular rate of just")}{" "}
          <b>${getPriceShopifyPlanWise(profileData, 1, 0)?.price}/hour</b>.
        </Text>
      ),
      badge: <b>${getPriceShopifyPlanWise(profileData, 1, 0)?.price}/hour</b>,
      badgeColor: "info",
    },
  ];

  return (
    <Card padding={400}>
      <BlockStack>
        {/* <Card>
          <BlockStack gap={100}>
            <Text variant="headingMd">{t("common.Specialized services")} </Text>
            <Text />
            <List type="bullet">
              <InlineGrid columns={{ sm: 1, md: 3 }}>
                {featureList?.map((item, index) => (
                  <List.Item key={index}>
                    <Text>{t(`common.${item}`)}</Text>
                  </List.Item>
                ))}
              </InlineGrid>
            </List>
          </BlockStack>
        </Card> */}
        {/* <Text variant="headingLg" as="h2">
          {t("common.Pricing details")}
        </Text>
        <Divider /> */}
        <InlineGrid columns={"1fr 0.9fr 0.9fr"} gap={200}>
          {offers?.map((e, index) => (
            <div className={`offer-tier ${index === 1 ? "middle-tier" : ""}`} key={index}>
              <InlineGrid columns={"0fr 1fr"} gap={0}>
                <span className="tier-badge">{index + 1}</span>
                <BlockStack gap={100}>
                  <InlineStack gap={100} align="start">
                    <Text variant="headingLg">{t(`common.${e?.title}`)}</Text>
                    {e?.badge && <Badge tone={e?.badgeColor}>{e?.badge}</Badge>}
                  </InlineStack>
                  {e?.mainDescription}
                </BlockStack>
              </InlineGrid>
            </div>
          ))}
        </InlineGrid>
        <InlineStack align="center">
          <InlineStack align="center" blockAlign="center">
            <button className="support-button" onClick={openSupportChatBox}>
              <InlineStack gap={100} align="center" blockAlign="center">
                <div>
                  <Icon source={ChatIcon} />
                </div>
                {t("common.Start your free services")}
              </InlineStack>
            </button>
          </InlineStack>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
