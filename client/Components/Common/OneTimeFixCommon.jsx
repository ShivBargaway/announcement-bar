import React from "react";
import { BlockStack, Card, InlineGrid, InlineStack, Link, List, Page, Text } from "@shopify/polaris";
import { t } from "i18next";
import CommonFaqSection from "@/Components/Common/CommonFaqSection";
import Congratulations from "@/Components/Common/Congratulations";
import DismissibleBanner from "@/Components/Common/DismissibleBanner";
import PurchaseOneTimePlan from "@/Components/Common/PurchaseOneTimePlan";

export default function OneTimeFixCommon({
  title,
  backbutton,
  planName,
  price,
  implementationList,
  supportList,
  faqList,
  bannerTitle,
  bannerText,
  bannerName,
  secondaryActions,
  showLoading,
  purchasePlanInfo,
  returnNavigateUrl,
  buttonHide = false,
  timelineBanner = false,
  children,
}) {
  return (
    <Page
      title={t(`common.${title}`)}
      backAction={backbutton}
      primaryAction={
        !buttonHide && (
          <PurchaseOneTimePlan
            buttonProps={{ variant: "primary", disabled: purchasePlanInfo, loading: showLoading }}
            returnNavigateUrl={returnNavigateUrl}
            price={price}
            planName={planName}
            buttonName={
              purchasePlanInfo
                ? `🎉 ${t("common.Purchased")} - $${purchasePlanInfo?.planPrice || price}`
                : `💰 ${t("common.Purchase one time")} - $${Number(price)}`
            }
          />
        )
      }
      secondaryActions={secondaryActions}
    >
      <BlockStack gap={200}>
        <DismissibleBanner
          tone="success"
          title={bannerTitle}
          bannerName={bannerName}
          skipRemove={true}
          bannerText={bannerText}
        />
        {children}

        <Card>
          <BlockStack gap={400}>
            {timelineBanner && (
              <Text>
                {t("common.Core Web Vitals optimization requires")}{" "}
                <strong> {t("common.diagnostics, code analysis, and testing")}</strong>.{" "}
                {t("common.Changes are implemented safely to maintain store performance.")} <br />⏱{" "}
                <strong>{t("common.Timeline")}</strong> : {t("common.2-3 weeks for complete optimization.")}
              </Text>
            )}
            <Text variant="headingMd"> {t("common.What's included")}</Text>
            <BlockStack gap={200}>
              <List type="bullet">
                <InlineGrid columns={{ sm: 1, md: 2 }} gap="100">
                  {implementationList?.map((item, index) => (
                    <List.Item key={index}>
                      <Text>{t(`common.${item?.label}`)}</Text>
                      <Text tone="subdued">{t(`common.${item?.description}`)}</Text>
                    </List.Item>
                  ))}
                </InlineGrid>
              </List>
            </BlockStack>
            <Text variant="headingMd"> {t("common.Support details")}</Text>
            <List type="number">
              {supportList?.map((item, index) => (
                <List.Item key={index}>
                  <InlineStack gap={100} blockAlign="center" key={index}>
                    <span>
                      <strong>{t(`common.${item?.label}`)} </strong> - {t(`common.${item?.description}`)}
                    </span>
                  </InlineStack>
                </List.Item>
              ))}
            </List>
            {!showLoading && purchasePlanInfo && (
              <Congratulations planName={planName} purchasePlanInfo={purchasePlanInfo} price={price} />
            )}
          </BlockStack>
          {!buttonHide && (
            <InlineStack align="end">
              <PurchaseOneTimePlan
                buttonProps={{ variant: "primary", disabled: purchasePlanInfo, loading: showLoading }}
                returnNavigateUrl={returnNavigateUrl}
                price={price}
                planName={planName}
                isPurchasePlan={false}
                buttonName={
                  purchasePlanInfo
                    ? `🎉 ${t("common.Purchased")} - $${price}`
                    : `💰 ${t("common.Purchase one time")} - $${Number(price)}`
                }
              />
            </InlineStack>
          )}
        </Card>
        <CommonFaqSection faqList={faqList} />
        <Text />
        <Text />
      </BlockStack>
    </Page>
  );
}
