import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Modal,
  Page,
  Scrollable,
  Text,
  Tooltip,
} from "@shopify/polaris";
import {
  ChatIcon,
  ClipboardIcon,
  EditIcon,
  QuestionCircleIcon,
  StarFilledIcon,
  ViewIcon,
} from "@shopify/polaris-icons";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { getCountryCallingCode } from "libphonenumber-js";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { activePlanformFields, activePlaninitialValues } from "@/Assets/Mocks/ActivePlan.mock";
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import ProgressCircle from "@/Components/Common/ProgressCircle";
import TruncatedText from "@/Components/Common/TruncatedText";
import { getLocalStorageItem } from "@/Utils/Index";
import { ViewCommonField, extractAMPMTime } from "@/Utils/Utils";
import { getFilterField } from "../../Assets/Mocks/User.mock";
import SyncMetaField from "./SyncMetaField";
import UpdateUserButton from "./UpdateUserButton";

function User({ apiRoute = `"admin/user"`, showCustomDays = false }) {
  const navigate = useNavigate();
  const childRef = useRef();
  const fetch = useAuthenticatedFetch();
  const activePlanFormRef = useRef();
  const trialRef = useRef();
  const [removePlan, setRemovePlan] = useState(false);
  const [activePlan, setActivePlan] = useState(false);
  const [data, setData] = useState();
  const [copied, setCopied] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [formType, setFormType] = useState();
  const [currentUser, setCurrentUser] = useState();
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState();
  const [premiumTrialDays, setPremiumTrialDays] = useState({ days: 7 });
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const getUrlParam = (param) => urlParams.get(param);

  const getTrialDays = (profileData) => {
    const trialDays = profileData?.trial_days;
    const trialStart = new Date(profileData?.trial_start || new Date()); // Trial start date
    const now = new Date();
    const trialEnd = new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
    const diffMs = trialEnd - now;
    const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return profileData?.recurringPlanId?.includes(100) ? 0 : remainingDays > 0 ? remainingDays : 0;
  };

  const renewalDays = (row) => {
    if (row?.nextRenewalDate) return differenceInDays(new Date(row?.nextRenewalDate), new Date());

    const userPayDate = new Date(row?.trial_start);

    if (isNaN(userPayDate)) {
      // Handle the case where userPayDate is not a valid Date
      return 0;
    }
    const trialDays = row?.trial_days || 0;
    const mode = row?.recurringPlanId?.includes("Yearly") ? 365 : 30;
    const remaningdays = Math.floor((new Date() - userPayDate) / (1000 * 60 * 60 * 24)) - trialDays;
    const remainingDaysMod30 = remaningdays % mode;
    const remainingDaysMod30Minus30 = mode - remainingDaysMod30;

    return remainingDaysMod30Minus30;
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    setCopied(true);
  };

  const handleButtonClick = async (row) => {
    setReviewData(row?.reviewRequest?.reviewMeta);
    setOpenReviewModal(true);
  };

  const formatTimeAgo = (dateString) => {
    if (dateString) {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return "N/A";
    }
  };

  useEffect(() => {
    const accessToken = getLocalStorageItem("adminPanelAccessToken");
    if (!accessToken) {
      navigate("/admin/login");
    }
  }, []);

  const handleIconClick = (phoneNumber, countryCode) => {
    const callingCode = getCountryCallingCode(countryCode);
    const whatsappLink = `https://wa.me/${callingCode}${phoneNumber}`;
    window.open(whatsappLink, "_blank");
  };

  const openpopup = useCallback((row) => {
    setData(row);
    setRemovePlan(true);
  });

  const openActivePlan = useCallback((row) => {
    setData(row);
    setActivePlan(true);
  });

  const ActivePlanhandleSubmit = useCallback(
    async (value) => {
      const response = await fetch.put(`admin/addPlan`, { ...value, shopUrl: data.shopUrl });
      setActivePlan(false);
      childRef.current.fetchData();
    },
    [data]
  );

  const handleRemovePlan = useCallback(async () => {
    setData(data);
    await fetch.put(`admin/removePlan`, { ...data });
    setRemovePlan(false);
    childRef.current.fetchData();
  });
  const activePlansubmitForm = useCallback(() => {
    if (activePlanFormRef.current) {
      activePlanFormRef.current.handleSubmit();
    }
  }, []);

  const handleAccess = useCallback(async (row) => {
    const apiResult = await fetch.get(`admin/access_token?shopUrl=${row.shopUrl}`);
    const url = `${process.env.SHOPIFY_APP_URL}/?token=${apiResult.data.token}`;
    window.open(url, "_blank");
  }, []);

  const handleUpdateUser = useCallback(async (row, form) => {
    setOpenModel(true);
    setFormType(form);
    setCurrentUser(row);
  }, []);

  const handleClose = useCallback(() => setRemovePlan(!removePlan), [removePlan]);
  const handleCloseActivePlan = useCallback(() => setActivePlan(!activePlan), [activePlan]);
  const handleCloseReviewModal = useCallback(() => setOpenReviewModal(!openReviewModal), [openReviewModal]);

  const filterFormFields = useMemo(() => getFilterField(), []);

  const ArchivedData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      const storeUrl = row?.shopUrl?.split(".myshopify.com")[0];
      const onetimePaymentLink = `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/pricing/one-time-plan`;

      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index + 1}</IndexTable.Cell>
          <IndexTable.Cell key={row._id + 1}>
            <BlockStack gap="100">
              <Link url={`https://${row.shopUrl}`} target="_blank">
                <TruncatedText text={row?.storeName} maxLength={45} />
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

              <Badge tone="warning" size="small">
                <Text>created bars :{row.created_bars ? row.created_bars : 0}</Text>
              </Badge>

              {Array.isArray(row?.feedback) &&
                row?.feedback.map((item, index) => (
                  <b key={index}>
                    {item?.label || item?.id} - {item.index + 1}
                  </b>
                ))}

              <InlineStack gap="100">
                <Text>One time payment link -</Text>
                <a style={{ cursor: "pointer" }} onClick={() => copyToClipboard(onetimePaymentLink)}>
                  <Icon source={ClipboardIcon} />
                </a>
              </InlineStack>

              {/* <BlockStack gap="100">
                {Array.isArray(row?.markets) && (
                  <Tooltip
                    content={
                      <BlockStack>
                        {row?.markets?.map((item, index) => (
                          <b key={index}>
                            {item.name} : {item.country}
                          </b>
                        ))}
                      </BlockStack>
                    }
                  >
                    <Text variant="bold"> Total Markets : {row?.markets?.length}</Text>
                  </Tooltip>
                )}
              </BlockStack> */}
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap="100">
              {!isNaN(row?.idealCustomerRate) && (
                <InlineStack gap={100} align="start" blockAlign="center">
                  ICP -
                  <ProgressCircle
                    score={row?.idealCustomerRate}
                    width="50px"
                    border="4px"
                    fontSize="12px"
                    showLightColor={true}
                    restartAnimation={false}
                  />
                </InlineStack>
              )}
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
              <Text fontWeight="bold">renewal : {renewalDays(row)} days</Text>
              {row.trial_start ? <Text>Premium : {formatTimeAgo(row.trial_start)}</Text> : null}
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
              <Text fontWeight="bold">App Plan : {row?.recurringPlanName}</Text>
              <Text>App Plan Id : {row?.recurringPlanId}</Text>
              <Text fontWeight="bold">Product Count : {row?.productCount}</Text>

              {getTrialDays(row) > 0 ? (
                <Badge tone="warning" size="small">
                  Free Trial: {getTrialDays(row)} days
                </Badge>
              ) : (
                <Text>Free Trial: {getTrialDays(row)} days</Text>
              )}
              {row?.lastActivePlan && (
                <>
                  <Badge tone="info" size="small">
                    Last Active Plan: {row?.lastActivePlan}
                  </Badge>
                  <Badge tone="success" size="small">
                    Plan Cancel Date: {formatTimeAgo(row.planCancelDate)}
                  </Badge>
                </>
              )}

              <Text fontWeight="bold">Shopify Plan : {row?.plan_display_name}</Text>

              <Text>
                Onboard:
                {row.isOnBoardingDone ? <Badge tone="success">Y</Badge> : <Badge tone="warning">N</Badge>}
              </Text>

              <Text>
                Shopify Payments:
                {row.eligible_for_payments ? (
                  <Badge tone="success">Y</Badge>
                ) : row.eligible_for_payments == false ? (
                  <Badge tone="warning">N</Badge>
                ) : (
                  <> - </>
                )}
              </Text>
              {row?.offerTrialDays > 0 && (
                <Badge tone="attention" size="small">
                  Offer Trial days: {row?.offerTrialDays} days
                </Badge>
              )}
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap="200">
              <Link
                url={`https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${row?.storeId}`}
                target="_blank"
              >
                <InlineStack align="start" blockAlign="center">
                  <b>Open in shopify partner</b>
                </InlineStack>
              </Link>
              <Button onClick={() => handleAccess(row)}>Access</Button>
              <Button variant="primary" onClick={() => handleUpdateUser(row, "update")} icon={EditIcon}>
                <Text variant="bodyMd">Update</Text>
              </Button>
              <SyncMetaField row={row} />
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <BlockStack gap={200} inlineAlign="center">
              <div>
                <Tooltip
                  content={
                    <InlineStack gap="200">
                      {!row.reviewRequest?.isReviewPosted ? "Not reviewed" : "Open Review"}
                    </InlineStack>
                  }
                >
                  <Button
                    variant="primary"
                    tone={!row.reviewRequest?.isReviewPosted ? "critical" : "success"}
                    onClick={() => (row.reviewRequest?.isReviewPosted ? handleButtonClick(row) : null)}
                  >
                    R
                  </Button>
                </Tooltip>
              </div>

              {row.recurringPlanName === "Free" ? (
                <div>
                  <Tooltip content={<InlineStack gap="200">Active Plan</InlineStack>}>
                    <Button variant="primary" onClick={() => openActivePlan(row)}>
                      P
                    </Button>
                  </Tooltip>
                </div>
              ) : (
                <div>
                  <Tooltip content={<InlineStack gap="200">Remove Plan</InlineStack>}>
                    <Button tone="critical" onClick={() => openpopup(row)}>
                      P
                    </Button>
                  </Tooltip>
                </div>
              )}
              <Button variant="primary" onClick={() => handleUpdateUser(row, "view")} icon={ViewIcon} />
            </BlockStack>
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
          title="User"
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
            { title: "Actions" },
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
        <Modal
          open={removePlan}
          title="Are you sure you want to remove plan for this user?"
          onClose={handleClose}
          primaryAction={{
            content: "Yes",
            onAction: handleRemovePlan,
          }}
          secondaryActions={[
            {
              content: "No",
              onAction: handleClose,
            },
          ]}
          size="small"
        ></Modal>
        <Modal
          open={activePlan}
          title="Are you sure you want to Active plan for this user?"
          onClose={handleCloseActivePlan}
          primaryAction={{
            content: "Active Plan",
            onAction: activePlansubmitForm,
          }}
          size="small"
        >
          <Modal.Section>
            <CommonForm
              onSubmit={ActivePlanhandleSubmit}
              formRef={activePlanFormRef}
              initialValues={activePlaninitialValues}
              formFields={activePlanformFields}
              title="Active Plan"
              isSave={false}
            />
          </Modal.Section>
        </Modal>
      </BlockStack>
      {openModel && (
        <UpdateUserButton
          currentUser={currentUser}
          formType={formType}
          openModel={openModel}
          setOpenModel={setOpenModel}
          childRef={childRef}
        />
      )}
      {openReviewModal && (
        <Modal
          open={openReviewModal}
          onClose={handleCloseReviewModal}
          title={`${reviewData?.storeName}'s review details`}
        >
          <Modal.Section>
            <BlockStack gap="200">
              <InlineStack wrap={false} gap="400" columns="2">
                <div style={{ width: "110px" }}>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Review
                  </Text>
                </div>
                <div style={{ width: "calc(100% - 110px)" }}>
                  <Text as="p" variant="bodyMd">
                    {reviewData?.review}
                  </Text>
                </div>
              </InlineStack>
              <InlineStack wrap={false} gap="400" columns="2">
                <div style={{ width: "110px" }}>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Rating
                  </Text>
                </div>
                <div style={{ width: "calc(100% - 110px)" }}>
                  <InlineStack align="start">
                    {Array.from({ length: reviewData?.rating }, (_, index) => (
                      <div key={index} style={{ width: "20px", height: "20px" }}>
                        <Icon source={StarFilledIcon} tone="success" />
                      </div>
                    ))}
                    {Array.from({ length: 5 - reviewData?.rating }, (_, index) => (
                      <div key={index} style={{ width: "20px", height: "20px" }}>
                        <Icon key={index} source={StarFilledIcon} tone="secondary" />
                      </div>
                    ))}
                  </InlineStack>
                </div>
              </InlineStack>

              <InlineStack wrap={false} gap="400" columns="2">
                <div style={{ width: "110px" }}>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Date
                  </Text>
                </div>
                <div style={{ width: "calc(100% - 110px)" }}>
                  <Text as="p" variant="bodyMd">
                    {reviewData?.date}
                  </Text>
                </div>
              </InlineStack>
              <InlineStack wrap={false} gap="400" columns="2">
                <div style={{ width: "110px" }}>
                  <Text as="p" variant="bodyMd" fontWeight="bold">
                    Reviewed After
                  </Text>
                </div>
                <div style={{ width: "calc(100% - 110px)" }}>
                  <Text as="p" variant="bodyMd">
                    {reviewData?.reviewedAfter}
                  </Text>
                </div>
              </InlineStack>
            </BlockStack>
          </Modal.Section>
        </Modal>
      )}
    </Page>
  );
}

export default User;
