import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Modal,
  Page,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { ChevronDownIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { customSEOPlanList, shopifyCROplanList } from "@/Assets/Mocks/CustomSEO.mock";
import { CommonIcon } from "@/Components/Common/CommonIcon";
import ContactSupport from "@/Components/Common/ContactSupport";
import { ProfileContext } from "@/Context/ProfileContext";
import { removeBasePriceURL, slackChannelMsg } from "@/Utils/Index";
import TenHoursFree from "./TenHoursFree";

export default function CustomPlanModal({ backbutton }) {
  const fetch = useAuthenticatedFetch();
  const { profileData } = useContext(ProfileContext);
  const { type } = useParams();
  const [activeModal, setActiveModal] = useState(false);
  const [customType, seCustomType] = useState(type);
  const [selectedItem, setSelectedItem] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [purchasedPlans, setPurchasedPlans] = useState({});

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);
  const list = type === "theme" ? shopifyCROplanList() : customSEOPlanList();
  const commonPlanName = type === "theme" ? "Store Customization Plan" : "Custom SEO Service Plan";

  const fetchPlanData = async () => {
    setShowLoading(true);
    const res = await fetch.get("plan");
    const purchasedList = res?.data?.purchaseCreditChargeInfo || [];
    const planMap = purchasedList.reduce((acc, plan) => {
      if (plan?.planName) {
        acc[plan.planName] = plan;
      }
      return acc;
    }, {});
    setPurchasedPlans(planMap);
    setShowLoading(false);
  };

  const acceptPlan = useCallback(
    async (charge_id) => {
      await fetch.post("activeOneTimeCharge", { charge_id, planName: commonPlanName });
    },
    [profileData]
  );

  useEffect(() => {
    if (getUrlParam("charge_id")) {
      setTimeout(() => fetchPlanData(), 1000);
    } else fetchPlanData();
  }, [profileData]);

  useEffect(() => {
    const charge_id = getUrlParam("charge_id");
    if (charge_id) acceptPlan(charge_id);
  }, []);

  const handleReadMore = (item) => {
    setSelectedItem(item);
    setActiveModal(true);
  };

  const submitOneTimePlan = useCallback(
    async (planName, price) => {
      setShowLoading(true);
      const { shopUrl, email } = profileData;
      const title = `${planName} Click Focus On Him`;
      const message = slackChannelMsg(title, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);

      const storeUrl = shopUrl.split(".myshopify.com")[0];
      const newPlan = {
        name: planName,
        price,
        return_url: `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/pricing/custom-plan/${customType}`,
        test: email?.includes("webrexstudio.com"),
      };

      const response = await fetch.post("plan/oneTimePurchase", newPlan);
      const confirmationUrl = response.data?.["appPurchaseOneTimeCreate"].confirmationUrl;
      if (confirmationUrl) {
        const redirectUrl = confirmationUrl.includes("admin.shopify.com")
          ? removeBasePriceURL(confirmationUrl)
          : confirmationUrl;
        open(redirectUrl, "_top");
      }
    },
    [profileData]
  );

  const title =
    type === "theme"
      ? t("common.Budget-friendly store customization")
      : t("common.Scale your SEO with flexible plans");

  return (
    <Page title={title} backAction={backbutton} padding="0">
      <BlockStack gap={400}>
        <TenHoursFree profileData={profileData} type={customType}></TenHoursFree>
        <Card>
          <BlockStack gap="400">
            <BlockStack gap="200" align="center">
              <Text as="h2" variant="headingLg" alignment="center">
                🎯{" "}
                {type === "seo"
                  ? t("common.Choose your custom SEO package")
                  : t("common.Choose your store customization plan")}
              </Text>
              <Text as="p" variant="bodyMd" tone="subdued" alignment="center">
                We’ll handle the rest — just pick what fits your store’s needs.
              </Text>
              <Divider />
            </BlockStack>

            <InlineGrid columns={{ sm: 1, md: 2 }} gap="300">
              {list.map((item, index) => {
                const purchased = purchasedPlans[item?.planName];
                const message = `Hello Webrex Team, I'm interested in the ${item?.title} plan. can you please tell me what is next process?`;
                return (
                  <Card key={index} padding="400">
                    <BlockStack gap="400">
                      <InlineStack blockAlign="center" gap="200">
                        <CommonIcon data={item} size="28" />
                        <Text variant="headingMd"> {t(`common.${item?.title}`)}</Text>
                        {item?.time && (
                          <Badge tone={item?.badgeColor || item?.color} size="small">
                            {t(`common.${item?.time}`)} {t(`common.delivery`)}
                          </Badge>
                        )}
                      </InlineStack>

                      <BlockStack>
                        <Text variant="bodyMd">{t(`common.${item?.smallDescription}`)}</Text>
                        {item?.impact && (
                          <Text variant="bodyMd" tone="success">
                            <strong> Benefit: {t(`common.${item?.impact}`)}</strong>
                          </Text>
                        )}
                      </BlockStack>

                      <InlineStack gap={200} align="end">
                        <ButtonGroup>
                          <Button onClick={() => handleReadMore(item)} icon={ChevronDownIcon}>
                            {t("common.View details")}
                          </Button>
                          <ContactSupport msg={message} buttonProps={{ variant: "primary", tone: "success" }} />
                          {/* {!item?.price ? (
                            <ContactSupport
                              msg={message}
                              buttonName={item?.buttonName}
                              buttonProps={{ variant: "primary", tone: "accent" }}
                            />
                          ) : purchased ? (
                            <Tooltip content={`🎉 You’ve already purchased this plan: $${purchased?.planPrice}`}>
                              <Button onClick={() => {}} variant="primary" disabled tone="success">
                                🎉 {t("common.Purchased")} - ${item?.price}
                              </Button>
                            </Tooltip>
                          ) : (
                            <Tooltip content="Fixed-price plan — no hourly billing.">
                              <Button
                                onClick={() => submitOneTimePlan(item?.planName, item?.price)}
                                variant="primary"
                                tone="accent"
                                disabled={showLoading}
                              >
                                {`${t("common.Purchase plan")} - $${Number(item?.price)}`}
                              </Button>
                            </Tooltip>
                          )} */}
                        </ButtonGroup>
                      </InlineStack>
                    </BlockStack>
                  </Card>
                );
              })}
            </InlineGrid>
          </BlockStack>
        </Card>
        <Text></Text>
      </BlockStack>
      <Modal
        size="large"
        open={activeModal}
        onClose={() => setActiveModal(false)}
        title={t(`common.${selectedItem?.title}`)}
        primaryAction={
          selectedItem?.price
            ? purchasedPlans[selectedItem?.planName]
              ? {
                  content: `🎉 ${t("common.Purchased")} - $${purchasedPlans[selectedItem?.planName]?.planPrice}`,
                  onAction: () => {},
                  disabled: true,
                }
              : {
                  content: `${t("common.Purchase plan")} - $${Number(selectedItem?.price)}`,
                  onAction: () => submitOneTimePlan(selectedItem?.planName, selectedItem?.price),
                }
            : null
        }
        secondaryActions={{
          content: t("common.Close"),
          onAction: () => setActiveModal(false),
        }}
      >
        <Modal.Section>
          <BlockStack gap={400}>
            {selectedItem?.bigDescription && <Card>{selectedItem?.bigDescription}</Card>}
            {type === "cro" && (
              <Card>
                <BlockStack gap={200}>
                  <Text variant="bodyLg">
                    <strong> Performance Goal : </strong> {selectedItem?.smallDescription}
                  </Text>
                  <Text variant="bodyLg" tone="success" underline>
                    <strong> Expected Results : {t(`common.${selectedItem?.impact}`)}</strong>
                  </Text>
                </BlockStack>
              </Card>
            )}
            <Card>{selectedItem?.fullDescription}</Card>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
