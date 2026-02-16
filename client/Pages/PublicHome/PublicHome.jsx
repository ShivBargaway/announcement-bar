import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Image, InlineGrid, InlineStack, Text } from "@shopify/polaris";
import { ABLogo, CCLogo, LandingPageIllustration, LinkifyLogo, ShopifyBagWhite } from "@/Assets/Index";
import { getPlansData } from "../../Assets/Mocks/CommonPricing.mock";

export default function PublicHome() {
  const appUrl = process.env.SHOPIFY_STORE_APP_URL;
  const { hash } = useLocation();
  const plansData = getPlansData();

  useEffect(() => {
    if (hash) {
      const targetElement = document.querySelector(hash);
      if (targetElement) targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <BlockStack gap="500">
      <div
        className="flex-div"
        style={{
          height: "600px",
          background: "#DDECF7",
        }}
      >
        <div className="page-container">
          <BlockStack align="space-around" inlineAlign="center" gap="100">
            <h1 className="hero-text">
              Optimize your Store by align correct SEO to improve ranking, boost visibility
            </h1>
            <Text variant="headingXl" as="p" alignment="center" tone="subdued" fontWeight="regular">
              Optimize Your Store with Strategic SEO: Improve Organic Ranking and Amplify Visibility in Search
              Results
            </Text>
            <a href={appUrl} className="store-url" target="_blank">
              <button className="goto-app-button">
                <InlineStack gap="100" blockAlign="center" wrap={false}>
                  <Image source={ShopifyBagWhite} />
                  Go to Shopify App
                </InlineStack>
              </button>
            </a>
          </BlockStack>
        </div>
      </div>
      <div
        className="flex-div"
        style={{
          height: "450px",
        }}
      >
        <div className="page-container">
          <InlineGrid columns={2} blockAlign="center">
            <BlockStack align="center" inlineAlign="center">
              <Image width={420} source={LandingPageIllustration} />
            </BlockStack>
            <BlockStack align="center" inlineAlign="start" gap="100">
              <h1 className="section-heading" style={{ color: "#0F4062" }}>
                What is Webrex
              </h1>
              <Text variant="headingXl" as="p" alignment="start" tone="subdued" fontWeight="regular">
                Webrex: Your All-in-One AI Powered SEO & Speed Optimizer. Automate meta tags, page speed, image ALT
                text, and more. Achieve SEO success and higher Google rankings. Boost visibility, attract customers
                with ease.
              </Text>
              <a href={appUrl} className="store-url" target="_blank">
                <button className="goto-app-button">
                  <InlineStack gap="100" blockAlign="center" wrap={false}>
                    <Image source={ShopifyBagWhite} />
                    Go to Shopify App
                  </InlineStack>
                </button>
              </a>
            </BlockStack>
          </InlineGrid>
        </div>
      </div>
      <div
        className="flex-div"
        style={{
          background: "#EDF8FF",
        }}
      >
        <div className="page-container" id="pricing">
          <BlockStack gap="100">
            <Text></Text>
            <Text alignment="center" variant="heading3xl" as="h3">
              Pricing
            </Text>
            <InlineGrid gap="500" columns={3}>
              {plansData.map((plan, index) => (
                <div className="pricing-card" key={index}>
                  <Card padding="400" background="bg">
                    <BlockStack gap="400">
                      <InlineStack blockAlign="center" align="space-between">
                        <Text variant="headingLg" as="h2">
                          {plan.name}
                        </Text>
                      </InlineStack>
                      <InlineStack blockAlign="center" gap="100">
                        <Text variant="heading3xl" as="h3">
                          ${plan.price}
                        </Text>
                        {plan.id != "Free" && (
                          <Text variant="headingSm" as="h6" tone="subdued">
                            /{plan.intervalLable}
                          </Text>
                        )}
                      </InlineStack>
                      <Divider></Divider>
                      <BlockStack gap="400">
                        {plan.features.map((feature, index) => (
                          <InlineStack gap="200" key={index} blockAlign="center" wrap={false}>
                            <p>{feature.text}</p>
                          </InlineStack>
                        ))}
                      </BlockStack>
                    </BlockStack>
                  </Card>
                </div>
              ))}
            </InlineGrid>
            <Text></Text>
          </BlockStack>
        </div>
      </div>
      <div
        className="flex-div"
        style={{
          height: "600px",
          // background: "#EDF8FF",
        }}
      >
        <div className="page-container">
          <InlineGrid columns={2} blockAlign="center" gap="100">
            <BlockStack align="center" inlineAlign="start" gap="100">
              <h1 className="section-heading">Our Other apps</h1>
              <Text variant="headingXl" as="p" alignment="start" tone="subdued" fontWeight="regular">
                Where can I find actionable SEO advice that gets results?, you’re in the right place. Backlinko is
                where professional marketers turn for proven SEO advice.
              </Text>
            </BlockStack>
            <InlineGrid columns={2} gap="100">
              <BlockStack align="center" inlineAlign="center" gap="100">
                <a className="logo-square" target="_blank" href="https://apps.shopify.com/linkify-app">
                  <Image source={LinkifyLogo} style={{ width: "120px", height: "120px" }} />
                  <Text fontWeight="bold" variant="headingMd">
                    Linkify
                  </Text>
                </a>
                <a
                  className="logo-square"
                  target="_blank"
                  href="https://apps.shopify.com/announcement-bar-with-slider"
                >
                  <Image source={ABLogo} style={{ width: "120px", height: "120px" }} />
                  <Text fontWeight="bold" variant="headingMd">
                    Announcement Bar
                  </Text>
                </a>
              </BlockStack>
              <BlockStack align="center" inlineAlign="center">
                <a className="logo-square" target="_blank" href="https://apps.shopify.com/currency-converter-11">
                  <Image source={CCLogo} style={{ width: "120px", height: "120px" }} />
                  <Text fontWeight="bold" variant="headingMd">
                    Currency Coverter
                  </Text>
                </a>
              </BlockStack>
            </InlineGrid>
          </InlineGrid>
        </div>
      </div>
    </BlockStack>
  );
}
