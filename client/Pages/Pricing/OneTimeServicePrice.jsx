import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Card, Divider, IndexTable, InlineStack, Page, Text, TextField } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import PurchaseOneTimePlan from "@/Components/Common/PurchaseOneTimePlan";
import VideoTitle from "@/Components/Common/VideoTitle";
import { formatDateTime } from "@/Utils/Index";

export default function OneTimeServicePrice({ backbutton }) {
  const planName = "Webrex One time Charge";
  const [price, setPrice] = useState(0);
  const [showPriceTable, setShowPriceTable] = useState(false);
  const childRef = useRef();
  const fetch = useAuthenticatedFetch();

  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);

  const createRowsData = useCallback((rows) => {
    if (!rows || rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>
            <Text>{index + 1}</Text>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack align="center">
              <Text>{row?.planName}</Text>
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack align="center">
              <Text>${row?.planPrice}</Text>
            </InlineStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack align="center">{formatDateTime(row?.created_at)}</InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);

  const fetchPlanData = async () => {
    const res = await fetch.post("plan/getCreditInfo", { planName }, false);
    setShowPriceTable(res?.data?.rows?.length > 0 ? true : false);
  };

  useEffect(() => {
    if (getUrlParam("charge_id")) {
      setTimeout(() => fetchPlanData(), 1000);
    } else fetchPlanData();
  }, []);

  return (
    <Page
      backAction={backbutton}
      title={
        <VideoTitle
          selector={planName}
          titleLabel={
            <InlineStack gap={100} blockAlign="center">
              <Text fontWeight="bold">{t(`common.${planName}`)}</Text>
              <Text tone="subdued">({t("common.one-time charge")})</Text>
            </InlineStack>
          }
        />
      }
    >
      <BlockStack gap={200}>
        <Card>
          <BlockStack gap={200}>
            <InlineStack align="space-between" gap={200} blockAlign="center">
              <TextField
                type="number"
                label={
                  <InlineStack gap={100} blockAlign="center">
                    <Text fontWeight="bold">{t("common.Add total amount in Dollar($)")}</Text>
                  </InlineStack>
                }
                value={price}
                onChange={(e) => setPrice(e)}
                autoComplete="off"
                prefix="$"
              />
              <PurchaseOneTimePlan
                buttonProps={{ variant: "primary", disabled: price < 1, loading: false }}
                price={price}
                planName={planName}
                buttonName={`💰 ${t("common.Pay")} - $${Number(price)}`}
                returnNavigateUrl="/pricing/one-time-plan"
                hideSentry={true}
              />
            </InlineStack>
            <Text tone="subdued">
              {t(
                "common. Note: One-time charges are not billed on a recurring basis, meaning you won't be charged repeatedly for the same purchase."
              )}
            </Text>
          </BlockStack>
        </Card>
        {showPriceTable && (
          <Card padding={0}>
            <BlockStack gap={0}>
              <div style={{ padding: "1rem", paddingBottom: "0.5rem" }}>
                <Text variant="headingMd">Pricing history</Text>
              </div>
              <Divider />

              <CommonTable
                title={t(`common.credit`)}
                url={`plan/getCreditInfo`}
                rowsData={createRowsData}
                headings={[
                  { title: t("common.Index") },
                  { title: t("common.Plan Name"), alignment: "center" },
                  { title: t("common.Price"), alignment: "center" },
                  { title: t("common.Created"), alignment: "center" },
                ]}
                ref={childRef}
                isAdd={false}
                isSearchVisible={false}
                isPaginationVisible={false}
                isPaginationWithCount={false}
                selectable={false}
                fetchType={"post"}
                hideCard={true}
                queryParam={{ planName }}
                showLoading={false}
              />
            </BlockStack>
          </Card>
        )}
      </BlockStack>
    </Page>
  );
}
