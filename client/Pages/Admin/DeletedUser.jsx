import React, { useCallback, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Icon,
  IndexTable,
  InlineStack,
  Link,
  List,
  Page,
  Scrollable,
  Text,
  Tooltip,
} from "@shopify/polaris";
import { ChatIcon, ClipboardIcon, ExternalSmallIcon, QuestionCircleIcon } from "@shopify/polaris-icons";
import { formatDistanceToNow } from "date-fns";
import { getCountryCallingCode } from "libphonenumber-js";
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import ProgressCircle from "@/Components/Common/ProgressCircle";
import { ViewCommonField, extractAMPMTime } from "@/Utils/Utils";
import { getFilterField } from "../../Assets/Mocks/User.mock";

function DeletedUser({ apiRoute = `"admin/deleteduser"`, showCustomDays = false }) {
  const childRef = useRef();
  const trialRef = useRef();
  const [copied, setCopied] = useState(false);
  const [premiumTrialDays, setPremiumTrialDays] = useState({ days: 7 });
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopied(true);
  };

  const formatTimeAgo = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return "N/A";
    }
  };

  const handleIconClick = (phoneNumber, countryCode) => {
    const callingCode = getCountryCallingCode(countryCode);
    const whatsappLink = `https://wa.me/${callingCode}${phoneNumber}`;
    window.open(whatsappLink, "_blank");
  };

  const filterFormFields = useMemo(() => getFilterField(), []);

  const ArchivedData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index + 1}</IndexTable.Cell>
          <IndexTable.Cell key={row._id + 1}>
            <BlockStack gap="100">
              <Link url={`https://${row.shopUrl}`} target="_blank">
                {row.storeName}
              </Link>
              <InlineStack gap="200">
                <Text>{row?.shopUrl}</Text>
                <a style={{ cursor: "pointer" }} onClick={() => copyToClipboard(row.shopUrl)}>
                  <Icon source={ClipboardIcon} />
                </a>
              </InlineStack>

              <Text fontWeight="bold">{row?.shop_owner}</Text>

              <InlineStack gap="200">
                <Text>{row?.email}</Text>
                <a style={{ cursor: "pointer" }} onClick={() => copyToClipboard(row.email)}>
                  <Icon source={ClipboardIcon} />
                </a>
              </InlineStack>

              {!row.isOnBoardingDone && (
                <InlineStack gap="200">
                  <Text fontWeight="bold">Onboard-Step: </Text>
                  <Badge tone="warning">
                    <Text>{row.stepCount}</Text>
                  </Badge>
                </InlineStack>
              )}
              {row.themeName && (
                <InlineStack gap="200">
                  <Text fontWeight="bold">Theme Name: </Text>
                  <Badge tone="success">
                    <Text fontWeight="bold">{row.themeName}</Text>
                  </Badge>
                </InlineStack>
              )}
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap="100">
              <Link
                url={`https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${row?.storeId}`}
                target="_blank"
              >
                <InlineStack align="start" blockAlign="center">
                  <b>Open in shopify partner</b>
                  <div>
                    <Icon source={ExternalSmallIcon} />
                  </div>
                </InlineStack>
              </Link>
              {row?.associated_user?.first_name && (
                <Text fontWeight="bold">
                  {row?.associated_user?.first_name} {row?.associated_user?.last_name}
                </Text>
              )}
              {row?.associated_user?.email && (
                <InlineStack gap="200">
                  <Text>{row?.associated_user?.email}</Text>
                  <a style={{ cursor: "pointer" }} onClick={() => copyToClipboard(row.email)}>
                    <Icon source={ClipboardIcon} />
                  </a>
                </InlineStack>
              )}

              <Text fontWeight="bold">Installed : {formatTimeAgo(row?.created)}</Text>
              {row.created_at ? <Text>Created : {formatTimeAgo(row?.created_at)}</Text> : null}
              <Text fontWeight="bold">Last Login : {formatTimeAgo(row?.lastLogin)}</Text>
              {row?.associated_user && (
                <BlockStack gap={100}>
                  <Text>
                    Installed By <b>Owner</b> : {row?.associated_user?.account_owner ? "✅" : "❌"}
                  </Text>
                  <InlineStack gap={100}>
                    <Text fontWeight="bold">Associated User Info</Text>
                    <Tooltip
                      padding="400"
                      content={
                        <BlockStack>
                          <ViewCommonField user={row?.associated_user} />{" "}
                        </BlockStack>
                      }
                    >
                      <Icon source={QuestionCircleIcon} tone="info"></Icon>
                    </Tooltip>
                  </InlineStack>
                </BlockStack>
              )}

              {Array.isArray(row.lastLoginArray) && (
                <BlockStack>
                  <InlineStack gap={100}>
                    <Text fontWeight="bold">Last Login</Text>
                    <Tooltip
                      content={
                        <Scrollable style={{ maxHeight: "400px" }}>
                          <List type="number">
                            {row?.lastLoginArray?.reverse()?.map((item, index) => (
                              <List.Item key={index}>
                                <BlockStack gap={200}>
                                  <Text>
                                    {formatTimeAgo(item?.date)} - {extractAMPMTime(item?.date)}
                                  </Text>
                                  {item?.userInfo && (
                                    <Card>
                                      <InlineStack gap={200}>
                                        <ViewCommonField user={item?.userInfo} />
                                      </InlineStack>
                                    </Card>
                                  )}
                                </BlockStack>
                              </List.Item>
                            ))}
                          </List>
                        </Scrollable>
                      }
                    >
                      <Icon source={QuestionCircleIcon} tone="info"></Icon>
                    </Tooltip>
                  </InlineStack>
                  <InlineStack gap={200}>
                    {row?.lastLoginArray?.slice(0, 3)?.map((item, index) => (
                      <Text key={index}>{formatTimeAgo(item?.date)},</Text>
                    ))}
                  </InlineStack>
                </BlockStack>
              )}
              <Badge tone="warning" size="small">
                Uninstallation Time: {formatTimeAgo(row.deleted)}
              </Badge>
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap="100">
              <Text>{row?.country_name}</Text>
              <Text>Currency:{row?.currency}</Text>

              {row.phone && (
                <InlineStack gap="200">
                  <Text>{row.phone}</Text>
                  <a style={{ cursor: "pointer" }} onClick={() => handleIconClick(row.phone, row.country_code)}>
                    <Icon source={ChatIcon} />
                  </a>
                </InlineStack>
              )}

              <Text />
              <Text fontWeight="bold">App Plan : {row?.recurringPlanName}</Text>
              <Text>App Plan Id : {row?.recurringPlanId}</Text>
              <Text fontWeight="bold">Product Count : {row?.productCount}</Text>
              {row?.trial_days > 0 ? (
                <Badge tone="warning" size="small">
                  Free Trial: {row?.trial_days || 0} days
                </Badge>
              ) : (
                <Text>Free Trial: {row?.trial_days || 0} days</Text>
              )}
              <Text fontWeight="bold">Shopify Plan : {row?.plan_display_name}</Text>

              <Text>
                Onboard:
                {row.isOnBoardingDone ? <Badge tone="success">Y</Badge> : <Badge tone="warning">N</Badge>}
              </Text>
              <Text>
                shopify Payment:
                {row?.eligible_for_payments ? <Badge tone="success">Y</Badge> : <Badge tone="warning">N</Badge>}
              </Text>
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            {!isNaN(row?.idealCustomerRate) && (
              <ProgressCircle
                score={row?.idealCustomerRate}
                width="50px"
                border="4px"
                fontSize="12px"
                showLightColor={true}
                restartAnimation={false}
              />
            )}
            <Text> {row?.deleted ? formatTimeAgo(row.deleted) : ""}</Text>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);

  return (
    <Page fullWidth>
      <BlockStack gap="500">
        {showCustomDays && (
          <InlineStack blockAlign="center" gap={200}>
            <CommonForm
              onSubmit={() => childRef?.current?.fetchData()}
              formRef={trialRef}
              initialValues={premiumTrialDays}
              onFormChange={(e) => setPremiumTrialDays({ days: e?.days || 0 })}
              formFields={[
                {
                  id: "days",
                  name: "days",
                  type: "number",
                  min: 1,
                },
              ]}
              isSave={false}
            />
            <Button onClick={() => childRef?.current?.fetchData()} variant="primary">
              Add Custom Day
            </Button>
          </InlineStack>
        )}
        <CommonTable
          resourceName={{
            singular: "User",
            plural: "Users",
          }}
          title="Deleted User"
          queryPlaceholder="Search User by (shopUrl, email, storeName, recurringPlanId, recurringPlanName)"
          url={eval(apiRoute)}
          selectable={false}
          rowsData={ArchivedData}
          isFilterVisible
          headings={[
            { title: "No" },
            { title: "Name" },
            { title: "Email" },
            { title: "Plan" },
            { title: "Access" },
          ]}
          searchKey={["storeName", "shopUrl", "email", "recurringPlanId", "recurringPlanName"]}
          ref={childRef}
          isAdd={false}
          verticalAlign="center"
          columnContentTypes={["text", "text", "numeric", "numeric", "numeric", "text", "text"]}
          filterFormFields={filterFormFields}
          pinnedFilter={[
            "recurringPlanType",
            "recurringPlanName",
            "plan_display_name",
            "lastLogin",
            "productCount",
            "Installed By owner",
            "plan_name",
            "Check Feature Data Wise",
            "Check Feature Status Wise",
            "idealCustomerRate",
          ]}
          queryParam={{ shopUrl: getUrlParam("shopUrl") }}
        />
      </BlockStack>
    </Page>
  );
}

export default DeletedUser;
