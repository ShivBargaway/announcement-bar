import React, { useContext, useMemo } from "react";
import {
  Badge,
  BlockStack,
  Box,
  Button,
  Divider,
  Icon,
  InlineGrid,
  InlineStack,
  Link,
  Page,
  Text,
  Thumbnail,
} from "@shopify/polaris";
import { AppsIcon, DiscountFilledIcon, StarFilledIcon, ThumbsUpIcon } from "@shopify/polaris-icons";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import {
  ABLogo,
  CCLogo,
  ImageOptimizerAppLogo,
  SchemaAppLogo,
  SeoLogo,
  TechnicalSEOAppLogo,
  UpSellLogo,
} from "@/Assets/Index";
import { getOfferTrialText } from "@/Assets/Mocks/CommonPricing.mock";
import { ProfileContext } from "@/Context/ProfileContext";
import DismissibleBanner from "./DismissibleBanner";
import FreeAppUninstallBanner from "./FreeAppUninstallBanner";

const initialData = (offerTrialDays) => [
  {
    appName: "Webrex AI SEO Optimizer Schema",
    url: "https://apps.shopify.com/breadcrumbs-schemas",
    description: "25+ Features for AI Meta SEO, Audit, Schema, Image, Breadcrumb",
    logo: SeoLogo,
    review: 640,
    isPopular: true,
    isPremium: true,
    builtForShopify: true,
    trialDays: offerTrialDays > 0 ? 0 : 7,
    offerTrialDays,
    // isHide: true,
  },
  {
    appName: "Webrex: Upsell & Cross Sell",
    url: "https://apps.shopify.com/webrex-up-sell-cross-sell",
    description: "Boost AOV with Frequently Bought Together, cross sell & upsell bundles",
    logo: UpSellLogo,
  },
  {
    appName: "Webrex ‑ Currency Converter",
    url: "https://apps.shopify.com/currency-converter-11",
    description: "Redirect customers to the right geolocation, market, language",
    logo: CCLogo,
    review: 323,
    isPremium: true,
    builtForShopify: true,
    trialDays: 7,
  },
  {
    appName: "WebRex Multi Announcement Bar",
    url: "https://apps.shopify.com/announcement-bar-with-slider",
    description: "Boost sales with announcement bars, free shipping, countdowns!",
    logo: ABLogo,
    review: 449,
  },
  {
    appName: "Webrex: SEO Schema, JSON‑LD",
    url: "https://apps.shopify.com/webrex-seo-schema",
    description: "Schema for Rich Snippets: increases SEO and Google rankings",
    logo: SchemaAppLogo,
  },
  {
    appName: "Webrex: SEO Image Optimizer",
    url: "https://apps.shopify.com/webrex-image-optimization",
    description: "Get SEO Image Optimizer & Improve site speed & SEO in 1-click.",
    logo: ImageOptimizerAppLogo,
  },
  {
    appName: "Webrex: SEO Audit Optimizer",
    url: "https://apps.shopify.com/webrex-technical-seo",
    description: "Optimize your store seo with advanced technical audits",
    logo: TechnicalSEOAppLogo,
  },
];

const CreateAppBlock = ({ filterData, isHighlighted }) => (
  <div
    style={
      isHighlighted
        ? {
            background: "linear-gradient(135deg, #f6f8fa 0%, #e8f5e8 100%)",
            border: "2px solid #00a86b",
            borderRadius: "12px",
            padding: "10px",
            position: "relative",
            boxShadow: "0 4px 12px rgba(0, 168, 107, 0.15)",
            marginTop: "10px",
          }
        : {}
    }
  >
    {isHighlighted && (
      <InlineStack align="center" blockAlign="end">
        <div
          style={{
            position: "absolute",
            top: "-25px",
            color: "white",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 10,
            border: "2px solid #00a86b",
          }}
        >
          <Badge tone="attention">
            <InlineStack blockAlign="center" align="center">
              <Text variant="headingSm">Recommended</Text>
              <Icon source={ThumbsUpIcon} />
            </InlineStack>
          </Badge>
        </div>
      </InlineStack>
    )}
    <InlineGrid columns={2} gap="400">
      {filterData.map((e, index) => (
        <BlockStack key={index}>
          <InlineGrid gap="200" columns={"0fr 1fr"}>
            <InlineStack key={index} gap={500} wrap={false} blockAlign="start">
              <Box className="recommended-badge">
                <Thumbnail source={e?.logo} size="medium" alt="App icon" />
                {e?.isPopular && (
                  <div className="recommendedApp" style={{ left: "-55px" }}>
                    <div style={{ marginLeft: "35px" }}>Popular</div>
                  </div>
                )}
              </Box>
            </InlineStack>

            <BlockStack gap="100" align="start">
              <InlineStack align="space-between" blockAlign="start">
                <BlockStack gap="100" align="start">
                  <Link removeUnderline={true} url={e.url} target="_blank">
                    <Text variant="headingMd">{e?.appName}</Text>
                  </Link>

                  <InlineStack blockAlign="center" align="start">
                    <Text variant="bodySm" tone="subdued">
                      5.0
                    </Text>
                    <div style={{ width: "20px", height: "22px" }}>
                      <Icon source={StarFilledIcon} tone="success" />
                    </div>
                    {e?.review && (
                      <Link removeUnderline={true} url={`${e.url}?source=SEO-app#adp-reviews`} target="_blank">
                        <Text variant="bodySm" tone="subdued">
                          ({e?.review})
                        </Text>
                      </Link>
                    )}
                    <Text variant="bodySm" tone="subdued" as="div">
                      •{" "}
                      <Badge tone={e?.isPremium ? "success" : "attention"}>
                        <InlineStack gap="200">
                          <Text variant="bodySm" fontWeight="bold">
                            {e?.isPremium ? "Free plan available" : "Free"}
                          </Text>
                          {e?.trialDays > 0 && (
                            <Text variant="bodySm" fontWeight="bold">
                              • {e?.trialDays} days free trial
                            </Text>
                          )}
                        </InlineStack>
                      </Badge>
                    </Text>
                  </InlineStack>
                </BlockStack>
                <Button url={e.url} target="_blank" variant="primary" size="micro" tone="success">
                  {t("common.Install")}
                </Button>
              </InlineStack>

              {e?.offerTrialDays > 0 && (
                <InlineStack>
                  <Badge tone="warning-strong" icon={DiscountFilledIcon} size="medium">
                    <Text fontWeight="bold">
                      {getOfferTrialText(e?.offerTrialDays)} free trial – Limited time offer!
                    </Text>
                  </Badge>
                </InlineStack>
              )}

              <Text variant="bodySm" tone="subdued">
                {e?.description}
              </Text>
              {e?.builtForShopify && (
                <InlineStack>
                  <Badge tone="info">💎 {t("common.Built for Shopify")} </Badge>
                </InlineStack>
              )}
            </BlockStack>
          </InlineGrid>
        </BlockStack>
      ))}
    </InlineGrid>
  </div>
);

const CreateSEOAppBlock = ({ data, offerTrialDays }) => (
  <BlockStack>
    <InlineGrid blockAlign="start" columns={"2.4fr 1fr"} gap={0}>
      <InlineGrid gap={300} wrap={false} blockAlign="start" columns={"0fr 1fr 1fr"}>
        <div>
          <Thumbnail source={data?.logo} size="medium" alt="App icon" />
        </div>

        <BlockStack gap="100" align="start">
          <Link removeUnderline={true} url={data?.url} target="_blank">
            <Text variant="headingMd">{data?.appName}</Text>
          </Link>
          <Text variant="bodySm" tone="subdued">
            {data?.description}
          </Text>
        </BlockStack>
        <BlockStack gap="100" align="start">
          <InlineStack>
            <Badge tone="warning-strong" icon={DiscountFilledIcon} size="medium">
              <Text fontWeight="bold">
                {offerTrialDays} {t("common.days free trial – Limited time offer!")}
              </Text>
            </Badge>
          </InlineStack>
          <InlineStack blockAlign="center" align="start">
            <Text variant="bodySm" tone="subdued">
              5.0
            </Text>
            <div style={{ width: "20px", height: "22px" }}>
              <Icon source={StarFilledIcon} tone="success" />
            </div>
            <Link removeUnderline={true} url={`${data.url}?source=SEO-app#adp-reviews`} target="_blank">
              <Text variant="bodySm" tone="subdued">
                ({data?.review})
              </Text>
            </Link>
            <Text variant="bodySm" tone="subdued" as="div">
              •{" "}
              <Badge tone={data?.isPremium ? "success" : "attention"}>
                <InlineStack gap="200">
                  <Text variant="bodySm" fontWeight="bold">
                    {"Free plan available"}
                  </Text>
                </InlineStack>
              </Badge>
            </Text>
          </InlineStack>
          <InlineStack>
            <Badge tone="info">💎 {t("common.Built for Shopify")} </Badge>
          </InlineStack>
        </BlockStack>
      </InlineGrid>
      <BlockStack>
        <InlineStack align="end" blockAlign="end">
          <Button url={data.url} target="_blank" variant="primary">
            {t("common.Install now and get")} {offerTrialDays} {t("common.days free access")}
          </Button>
        </InlineStack>
      </BlockStack>
    </InlineGrid>
  </BlockStack>
);

const AppBlock = ({ mockData, type, offerTrialDays }) => {
  if (type === "offerBanner")
    return (
      offerTrialDays > 0 && (
        <div>
          <DismissibleBanner
            title={
              <Text variant="headingMd">
                {t("common.Discover our most popular app")} - {getOfferTrialText(offerTrialDays)}{" "}
                {t("common.free access of premium features !!")}
              </Text>
            }
            icon={AppsIcon}
            tone="success"
            skipRemove={true}
            bannerName="ReviewBanner"
            bannerText={<CreateSEOAppBlock data={mockData[0]} offerTrialDays={offerTrialDays} />}
          />
        </div>
      )
    );

  return (
    <DismissibleBanner
      title={<Text variant="headingMd">{t("common.Discover more free apps")}</Text>}
      icon={AppsIcon}
      tone="success"
      skipRemove={true}
      bannerName="ReviewBanner"
      bannerText={
        <BlockStack gap="400">
          <Text />
          <CreateAppBlock filterData={mockData?.slice(0, 2)} isHighlighted={true} />
          {/* <Divider /> */}
          <CreateAppBlock filterData={mockData?.slice(2, 4)} />
          <Divider />
          <CreateAppBlock filterData={mockData?.slice(4, 6)} />
          <Divider />
          <CreateAppBlock filterData={mockData?.slice(6)} />
        </BlockStack>
      }
    />
  );
};

export default function FreeAppPromotion({ showPage, backbutton, type = "appBlocks" }) {
  const { profileData } = useContext(ProfileContext);

  const offerTrialDays = useMemo(() => {
    if (!profileData) return 0;

    const { created_at, plan_display_name } = profileData;
    const daysSinceCreation = differenceInDays(new Date(), new Date(created_at));
    const isBasicPlan = plan_display_name === "Basic";

    return daysSinceCreation < 180 && isBasicPlan
      ? 180 - daysSinceCreation < 30
        ? 30
        : 180 - daysSinceCreation
      : 0;
  }, [profileData]);

  const mockData = useMemo(() => initialData(offerTrialDays)?.filter((data) => !data?.isHide), [offerTrialDays]);

  return showPage ? (
    <Page title={t("common.Partners")} backAction={backbutton}>
      <FreeAppUninstallBanner />
      <AppBlock mockData={mockData} type={type} offerTrialDays={offerTrialDays} />
    </Page>
  ) : (
    <AppBlock mockData={mockData} type={type} offerTrialDays={offerTrialDays} />
  );
}
