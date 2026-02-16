import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Badge,
  Banner,
  BlockStack,
  Box,
  Button,
  ButtonGroup,
  InlineGrid,
  InlineStack,
  Modal,
  Page,
  Text,
} from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import {
  cancelReasonInitialValues,
  featureList,
  formFieldsCancelReason,
  getPlansData,
  initialValues,
  interval,
} from "@/Assets/Mocks/CommonPricing.mock";
import CommonForm from "@/Components/Common/CommonForm";
import CommonSkeletonPage from "@/Components/Common/CommonSkeletonPage";
import DismissibleBanner from "@/Components/Common/DismissibleBanner.jsx";
import { navigate } from "@/Components/Common/NavigationMenu";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";
import { isAdmin, removeBasePriceURL, slackChannelMsg } from "@/Utils/Index";
import { dateWisePersent, dateWisePriceBanner, dateWisePriceObj } from "../../Assets/Mocks/CommonPricing.mock";
import FreeAppPromotion from "../../Components/Common/FreeAppPromotion";
import FreePlan from "./FreePlan";
import Premium100Plan from "./Premium100Plan";
import SinglePlan from "./SinglePlan";

export default function Pricing({ config, onAcceptPlan, hasBillingButton, title, backbutton }) {
  const [formValues, setFormValues] = useState(initialValues);
  const [cancelReasonValues, seCancelReasonValues] = useState(cancelReasonInitialValues);
  const [isStatusActive, setStatusActive] = useState(true);
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  const [selectedPlan, setSelectedPlan] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urlPromoCode, setUrlPromoCode] = useState(false);

  const [syncPlanButton, setSyncPlanButton] = useState(false);
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(false);
  const [isReasonPopup, setIsReasonPopup] = useState(false);
  const [showDateWisePrice, setShowDateWisePrice] = useState(false);
  const [userCreated, setUserCreated] = useState(new Date());
  const [countDownString, setCountDownString] = useState("");
  const [minuteTrialText, setMinuteTrialText] = useState();
  const [trialDays, setTrialDays] = useState();
  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const formRef = useRef();
  const urlParams = new URLSearchParams(location.search);
  const reviewLink = `${process.env.SHOPIFY_STORE_APP_URL}#modal-show=ReviewListingModal`;

  const plansData = useMemo(() => getPlansData(selectedPlan), [selectedPlan]);
  const [pricingData, setPricingData] = useState(plansData);

  const setNavigate = navigate();

  // Moved the repeated logic into a separate function
  const getUrlParam = (param) => urlParams.get(param);

  const closeReasonPopup = useCallback(() => {
    setIsReasonPopup(false);
  }, []);

  const cancelPlan = useCallback(async () => {
    setIsReasonPopup(true);
  }, [selectedPlan, isReasonPopup]);

  const submitForm = useCallback((e) => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  const getPriceShopifyPlanWise = (userData, hour, discount) => {
    const shopifyAdvancePlan = ["Shopify Plus", "Advanced", "Advanced Shopify", "Grow", "Shopify"];
    const mainPrice = shopifyAdvancePlan?.includes(userData?.plan_display_name) ? 15 : 10;
    const orgPrice = mainPrice * hour;
    return { price: orgPrice * (1 - discount / 100), hour: `${hour}H`, orgPrice, discount };
  };

  const openSEOPlan = useCallback(
    async (type) => {
      const message = slackChannelMsg(`${type} Click`, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
      setNavigate("/pricing/custom-plan/seo");
    },
    [profileData]
  );

  const openSupportChatBox = useCallback(
    async (type) => {
      const title =
        type === "header"
          ? "Store customization from pricing header"
          : "Store customization know more button from feature";
      const message = slackChannelMsg(`${title} Click`, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
      setNavigate("/pricing/custom-plan/theme");
    },
    [profileData]
  );

  const cancelReccuringPlan = useCallback(
    async (value) => {
      if (value.cancelReason.reason === "") {
        showToast(t(`common.Please Select One Option`));
      } else {
        setIsReasonPopup(false);
        let trial_days = profileData?.trial_days || profileData?.trial_days == 0 ? trialDays : 7;
        let data = {
          plan: selectedPlan,
          trial_days: trial_days,
          cancelReason: {
            reason: value?.cancelReason?.reason,
            value: value?.cancelReason?.value,
          },
        };
        const res = await fetch.post("plan/cancel", JSON.stringify(data));
        showToast(t(`common.Plan cancelled successfully`));
        updateProfileData(res?.data);
        fetchPlanData();
        setStatusActive(true);
        if (hasBillingButton) {
          setIsFirstButtonActive(false);
        }
      }
    },
    [selectedPlan, isReasonPopup, profileData, trialDays]
  );

  const getTrialDays = () => {
    const trialDays = profileData?.trial_days;
    const trialStart = new Date(profileData?.trial_start || new Date()); // Trial start date
    const now = new Date();
    const trialEnd = new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
    const diffMs = trialEnd - now;
    const remainingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return profileData?.recurringPlanId?.includes(100) ? 0 : remainingDays > 0 ? remainingDays : 0;
  };

  const upgradePlan = useCallback(
    async (plan) => {
      const { shopUrl, email } = profileData;
      const storeUrl = shopUrl.split(".myshopify.com")[0];
      const { discounts, features, ...rest } = plan;
      const planPrice = plan?.monthlyPrice ? plan.monthlyPrice : plan.price;
      const originalPrice = plan?.price;

      const newPlan = {
        ...rest,
        trial_days: profileData?.trial_days || profileData?.trial_days == 0 ? trialDays : plan?.trial?.days || 0,
        return_url: `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/pricing?finalPrice=${plan.finalPrice}&&code=${plan["discountValue"]}&&discountRate=${plan["discountLabel"]}&&interval=${plan.discountObject?.interval}&&id=${plan.id}&&planPrice=${planPrice}&&originalPrice=${originalPrice}`,
        test: email?.includes("webrexstudio.com"),
      };

      const response = await fetch.post("plan", newPlan);
      const type = plan.is_recurring ? "appSubscriptionCreate" : "appPurchaseOneTimeCreate";
      const confirmationUrl = response.data?.[type].confirmationUrl;

      if (onAcceptPlan) onAcceptPlan();

      if (confirmationUrl) {
        const redirectUrl = confirmationUrl.includes("admin.shopify.com")
          ? removeBasePriceURL(confirmationUrl)
          : confirmationUrl;

        updateProfileData({ ...profileData, planAttemptTime: new Date() });
        open(redirectUrl, "_top");
      }
    },
    [profileData, trialDays]
  );

  const checkPromoCodeValidity = (plan, promoCodes, price) => {
    const { initialDiscountObject, initialDiscountPrice, discountPercent } = plan;
    plan.discountLabel = discountPercent ? discountPercent + "%" : null;
    plan.discountValue = null;
    plan.discountPercent = discountPercent || null;
    plan.discountObject = initialDiscountObject || null;
    let finalPrice = initialDiscountPrice || price;
    if (promoCodes) {
      let codes = promoCodes.split(",");
      for (let code of codes) {
        if (plan.discounts?.length > 0) {
          let findCode = plan.discounts.find((e) => e.code.toLowerCase() === code.toLowerCase());
          if (findCode) {
            const { type, value } = findCode;

            let discount = type === "amount" ? value : (value * price) / 100;
            finalPrice = Math.floor((price - discount) * 100) / 100;

            plan.discountLabel = `${value}${type === "amount" ? "$" : "%"}`;
            plan.discountObject = findCode;
            plan.discountValue = findCode.code;
            plan.discountPercent = value;
            setPromoCode(code);
          }
        }
      }
    }
    return finalPrice;
  };

  const submitPromocode = useCallback(
    async (plan) => {
      try {
        setStatusActive(false);
        plan.touched = true;
        const code = formRef.current.values.promocode;
        if (code) {
          plan.finalPrice = checkPromoCodeValidity(plan, code, plan.monthlyPrice ? plan.monthlyPrice : plan.price);
          formRef.current.values.promocode = "";
          setFormValues((prevFormValues) => ({
            ...prevFormValues,
            promocode: code,
          }));
          if (plan.discountLabel) {
            const data = pricingData.map((e) => {
              if (e.name === plan.name) {
                return plan;
              } else if (e.selected === true) {
                return e;
              } else {
                e.touched = false;
                e.finalPrice = checkPromoCodeValidity(e, " ", e.monthlyPrice ? e.monthlyPrice : e.price);
                return e;
              }
            });
            setPricingData(data);
            setTrialDays(getTrialDays());
          }
        } else if (plan.discountLabel) {
          plan.touched = true;
        } else {
          plan.touched = false;
          setFormValues({ initialValues });
        }
      } catch (err) {
        console.error(err);
      }
    },
    [pricingData]
  );

  const fetchPlanData = useCallback(async () => {
    const res = await fetch.get("plan");
    if (res?.data) {
      setSelectedPlan(res.data);
      if (hasBillingButton && res.data?.billingInterval === "Month" && res.data.id !== "Free") {
        setIsFirstButtonActive(true);
      }
    }
  }, []);

  const activatePlan = useCallback(async () => {
    const params = [
      "finalPrice",
      "code",
      "charge_id",
      "discountRate",
      "interval",
      "id",
      "planPrice",
      "originalPrice",
    ];
    const data = params.reduce((obj, param) => {
      const value = getUrlParam(param);
      obj[param] = value === "null" ? null : value;
      return obj;
    }, {});
    pricingData.find((plan) => {
      if (data.id === plan.id) {
        data["recurring"] = plan?.is_recurring;
        data["intervalLable"] = plan?.intervalLable;
        data["name"] = plan.name;
        data["billingInterval"] = plan.billingInterval;
      }
    });

    const res = await fetch.post("plan/active", data);
    updateProfileData(res?.data);

    fetchPlanData();
  }, []);

  useEffect(() => {
    let flag = false;
    if (profileData && selectedPlan && isStatusActive) {
      const data = plansData?.map((plan) => {
        if (plan.id === selectedPlan.id) {
          plan["selected"] = true;
          plan["discountValue"] = selectedPlan.code;
          plan["intervalLable"] =
            selectedPlan.intervalLable && plan.id !== "Free" ? selectedPlan.intervalLable : plan.intervalLable;
          flag = true;
          plan["finalPrice"] = selectedPlan?.discountedPrice
            ? selectedPlan.discountedPrice
            : selectedPlan.planPrice;
          plan["price"] = selectedPlan?.originalPrice ? selectedPlan.originalPrice : selectedPlan.planPrice;
          if (selectedPlan.billingInterval === "Year" && selectedPlan.intervalLable === "Month") {
            plan["monthlyPrice"] = selectedPlan.planPrice;
          } else {
            plan["monthlyPrice"] = "";
          }
          if (selectedPlan?.discountValue && selectedPlan?.discountValue !== "undefined") {
            plan["discountLabel"] = selectedPlan.discountValue;
            plan["discountPercent"] = parseInt(selectedPlan.discountValue.match(/\d+/)[0], 10);
            const interval = selectedPlan?.interval > 0 ? { interval: selectedPlan?.interval } : {};
            plan["discountObject"] = {
              name: "Promotional",
              code: selectedPlan.code,
              type: "percentage",
              value: parseInt(selectedPlan.discountValue.match(/\d+/)[0], 10),
              ...interval,
            };
          }
          if (!selectedPlan?.discountValue && plan?.initialDiscountObject) {
            plan["discountPercent"] = plan?.initialDiscountObject?.value || 0;
            plan["discountObject"] = { ...plan?.initialDiscountObject };
          }
        } else {
          if (selectedPlan.billingInterval === "Year" && plan.billingInterval !== "Year") {
            plan["disableActiveButton"] = true;
          }
          if (showDateWisePrice) {
            plan = { ...plan, ...dateWisePriceObj(userCreated, plan) };
            if (plan.billingInterval !== "Year") plan["isPromoInputHidden"] = true;
          }
          plan["selected"] = false;
          plan["finalPrice"] = checkPromoCodeValidity(
            plan,
            promoCode,
            plan.monthlyPrice ? plan.monthlyPrice : plan.price
          );
        }
        return plan;
      });
      if (!flag) {
        let feature = featureList[selectedPlan.id] ? featureList[selectedPlan.id] : featureList["Default-feature"];
        let plan = {
          type: selectedPlan.is_recurring ? "recurring" : "onetime",
          is_recurring: selectedPlan.is_recurring,
          intervalLable: selectedPlan.intervalLable,
          interval: interval[selectedPlan.id || "Default"],
          id: selectedPlan.id,
          name: selectedPlan.planName,
          isHidden: selectedPlan.billingInterval === "Year" ? "isFirstButtonActive" : "!isFirstButtonActive",
          price: selectedPlan.originalPrice ? selectedPlan.originalPrice : selectedPlan.planPrice,
          features: [...feature],
          trial: {
            days: trialDays,
          },
          selected: true,
          finalPrice: selectedPlan?.discountedPrice ? selectedPlan.discountedPrice : selectedPlan.planPrice,
          discountLabel: selectedPlan?.discountValue,
          discountValue: selectedPlan?.code,
        };
        if (selectedPlan.billingInterval === "Year" && selectedPlan.intervalLable === "Month") {
          plan["monthlyPrice"] = selectedPlan.planPrice;
        }
        data.push(plan);
      }
      setPricingData(data);
      setTrialDays(getTrialDays());
    }
  }, [profileData, selectedPlan]);

  const handleUrlParams = useCallback(() => {
    const chargeId = getUrlParam("charge_id");
    const code = getUrlParam("promocode");

    if (code) {
      setPromoCode(code);
      setUrlPromoCode(true);
    }

    if (chargeId) {
      setSelectedPlan(false);
      activatePlan();
    } else {
      fetchPlanData();
    }
  }, []);

  const activeSyncPlan = useCallback(async () => {
    const res = await fetch.post("activeSyncPlan");
    updateProfileData(res?.data);
    fetchPlanData();
    setStatusActive(true);
  }, [selectedPlan]);

  const syncPlan = useCallback(() => {
    let adminStatus = isAdmin();
    setSyncPlanButton(adminStatus);
  }, [syncPlanButton]);

  const priceSegmentedButton = useCallback((status) => {
    setIsFirstButtonActive(status);
  }, []);

  useEffect(() => {
    handleUrlParams();
    syncPlan();
  }, []);

  function minTwoDigits(n) {
    return String(n).padStart(2, "0");
  }

  useEffect(() => {
    let interval;
    if (profileData) {
      const newDate = new Date();
      const profileDate = new Date(profileData?.discountAppliedDate || new Date());
      profileDate.setDate(profileDate.getDate() + 2);
      const countDownDate = profileDate - newDate;
      const daysDifference = countDownDate / (1000 * 60 * 60 * 24);
      if (daysDifference > 0) {
        interval = setInterval(() => {
          const newDate = new Date();
          const countDownDate = profileDate - newDate;
          const hoursDifference = countDownDate / (1000 * 60 * 60);
          if (hoursDifference <= 48 && hoursDifference > 0) {
            const hours = minTwoDigits(Math.floor(hoursDifference));
            const minutes = minTwoDigits(Math.floor((countDownDate / 1000 / 60) % 60));
            const seconds = minTwoDigits(Math.floor((countDownDate / 1000) % 60));
            setCountDownString(
              `${t(`common.This offer expire in`)} ${hours}:${minutes}:${seconds} ${t(`common.Hurry Up!`)}`
            );
          } else {
            fetchPlanData();
            setShowDateWisePrice(false);
            clearInterval(interval);
          }
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [profileData]);

  useEffect(() => {
    let interval;

    if (profileData) {
      const trialDays = profileData?.trial_days;
      const trialStart = new Date(profileData?.trial_start || new Date()); // Trial start date
      interval = setInterval(() => {
        const now = new Date();
        const trialEnd = new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
        const diffMs = trialEnd - now;
        if (diffMs <= 0 || profileData?.recurringPlanId === "Free") {
          clearInterval(interval);
          setMinuteTrialText("0 day");
          return;
        }

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

        const twoLetterFormat = (time) => (time?.toString()?.length > 1 ? time : `0${time}`);

        setMinuteTrialText(
          `${twoLetterFormat(diffDays)} : ${twoLetterFormat(diffHours)} : ${twoLetterFormat(
            diffMinutes
          )} : ${twoLetterFormat(diffSeconds)}`
        );
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [profileData]);

  useEffect(() => {
    setUserCreated(profileData?.created_at || profileData?.created || new Date());
    if (profileData) {
      const profileDate = new Date(profileData?.discountAppliedDate || new Date());
      profileDate.setDate(profileDate.getDate() + 2);
      const countDownDate = profileDate - new Date();
      const daysDifference = countDownDate / (1000 * 60 * 60 * 24);
      if (daysDifference <= 2 && daysDifference > 0) {
        // setShowDateWisePrice(true); // comment show banner
      }
    }
  }, [profileData]);

  const filteredPlans = pricingData.filter((plan) => {
    if (config?.plans?.length > 0 && !config.plans.includes(plan.id)) {
      return false;
    } else if (typeof plan.isHidden === "string") {
      return !eval(plan.isHidden);
    } else {
      return !plan.isHidden;
    }
  });

  const renderPlan = () => (
    <BlockStack gap="500" inlineAlign="center">
      {(profileData?.recurringPlanId === "Free" || profileData?.recurringPlanId === "Premium100") && (
        <div style={{ width: "100%" }}>
          <DismissibleBanner
            tone="info"
            title=""
            bannerText={`${
              profileData?.recurringPlanId === "Premium100"
                ? t("common.You now have free access to all premium features.")
                : t("common.Accept the plan to unlock all premium features for free.")
            }`}
            skipRemove={true}
          />
        </div>
      )}
      {profileData?.recurringPlanId === "Free" && <FreePlan plan={filteredPlans?.[0]} />}
      {(profileData?.recurringPlanId === "Free" || profileData?.recurringPlanId === "Premium100") && (
        <Premium100Plan
          selectedPlan={selectedPlan}
          fetch={fetch}
          setSelectedPlan={setSelectedPlan}
          updateProfileData={updateProfileData}
        />
      )}

      {profileData?.recurringPlanId !== "Free" && profileData?.recurringPlanId !== "Premium100" && (
        <InlineGrid
          gap="400"
          columns={{
            xs: "1",
            sm: "2",
            md: filteredPlans.length > 3 ? 3 : filteredPlans.length,
            lg: filteredPlans.length > 3 ? 3 : filteredPlans.length,
            xl: filteredPlans.length > 3 ? 3 : filteredPlans.length,
          }}
        >
          {filteredPlans.map((plan, index) => (
            <SinglePlan
              key={index}
              plan={plan}
              formRef={formRef}
              formValues={formValues}
              upgradePlan={upgradePlan}
              cancelPlan={cancelPlan}
              submitPromocode={submitPromocode}
              trialDays={trialDays}
              profileData={profileData}
              urlPromoCode={urlPromoCode}
              minuteTrialText={minuteTrialText}
            />
          ))}
        </InlineGrid>
      )}
      <Text></Text>
    </BlockStack>
  );
  if (!selectedPlan || !profileData) return <CommonSkeletonPage />;

  return (
    <>
      {profileData && profileData.recurringPlanId !== "Pro100" ? (
        <div className="pricing-plan">
          {!config?.hideHeader ? (
            <Page
              title={title ? title : t(`common.Pricing`)}
              backAction={backbutton}
              fullWidth
              primaryAction={
                syncPlanButton && (
                  <Button variant="primary" size="medium" onClick={activeSyncPlan}>
                    {t(`common.Sync Plan`)}
                  </Button>
                )
              }
              // secondaryActions={
              //   hasBillingButton && (
              //     <InlineStack gap={200} blockAlign="center">
              //       {/* <VideoTitle selector={`Pricing Trial Days`} /> */}
              //       {!config && (
              //         <button className="cro-button" onClick={() => openSupportChatBox("header")}>
              //           <InlineStack gap={100} align="center" blockAlign="center">
              //             {t("common.Store customization services")} - $
              //             {getPriceShopifyPlanWise(profileData, 1, 0)?.price}
              //             /hr + 10H {t("common.free")} {t("common.trial")}
              //           </InlineStack>
              //         </button>
              //       )}
              //       {!config && (
              //         <button
              //           className="seo-button"
              //           onClick={() => openSEOPlan("Custom SEO Services from header")}
              //         >
              //           {t("common.Affordable SEO services")} - $
              //           {getPriceShopifyPlanWise(profileData, 1, 0)?.price}/hr + 10H {t("common.free")}{" "}
              //           {t("common.trial")}
              //         </button>
              //       )}
              //     </InlineStack>
              //   )
              // }
            >
              <BlockStack gap={200} align="center">
                {profileData?.recurringPlanId !== "Free" && profileData?.recurringPlanId !== "Premium100" && (
                  <InlineStack gap={200} align={"center"}>
                    <ButtonGroup variant="segmented">
                      <Button
                        pressed={isFirstButtonActive}
                        onClick={() => {
                          priceSegmentedButton(true);
                        }}
                      >
                        <InlineStack gap="100">
                          <div
                            style={{
                              minHeight: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {t(`common.Billed Monthly`)}{" "}
                          </div>
                          {showDateWisePrice && dateWisePersent(userCreated, true) && (
                            <Badge tone="info">
                              {t(`common.Save`)} {dateWisePersent(userCreated, true)}%
                            </Badge>
                          )}
                        </InlineStack>
                      </Button>
                      <Button
                        pressed={!isFirstButtonActive}
                        onClick={() => {
                          priceSegmentedButton(false);
                        }}
                      >
                        {t(`common.Billed Annually`)}{" "}
                        {showDateWisePrice ? (
                          <Badge tone="info">
                            {t(`common.Save`)} {dateWisePersent(userCreated, false)}%
                          </Badge>
                        ) : (
                          <Badge tone="info">
                            {t(`common.Save`)}
                            {" 30%"}
                          </Badge>
                        )}
                      </Button>
                    </ButtonGroup>
                  </InlineStack>
                )}
                {renderPlan()}
                {/* <FreeAppPromotion /> */}
                <br />
              </BlockStack>
            </Page>
          ) : (
            <>
              {showDateWisePrice && (
                <DismissibleBanner
                  tone="info"
                  title={`${
                    dateWisePriceBanner(userCreated, isFirstButtonActive)?.bannerTitle
                  } ${countDownString}`}
                  bannerName={`dateWisePriceBanner`}
                  bannerText={dateWisePriceBanner(userCreated, isFirstButtonActive)?.bannerMsg}
                  skipRemove={true}
                />
              )}
              <br />
              {renderPlan()}
            </>
          )}
        </div>
      ) : (
        <Page>
          <Box paddingBlockStart="5">
            <Banner
              tone="info"
              title={
                <Text variant="headingMd">
                  {t(`common.Premium100Title`)}
                  <br /> <br />
                  {t(`common.Premium100ReviewLine`)}
                </Text>
              }
              action={{ content: t(`common.Leave Review`), url: reviewLink, target: "_blank" }}
              secondaryAction={{
                content: t(`common.Check Our Current Pricing`),
                url: process.env.SHOPIFY_STORE_APP_URL,
                target: "_blank",
              }}
            ></Banner>
          </Box>
        </Page>
      )}
      <Modal
        open={isReasonPopup}
        onClose={closeReasonPopup}
        title={t(`common.We're sorry to see you go!`)}
        primaryAction={{
          content: t(`common.Cancel Plan`),
          onAction: submitForm,
        }}
      >
        <Modal.Section>
          <CommonForm
            onSubmit={cancelReccuringPlan}
            formRef={formRef}
            initialValues={cancelReasonValues}
            formFields={formFieldsCancelReason.map((value) => ({
              ...value,
              label: (
                <Text variant="headingMd" fontWeight={"medium"} as="span">
                  {t(`common.${value.label}`)}
                </Text>
              ),
              subfields: formFieldsCancelReason[0].subfields.map((value) => ({
                ...value,
                label: t(`common.${value.label}`),
              })),
            }))}
            isSave={false}
            noValueChanged={false}
          />
        </Modal.Section>
      </Modal>
    </>
  );
}
