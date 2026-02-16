import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useCustomerly } from "react-live-chat-customerly";
import { useLocation } from "react-router-dom";
import {
  Badge,
  BlockStack,
  Button,
  ButtonGroup,
  Card,
  Icon,
  IndexTable,
  InlineStack,
  Link,
  Page,
  Text,
  useIndexResourceState,
} from "@shopify/polaris";
import { CheckIcon, ChevronDownIcon, ChevronRightIcon, DiscountFilledIcon, XIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import moment from "moment";
import { useAuthenticatedFetch } from "@/Api/Axios";
import {
  getOfferTrialText,
  getPlansData,
  initialValues,
  interval,
  pricingPlanFeatureList,
} from "@/Assets/Mocks/CommonPricing.mock";
import ClientReviews from "@/Components/Common/ClientReviews";
import CommonSkeletonPage from "@/Components/Common/CommonSkeletonPage";
import LearnMore from "@/Components/Common/LearnMore";
import { navigate } from "@/Components/Common/NavigationMenu";
import VideoTitle from "@/Components/Common/VideoTitle";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";
import { removeBasePriceURL, slackChannelMsgForCustomServices } from "@/Utils/Index";
import DownGradePlanPopup from "./DownGradePlanPopup";
import PlanCancelModel from "./PlanCancelModel";
import SinglePlanHeading from "./SinglePlanHeading";

export default function TabularPricing({
  config,
  onAcceptPlan,
  hasBillingButton,
  title,
  backbutton,
  planCheckByName,
  hideFreePlan = false,
}) {
  const [formValues, setFormValues] = useState(initialValues);
  const [isStatusActive, setStatusActive] = useState(true);
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const { showToast } = useContext(ToastContext);
  const [selectedPlan, setSelectedPlan] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [urlPromoCode, setUrlPromoCode] = useState(false);
  const [isFirstButtonActive, setIsFirstButtonActive] = useState(false);
  const [cancelPlanPopup, setCancelPlanPopup] = useState(false);
  const [updateProfileOneTime, setUpdateProfileOneTime] = useState(false);
  const [planForActive, setPlanForActive] = useState();
  const [minuteTrialText, setMinuteTrialText] = useState();
  const [trialDays, setTrialDays] = useState("");
  const [yearlyTrialText, setYearlyTrialText] = useState();
  const [monthlyTrialText, setMonthlyTrialText] = useState();
  const fetch = useAuthenticatedFetch();
  const location = useLocation();
  const setNavigate = navigate();
  const formRef = useRef();
  const urlParams = new URLSearchParams(location.search);
  const { showNewMessage } = useCustomerly();
  const [allPromoCodes, setAllPromoCodes] = useState([]);
  const [downGradeModal, setDownGradeModal] = useState(false);
  const screenSize = window.innerWidth;

  const plansData = useMemo(() => {
    const allPlans = getPlansData(profileData, selectedPlan, promoCode, allPromoCodes);
    return hideFreePlan ? allPlans.filter((plan) => plan.id !== "Free") : allPlans;
  }, [profileData, selectedPlan, promoCode, allPromoCodes, hideFreePlan]);

  const [pricingData, setPricingData] = useState(plansData);
  const [openToggle, setOpenToggle] = useState(
    pricingPlanFeatureList?.reduce((acc, _, index) => {
      acc[index] = true;
      return acc;
    }, {})
  );

  const firstStepPlanPrice = 9.99;

  const monthlyDiscountText = useMemo(() => {
    let initialDiscount = 0;
    const monthlyPlan = pricingData?.filter((e) => e?.billingInterval === "Month");
    monthlyPlan?.map((plan) => (initialDiscount = Math.max(initialDiscount, plan.discountPercent)));
    return initialDiscount > 0 ? initialDiscount : null;
  }, [pricingData]);

  const yearlyDiscountText = useMemo(() => {
    let initialDiscount = 30;
    const monthlyPlan = pricingData?.filter((e) => e?.billingInterval === "Year");
    monthlyPlan?.map((plan) => (initialDiscount = Math.max(initialDiscount, plan.discountPercent)));
    return initialDiscount;
  }, [pricingData]);

  // Moved the repeated logic into a separate function
  const getUrlParam = (param) => urlParams.get(param);
  let creditObj = useMemo(() => profileData?.credits);

  const cancelRecurringPlan = useCallback(
    async (value) => {
      if (value.cancelReason.reason === "") {
        showToast(t(`common.Please Select One Option`));
      } else {
        setCancelPlanPopup(false);
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
        res?.data?.credits && updateProfileData(res?.data);
        fetchPlanData();
        setStatusActive(true);
      }
    },
    [selectedPlan, cancelPlanPopup, profileData, trialDays]
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

  const shopifyPlanActive = useCallback(
    async (plan, appendUrl, skipTrial) => {
      const { shopUrl, email } = profileData;
      const storeUrl = shopUrl.split(".myshopify.com")[0];
      const { discounts, features, featureList, ...rest } = plan;
      let return_url = `https://admin.shopify.com/store/${storeUrl}/apps/${process.env.SHOPIFY_APP_URL_FOR_PRICING}/pricing?finalPrice=${plan.finalPrice}&&name=${plan?.name}&&billingInterval=${plan.billingInterval}`;
      const urlPromoCode = plan?.extendTrialCode || getUrlParam("promocode");

      if (plan["discountValue"]) return_url = `${return_url}&&code=${plan["discountValue"]}`;
      if (plan["discountLabel"]) return_url = `${return_url}&&discountRate=${plan["discountLabel"]}`;
      if (plan.discountObject?.interval) return_url = `${return_url}&&interval=${plan.discountObject?.interval}`;
      if (urlPromoCode && !skipTrial) return_url = `${return_url}&&urlCode=${urlPromoCode}`;
      if (skipTrial) return_url = `${return_url}&&skipTrial=true`;
      if (appendUrl) return_url = return_url + appendUrl;

      // let planName = plan?.name;
      // if (plan?.id?.includes("Pro")) {
      //   const updatedName = pricingData.find(
      //     (e) => e.id === plan?.id && plan?.purchasedPlanPrice == (e?.monthlyPrice ? e.monthlyPrice : e.price)
      //   )?.name;
      //   planName = updatedName || planName;
      // }

      const newPlan = {
        ...rest,
        name: plan?.name,
        trial_days: skipTrial
          ? 0
          : profileData?.trial_days || profileData?.trial_days == 0
          ? trialDays
          : plan?.trial?.days || 0,
        return_url: return_url,
        test: email?.includes("webrexstudio.com"),
        offerTrialDays: skipTrial ? 0 : plan?.offerTrialDays,
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
    [profileData, trialDays, pricingData]
  );

  const planPriority = {
    Free: 0,
    Premium: 1,
    "Premium-Monthly": 1,
    "Premium Yearly": 1,
    "Premium-Yearly": 1,
    Pro: 2,
    "Pro-Monthly": 2,
    "Pro Yearly": 2,
    "Pro-Yearly": 2,
  };

  const upgradePlan = useCallback(
    async (plan, skipTrial) => {
      const indexWisePriority = planPriority[selectedPlan?.planName] > planPriority[plan?.name];

      const showUpgrade = !plan?.skipDowngrade && selectedPlan?.planName !== "Free" && indexWisePriority;
      const checkDiscount = (parseInt(selectedPlan?.discountValue?.match(/\d+/)[0], 10) || 0) < 50;
      const checkBiggerPrice = plan.finalPrice > selectedPlan.discountedPrice;

      if (showUpgrade && checkDiscount && !checkBiggerPrice) {
        setDownGradeModal(true);
        setPlanForActive({ ...plan, isSkipTrial: skipTrial });
      } else {
        let appendUrl = `&&purDisPrs=${plan?.finalPrice}&&purOrgPrs=${plan?.monthlyPrice || plan?.price}`;
        shopifyPlanActive(plan, appendUrl, skipTrial);
      }
    },
    [profileData, trialDays, selectedPlan]
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
          if (findCode?.value) {
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
          setFormValues(initialValues);
          if (plan.discountLabel) {
            const data = pricingData.map((e) => {
              if (e.name === plan.name && e?.price === plan?.price) {
                return plan;
              } else if (e.selected === true) {
                return e;
              } else {
                e.touched = false;
                e.finalPrice = checkPromoCodeValidity(e, " ", e.monthlyPrice ? e.monthlyPrice : e.price);
                return e;
              }
            });
            const filteredData = hideFreePlan ? data.filter((plan) => plan.id !== "Free") : data;
            setPricingData(filteredData);
            setTrialDays(getTrialDays());
          }
        } else if (plan.discountLabel) {
          plan.touched = true;
        } else {
          plan.touched = false;
          setFormValues(initialValues);
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
      setStatusActive(true);
      setSelectedPlan(res.data);
      if (hasBillingButton && res.data?.billingInterval === "Month" && res.data.id !== "Free") {
        setIsFirstButtonActive(true);
      }
    }
  }, []);

  const activatePlan = useCallback(
    async (aiToken, purchasePlan) => {
      let res;
      if (aiToken) {
        const charge_id = getUrlParam("charge_id");
        let data = { charge_id };
        res = await fetch.post("plan/saveCredit", data);
        if (res.code == 200) {
          showToast(
            <Text variant="bodyMd" as="p">
              {t(`common.Credit purchase successful.`)}{" "}
              <Link onClick={goToSetting} monochrome>
                {t(`common.Check here`)}
              </Link>
            </Text>
          );
        }
      } else {
        const params = [
          "finalPrice",
          "code",
          "charge_id",
          "discountRate",
          "interval",
          "name",
          "billingInterval",
          "purDisPrs",
          "purOrgPrs",
          "skipTrial",
        ];
        let data = params.reduce((obj, param) => {
          const value = getUrlParam(param);
          obj[param] = value === "null" ? null : value;
          return obj;
        }, {});
        const urlCode = getUrlParam("urlCode");

        let initialDiscountInfo = [];
        if (!urlCode && profileData?.initialDiscountInfo?.monthlyCode) {
          const { monthlyCode, yearlyCode } = profileData?.initialDiscountInfo || {};
          if (monthlyCode) initialDiscountInfo.push(monthlyCode);
          if (yearlyCode) initialDiscountInfo.push(yearlyCode);
        }

        const [oldPlanData, getPromoCode] = await Promise.all([
          fetch.get("plan", false),
          fetch.post("getSinglePromoCode", { code: [urlCode, ...initialDiscountInfo] }, false),
        ]);

        const allPlansData = getPlansData(profileData, oldPlanData?.data, urlCode, getPromoCode?.data);
        const plansData = hideFreePlan ? allPlansData.filter((plan) => plan.id !== "Free") : allPlansData;

        plansData.find((plan) => {
          if (data.name === plan.name) {
            const planPrice = plan?.monthlyPrice ? plan.monthlyPrice : plan.price;
            // if (!data.id?.includes("Pro") || (data.id?.includes("Pro") && data?.purOrgPrs == planPrice)) {
            data["recurring"] = plan?.is_recurring;
            data["originalPrice"] = plan?.price;
            data["intervalLable"] = plan?.intervalLable;
            data["planPrice"] = planPrice;
            data["name"] = plan.name;
            data["id"] = plan.id;
            data["getCreditFromPrice"] = plan.getCreditFromPrice;
            data["offerTrialDays"] =
              oldPlanData?.data?.planName === plan.name && urlCode === "TR3IA0ALE" ? 30 : plan.offerTrialDays;
            data["trial_days"] =
              profileData?.trial_days || profileData?.trial_days == 0 ? getTrialDays() : plan?.trial?.days || 0;
            if (plan.credits) {
              data = { ...data, ...plan.credits };
            }
            // }
          }
        });
        data["showPriceShopifyPlanWise"] = oldPlanData?.data?.showPriceShopifyPlanWise;
        // data["showPriceShopifyPlanWise"] = oldPlanData?.data?.showPriceShopifyPlanWise || oldPlanData?.data?.id === "Free";
        res = await fetch.post("plan/active", data);
      }
      res?.data?.credits && updateProfileData(res?.data);
      fetchPlanData();
    },
    [profileData, trialDays]
  );

  const handleUrlParams = useCallback(() => {
    const chargeId = getUrlParam("charge_id");
    const code = getUrlParam("promocode");
    const aiToken = getUrlParam("aiToken");
    const purOrgPrs = getUrlParam("purOrgPrs");

    if (code) {
      setPromoCode(code);
      setUrlPromoCode(true);
    }

    if (chargeId) {
      setSelectedPlan(false);
      activatePlan(aiToken, purOrgPrs);
    } else {
      fetchPlanData();
    }
  }, [profileData, allPromoCodes]);

  const priceSegmentedButton = useCallback((status) => {
    setIsFirstButtonActive(status);
  }, []);

  const fetchPromoCode = useCallback(async () => {
    const code = [];
    const userInfo = profileData?.initialDiscountInfo;
    if (userInfo?.yearlyCode) code?.push(userInfo?.yearlyCode);
    if (userInfo?.monthlyCode) code?.push(userInfo?.monthlyCode);
    if (promoCode) code?.push(promoCode);
    if (code?.length > 0) {
      const res = await fetch.post("getSinglePromoCode", { code });
      if (res?.data?.length > 0) setAllPromoCodes(res?.data);
      else setAllPromoCodes([]);
    }
  }, [profileData, promoCode]);

  useEffect(() => {
    if (profileData) {
      const trialDays = selectedPlan?.offerTrialDays > 0 ? selectedPlan?.offerTrialDays : profileData?.trial_days;
      const trialStart = new Date(profileData?.trial_start || new Date()); // Trial start date

      const now = new Date();
      const trialEnd = new Date(trialStart.getTime() + trialDays * 24 * 60 * 60 * 1000);
      const diffMs = trialEnd - now;
      if (diffMs <= 0 || profileData?.recurringPlanId === "Free" || !profileData?.trial_start || !trialDays) {
        setMinuteTrialText();
        return;
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays > 0) setMinuteTrialText(`${diffDays} days trial left`);
      else setMinuteTrialText("Last day of trial !!");
    }
  }, [profileData, selectedPlan]);

  useEffect(() => {
    let flag = false;
    if (profileData && selectedPlan && isStatusActive) {
      let data = plansData.map((plan) => {
        // if (plan.id === selectedPlan.id && (selectedPlan?.originalPrice === plan?.price || plan.id === "Free")) {
        if (plan.id === selectedPlan.id && plan.name === selectedPlan.planName) {
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
          plan["credits"] = selectedPlan?.activePlanCredit;
          if (selectedPlan?.discountValue && selectedPlan?.discountValue !== "undefined") {
            plan["discountLabel"] = selectedPlan.discountValue;
            plan["discountPercent"] = parseInt(selectedPlan?.discountValue?.match(/\d+/)[0], 10);
            const interval = selectedPlan?.interval > 0 ? { interval: selectedPlan?.interval } : {};
            plan["discountObject"] = {
              code: selectedPlan.code,
              type: "percentage",
              value: parseInt(selectedPlan?.discountValue?.match(/\d+/)[0], 10),
              ...interval,
            };
          }
          if (!selectedPlan?.discountValue && plan?.initialDiscountObject) {
            plan["discountPercent"] = plan?.initialDiscountObject?.value || 0;
            plan["discountObject"] = { ...plan?.initialDiscountObject };
          }
          plan["featureData"] = profileData?.featureData;
        } else if (selectedPlan.id.includes(100) && plan.id === "Premium-Monthly") {
          flag = true;
          plan.id = selectedPlan.id;
          plan["selected"] = true;
          plan["intervalLable"] = "Month";
          plan["price"] = selectedPlan?.planPrice || 0;
          plan["finalPrice"] = selectedPlan?.discountedPrice || 0;
          plan["credits"] = selectedPlan?.activePlanCredit;
        } else {
          if (selectedPlan.billingInterval === "Year" && plan.billingInterval !== "Year") {
            plan["disableActiveButton"] = true;
          }

          if (plan?.offerTrialDays > 0) {
            const trialText = getOfferTrialText(plan?.offerTrialDays);
            plan.billingInterval === "Month" ? setMonthlyTrialText(trialText) : setYearlyTrialText(trialText);
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
        data = data?.filter((e) => e.id !== "Premium-Monthly" && e.id !== "Premium-Yearly");

        let plan = {
          type: selectedPlan.is_recurring ? "recurring" : "onetime",
          is_recurring: selectedPlan.is_recurring,
          intervalLable: selectedPlan.intervalLable,
          interval: interval[selectedPlan.id || "Default"],
          id: selectedPlan.id,
          name: selectedPlan.planName,
          isHidden: selectedPlan.billingInterval === "Year" ? "isFirstButtonActive" : "!isFirstButtonActive",
          price: selectedPlan.originalPrice ? selectedPlan.originalPrice : selectedPlan.planPrice,
          trial: {
            days: trialDays,
          },
          selected: true,
          finalPrice: selectedPlan?.discountedPrice ? selectedPlan.discountedPrice : selectedPlan.planPrice,
          discountLabel: selectedPlan?.discountValue,
          discountValue: selectedPlan?.code,
          featureList: {
            Free: true,
            Premium: true,
          },
        };
        if (selectedPlan.billingInterval === "Year" && selectedPlan.intervalLable === "Month") {
          plan["monthlyPrice"] = selectedPlan.planPrice;
        }
        data.splice(1, 0, plan);
      }
      const filteredData = hideFreePlan ? data.filter((plan) => plan.id !== "Free") : data;
      setPricingData(filteredData);
      setTrialDays(getTrialDays());
    }
  }, [profileData, selectedPlan, allPromoCodes, hideFreePlan]);

  useEffect(() => {
    if (profileData && !updateProfileOneTime) {
      handleUrlParams();
      setUpdateProfileOneTime(true);
    }
  }, [profileData, updateProfileOneTime]);

  useEffect(() => {
    if (profileData) fetchPromoCode(promoCode);
  }, [profileData, urlPromoCode, promoCode]);

  const getAllPlansData = pricingData.filter((plan) => {
    if (config?.plans?.length > 0 && !config.plans.includes(planCheckByName ? plan.name : plan.id)) {
      return false;
    } else if (typeof plan.isHidden === "string") {
      return !eval(plan.isHidden);
    } else {
      return !plan.isHidden;
    }
  });

  const filteredPlans = config && getAllPlansData?.length > 3 ? getAllPlansData.slice(0, 3) : getAllPlansData;

  const goToSetting = () => setNavigate("/settings?tabindex=1");

  const getCreditBadge = (profileCredit, text) => {
    const credit = profileCredit || 0;
    return (
      <Badge fullWidth tone={credit <= 0 ? "magic" : "success"}>
        <Text variant="headingSm" align="center">
          {`${text} `}
          {t(`common.credit`)} : {credit}
        </Text>
      </Badge>
    );
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } = useIndexResourceState(filteredPlans);

  const RowComponent = ({ feature }) => {
    if (!feature) return <Icon source={XIcon} tone="magic" />;
    else if (typeof feature === "boolean") {
      if (feature) return <Icon source={CheckIcon} tone="success" />;
      else return <Icon source={XIcon} tone="magic" />;
    } else return <Text alignment="center">{feature}</Text>;
  };

  const handleCollapsibleToggle = useCallback((i) => {
    setOpenToggle((prevOpen) => ({
      ...prevOpen,
      [i]: !prevOpen[i],
    }));
    createRowsData();
  }, []);

  const createRowsData = useCallback(() => {
    if (pricingPlanFeatureList?.length <= 0) return [];
    return pricingPlanFeatureList?.map((row, index) => {
      const featureData = pricingPlanFeatureList[index];
      return (
        <React.Fragment key={`${row.key}-${index}`}>
          <IndexTable.Row
            id={`${row.key}-${index}-0`}
            onClick={() => handleCollapsibleToggle(index)}
            key={`${row.key}-${index}-0`}
          >
            <IndexTable.Cell>
              <InlineStack gap={100}>
                <span>
                  <Icon source={openToggle[index] ? ChevronDownIcon : ChevronRightIcon} />
                </span>
                <VideoTitle
                  selector={featureData?.label}
                  titleLabel={
                    <Text fontWeight="bold" variant="headingMd">
                      {t(`common.${featureData?.label}`)}
                    </Text>
                  }
                />
              </InlineStack>
            </IndexTable.Cell>
            {filteredPlans?.map((plan, index) => (
              <IndexTable.Cell key={index} id={plan?.selected ? "selectedPlanColumn" : ""}></IndexTable.Cell>
            ))}
          </IndexTable.Row>
          {openToggle[index] &&
            featureData?.list?.map((feature, index) => (
              <IndexTable.Row id={`${row.key}-${index}-1`} onClick={() => {}} key={`${row.key}-${index}-1`}>
                <IndexTable.Cell>
                  <InlineStack gap={600} align={screenSize > 768 ? "start" : "center"}>
                    <Text />
                    <VideoTitle selector={feature?.label} titleLabel={t(`common.${feature?.label}`)} />
                  </InlineStack>
                </IndexTable.Cell>
                {filteredPlans?.map((plan, index) => (
                  <IndexTable.Cell key={index} id={plan?.selected ? "selectedPlanColumn" : ""}>
                    <RowComponent feature={plan?.featureList?.[feature?.key]} />
                  </IndexTable.Cell>
                ))}
              </IndexTable.Row>
            ))}
        </React.Fragment>
      );
    });
  }, [openToggle, selectedPlan, filteredPlans]);

  const filterHeadings = filteredPlans?.map((plan, index) => {
    return {
      title: (
        <SinglePlanHeading
          plan={plan}
          formValues={formValues}
          submitPromocode={submitPromocode}
          formRef={formRef}
          trialDays={trialDays}
          urlPromoCode={urlPromoCode}
          profileData={profileData}
          minuteTrialText={minuteTrialText}
          cancelPlan={() => setCancelPlanPopup(true)}
          upgradePlan={upgradePlan}
          fetch={fetch}
          selectedPlan={selectedPlan}
        />
      ),
      id: plan?.selected ? "selectedHeading" : `${index + 1}-${plan?.name}`,
      alignment: "center",
    };
  });

  const SegmentedButtons = () => {
    return (
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
                  minHeight: "23px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t(`common.Billed monthly`)}
              </div>
              {monthlyTrialText ? (
                <Badge tone="attention">
                  <InlineStack blockAlign="center" align="center">
                    <span>
                      <Icon source={DiscountFilledIcon} />
                    </span>
                    <Text fontWeight="bold">{`${monthlyTrialText} ${t("common.free trial")} !!`}</Text>
                  </InlineStack>
                </Badge>
              ) : (
                monthlyDiscountText && (
                  <Badge tone="info">
                    {t(`common.Save`)} {monthlyDiscountText}%
                  </Badge>
                )
              )}
            </InlineStack>
          </Button>

          <Button
            pressed={!isFirstButtonActive}
            onClick={() => {
              priceSegmentedButton(false);
            }}
          >
            <InlineStack gap="100">
              <div
                style={{
                  minHeight: "23px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t(`common.Billed annually`)}
              </div>
              {yearlyTrialText ? (
                <Badge tone="attention">
                  <InlineStack blockAlign="center" align="center">
                    <span>
                      <Icon source={DiscountFilledIcon} />
                    </span>
                    <Text fontWeight="bold">{`${yearlyTrialText} ${t("common.free trial")} !!`}</Text>
                  </InlineStack>
                </Badge>
              ) : (
                <Badge tone="info">
                  {t(`common.Save`)} {yearlyDiscountText || 30}%
                </Badge>
              )}
            </InlineStack>
          </Button>
        </ButtonGroup>
      </InlineStack>
    );
  };
  const renderPlan = () => {
    return (
      <BlockStack gap={100}>
        <Card padding={0}>
          {!selectedPlan || !profileData ? (
            <CommonSkeletonPage />
          ) : (
            <div className="pricing_table">
              <IndexTable
                resourceName={{ singular: "order", plural: "orders" }}
                itemCount={filteredPlans?.length}
                selectedItemsCount={allResourcesSelected ? "All" : selectedResources.length}
                onSelectionChange={handleSelectionChange}
                selectable={false}
                headings={[
                  {
                    title: <Text variant="headingMd">Compare plans</Text>,
                    id: "Compare-Plans-0",
                    alignment: "center",
                  },
                  ...filterHeadings,
                ]}
              >
                {createRowsData()}
              </IndexTable>
            </div>
          )}
        </Card>
        <LearnMore
          type="footer"
          data={[
            {
              url: "https://webrex-seo-optimizer.customerly.help/en/subscription-charges-for-webrex-seo-optimizer-app",
              title: t(`common.Pricing`),
            },
          ]}
        />
        <Text />
      </BlockStack>
    );
  };

  const getPriceShopifyPlanWise = (userData, hour, discount) => {
    const profilePrice = userData?.customPrice?.storeCustomizePrice;
    const basicPlan = ["Basic", "Basic Shopify"];
    const mainPrice = basicPlan?.includes(userData?.plan_display_name) ? 10 : 15;
    const orgPrice = profilePrice > 0 ? profilePrice : mainPrice * hour;
    return { price: orgPrice * (1 - discount / 100), hour: `${hour}H`, orgPrice, discount };
  };

  return !config?.hideHeader ? (
    <Page
      backAction={backbutton}
      title={<VideoTitle selector={"Pricing"} titleLabel={title ? title : t(`common.Pricing`)} />}
      fullWidth
      secondaryActions={
        hasBillingButton &&
        config && (
          <InlineStack gap={200} blockAlign="center">
            <SegmentedButtons />
          </InlineStack>
        )
      }
    >
      <BlockStack gap={200}>
        {!config && <SegmentedButtons />}
        {profileData?.removePremiumAccessLater && profileData?.recurringPlanName === "Free" && (
          <InlineStack gap={200} align={"center"}>
            <Badge tone="attention-strong">
              <Text variant="bodyMd">
                🎁 You're on the <b>Free Plan</b>, You still have access to{" "}
                <b>{selectedPlan?.chargeInfo?.[selectedPlan?.chargeInfo?.length - 2]?.planName} plan</b> features
                until{" "}
                <b>
                  {moment(selectedPlan?.nextMonthStartDate || selectedPlan?.nextYearStartDate).format(
                    "MMMM D YYYY"
                  )}
                  .
                </b>
              </Text>
            </Badge>
          </InlineStack>
        )}
        {/* <div className="hide-on-mobile">
          <ClientReviews />
        </div> */}
        {renderPlan()}
      </BlockStack>

      {pricingData?.find((e) => e.selected) && (
        <PlanCancelModel
          cancelRecurringPlan={cancelRecurringPlan}
          cancelPlanPopup={cancelPlanPopup}
          setCancelPlanPopup={setCancelPlanPopup}
          selectedPlan={pricingData?.find((e) => e.selected)}
          alreadyGivenDiscount={parseInt(selectedPlan?.discountValue?.match(/\d+/)[0], 10)}
          upgradePlan={upgradePlan}
          profileData={profileData}
          trialDays={trialDays}
          activatedPlan={selectedPlan}
          minuteTrialText={minuteTrialText}
        />
      )}
      {pricingData?.find((e) => e.selected) && planForActive && (
        <DownGradePlanPopup
          downGradeModal={downGradeModal}
          setDownGradeModal={setDownGradeModal}
          planForActive={planForActive}
          selectedPlan={pricingData?.find((e) => e.selected)}
          activatedPlan={selectedPlan}
          profileData={profileData}
          trialDays={trialDays}
          fetch={fetch}
          upgradePlan={upgradePlan}
        />
      )}
    </Page>
  ) : (
    renderPlan()
  );
}
