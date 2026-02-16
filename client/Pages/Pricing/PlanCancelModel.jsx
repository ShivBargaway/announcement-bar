import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { useCustomerly } from "react-live-chat-customerly";
import { Badge, Banner, BlockStack, Button, Icon, InlineError, InlineStack, Modal, Text } from "@shopify/polaris";
import { ChatIcon, CheckIcon, DiscountFilledIcon, DiscountIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import {
  cancelReasonInitialValues,
  cancelReasonOptions,
  formFieldsCancelReason,
} from "@/Assets/Mocks/CommonPricing.mock";
import CommonForm from "@/Components/Common/CommonForm";
import { ToastContext } from "@/Context/ToastContext";
import { slackMessageForPricing } from "@/Utils/Index";

const discountFeatures = [
  "Full access to all current features.",
  "Lifetime discount applied automatically.",
  "No commitment - cancel anytime.",
  "Priority customer support.",
];

const ReasonStep = ({ formRef, formValues, setFormValue }) => {
  return (
    <CommonForm
      formRef={formRef}
      initialValues={formValues}
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
      onFormChange={(e) => setFormValue(e)}
    />
  );
};

const SupportStep = ({ openSupportChatBox, goToPreviousStep, goToNextStep }) => {
  return (
    <div className="step-content">
      <div className="support-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            stroke="#2196F3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13.73 21a2 2 0 0 1-3.46 0"
            stroke="#2196F3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="5" r="3" fill="#2196F3" />
        </svg>
      </div>
      <Text tone="inherit" alignment="center">
        Our Support Team Can Help
      </Text>
      <Text alignment="center" as="div">
        <p className="highlight-stat">We solve over 70% of cancellation issues!</p>
      </Text>
      <Text alignment="center">
        Many concerns can be quickly resolved by our support team. Would you like to chat with them before
        canceling?
      </Text>

      <Button variant="primary" onClick={openSupportChatBox} fullWidth icon={ChatIcon}>
        Contact Support Now
      </Button>

      <div className="action-buttons">
        <Button onClick={goToPreviousStep}>Back</Button>
        <Button onClick={goToNextStep} variant="primary" tone="magic">
          Continue to Cancel
        </Button>
      </div>
    </div>
  );
};

export const DiscountStep = ({
  discountValue,
  selectedPlan,
  upgradePlanAction,
  goToPreviousStep,
  handleCancelPlan,
  showButton = false,
  UpgradeButton,
}) => {
  const discountedPrice =
    (selectedPlan.monthlyPrice ? selectedPlan.monthlyPrice : selectedPlan.price) - selectedPlan.finalPrice;
  return (
    <BlockStack gap={300}>
      <InlineStack align="center">
        <Badge icon={DiscountIcon} tone="attention-strong" size="large">
          <BlockStack gap={100} inlineAlign="center">
            <Text />
            <Text fontWeight="bold" variant="headingMd" tone="inherit">
              Exclusive One Time Offer
            </Text>
            <Text />
          </BlockStack>
        </Badge>
      </InlineStack>

      <BlockStack align="center" inlineAlign="center">
        <ConfettiExplosion width={2000} height={1000} duration={3000} zIndex={1000000} />
        <Text tone="magic" variant="headingLg" as="div">
          <div style={{ fontSize: "30px", fontWeight: "bold", color: "rgb(234 53 114)" }}>
            🎊Congratulations!!🎊
          </div>
        </Text>
      </BlockStack>

      <div className="discount-card">
        <div className="discount-badge">
          <span>{discountValue}% OFF</span>
          <span>LIFETIME DISCOUNT</span>
        </div>

        <div className="discount-details">
          <BlockStack gap={200}>
            <Text tone="inherit">Stay With Us And Save {discountValue}% lifetime discount!</Text>
            <InlineStack gap={200} blockAlign="baseline">
              <Text tone="subdued" variant="bodyLg" textDecorationLine="line-through" as="div">
                <div style={{ fontSize: "18px" }}>
                  ${selectedPlan.monthlyPrice ? selectedPlan.monthlyPrice : selectedPlan.price}
                </div>
              </Text>
              <Text tone="success" variant="headingLg">
                ${selectedPlan.finalPrice}/{selectedPlan.intervalLable}
              </Text>
            </InlineStack>
            <InlineStack blockAlign="center">
              <div>
                <Icon source={DiscountFilledIcon} />
              </div>
              <Text tone="subdued" icon={DiscountFilledIcon} fontWeight="bold">
                You’ll save ${Math.round(discountedPrice)} on every {selectedPlan.intervalLable}
                {selectedPlan.billingInterval === "Year" &&
                  ` and $${Math.round(discountedPrice * 12)} on every year`}
                !
              </Text>
            </InlineStack>
          </BlockStack>
        </div>
      </div>
      {UpgradeButton && <Text />}
      {UpgradeButton}

      <BlockStack gap={100}>
        <Text tone="inherit">What you'll keep:</Text>
        {discountFeatures?.map((feature, index) => (
          <InlineStack gap={100} key={index}>
            <div>
              <Icon source={CheckIcon} tone="success" />
            </div>
            <Text tone="inherit">{feature}</Text>
          </InlineStack>
        ))}
      </BlockStack>
      {showButton && (
        <BlockStack gap={600}>
          <Button variant="primary" onClick={upgradePlanAction} fullWidth icon={ChatIcon}>
            {t(`common.Upgrade with`)} {discountValue}% {t(`common.discount`)}
          </Button>

          <div className="action-buttons">
            <Button onClick={goToPreviousStep}>Back</Button>
            <Button onClick={handleCancelPlan} variant="primary" tone="magic">
              {t(`common.Cancel Plan`)}
            </Button>
          </div>
        </BlockStack>
      )}
    </BlockStack>
  );
};

const TrialDaysStep = ({ extendDays = 30, goToNextStep, extendTrialAction, minuteTrialText, activatedPlan }) => {
  return (
    <div className="extend-trial-days">
      {minuteTrialText && minuteTrialText?.includes("trial left") && activatedPlan?.offerTrialDays > 0 ? (
        <div className="cancellation-warning-block">
          <div className="warning-header">
            <div className="warning-icon">⚠️</div>
            <h3>You have active trial access</h3>
          </div>
          <div className="warning-content">
            <p className="trial-status">
              You have <span className="highlight-days">{minuteTrialText}</span> in your current{" "}
              <span className="highlight-plan">{activatedPlan?.planName} Plan</span>.
            </p>

            <div className="warning-message">
              <p>
                <strong>Important:</strong> If you cancel the plan now, you will:
              </p>
              <ul>
                <li>Immediately lose access to all premium features</li>
                <li>You will forfeit the remaining duration of your free trial</li>
                <li>Need to subscribe again to regain access</li>
              </ul>
            </div>

            <Banner>This trial offer cannot be claimed again after cancellation.</Banner>
            <br />

            <div style={{ fontStyle: "italic" }}>
              <Text tone="subdued">We recommend enjoying your full trial period before making changes.</Text>
            </div>
          </div>
        </div>
      ) : (
        <BlockStack gap={600}>
          <InlineStack align="center">
            <Badge icon={DiscountIcon} tone="attention-strong" size="large">
              <BlockStack gap={100} inlineAlign="center">
                <Text />
                <Text fontWeight="bold" variant="headingMd" tone="inherit">
                  Extend Trial - One Time Offer
                </Text>
                <Text />
              </BlockStack>
            </Badge>
          </InlineStack>
          <BlockStack align="center" inlineAlign="center">
            <ConfettiExplosion width={2000} height={1000} duration={3000} zIndex={1000000} />
            <Text tone="magic" variant="headingLg" as="div">
              <div style={{ fontSize: "30px", fontWeight: "bold", color: "rgb(234 53 114)" }}>
                🎊Congratulations!!🎊
              </div>
            </Text>
          </BlockStack>
          <InlineStack align="center">
            <Text as="div">
              <div style={{ fontSize: "20px" }}>
                You've been granted{" "}
                <span style={{ fontSize: "24px", fontWeight: "bold", color: "#2ecc71" }}>{extendDays} days</span>{" "}
                extra free trial!
              </div>
            </Text>
          </InlineStack>
          <InlineStack align="center" gap={100} blockAlign="center">
            <Text as="div">When you click on</Text>
            <Text as="div" fontWeight="bold" variant="headingMd" tone="magic">
              Extend Trial
            </Text>
            <Text as="div">your recent plan will automatically cancel and you'll get a new</Text>
            <Text as="div" fontWeight="bold" variant="headingMd" tone="magic">
              {extendDays}-day
            </Text>
            <Text as="div">extended trial period.</Text>
            <Text as="div">This is a</Text>
            <Text as="div" fontWeight="bold" variant="headingMd" tone="magic">
              One-time offer
            </Text>
            <Text as="div">and cannot be repeated.</Text>
          </InlineStack>

          <div className="benefits-list">
            <Text tone="inherit">What you'll keep:</Text>
            {discountFeatures?.map(
              (feature, index) =>
                index !== 1 && (
                  <InlineStack gap={100} key={index}>
                    <div>
                      <Icon source={CheckIcon} tone="success" />
                    </div>
                    <Text tone="inherit" fontWeight="regular">
                      {feature}
                    </Text>
                  </InlineStack>
                )
            )}
          </div>
        </BlockStack>
      )}
      <br />
      <div className="action-buttons">
        {!(minuteTrialText && activatedPlan?.offerTrialDays > 0) && (
          <Button onClick={extendTrialAction} variant="primary">
            🎊 Extend {extendDays}-day Free Trial 🎊
          </Button>
        )}
        <Button onClick={goToNextStep} variant="primary" tone="magic">
          Continue to Cancel
        </Button>
      </div>
    </div>
  );
};

const getDiscountFromReason = {
  noLongerNeeded: 20,
  dontWork: 20,
  costConcerns: 20,
  technicalIssues: 20,
  foundAlternative: 20,
  complexity: 20,
  lackFeatures: 20,
  poorCustomerSupport: 20,
  businessClosure: 20,
  temporaryPause: 20,
  performanceIssues: 20,
  other: 20,
};

const getDiscountFromReasonYearly = {
  noLongerNeeded: 50,
  dontWork: 50,
  costConcerns: 50,
  technicalIssues: 50,
  foundAlternative: 50,
  complexity: 50,
  lackFeatures: 50,
  poorCustomerSupport: 50,
  businessClosure: 50,
  temporaryPause: 50,
  performanceIssues: 50,
  other: 50,
};

// const steps = (trial, activatedPlan, minuteTrialText) => [
//   ...((trial > 0 && activatedPlan?.offerTrialDays <= 0) ||
//   (minuteTrialText && minuteTrialText?.includes("trial left"))
//     ? [{ id: "trialExtend" }]
//     : []),
//   { id: "reason" },
//   { id: "support" },
//   { id: "discount" },
// ];

const steps = (trial, activatedPlan, minuteTrialText) => [{ id: "reason" }];

export default function PlanCancelModel({
  cancelRecurringPlan,
  cancelPlanPopup,
  setCancelPlanPopup,
  selectedPlan,
  upgradePlan,
  alreadyGivenDiscount,
  profileData,
  trialDays,
  activatedPlan,
  minuteTrialText,
}) {
  const formRef = useRef();
  const { sendNewMessage } = useCustomerly();
  const { showToast } = useContext(ToastContext);
  const [stepCount, setStepCount] = useState(0);
  const [formValues, setFormValue] = useState(cancelReasonInitialValues);
  const fetch = useAuthenticatedFetch();
  const currentStep = useMemo(
    () => steps(trialDays, activatedPlan, minuteTrialText)?.[stepCount]?.id,
    [stepCount, trialDays, activatedPlan, minuteTrialText]
  );
  const [reasonError, setReasonError] = useState();
  const extendDays = 30;
  const discountValue = useMemo(() => {
    let baseDiscount = getDiscountFromReason[formValues?.cancelReason?.reason];
    if (selectedPlan.billingInterval === "Year") {
      baseDiscount = getDiscountFromReasonYearly[formValues?.cancelReason?.reason];
    }
    return alreadyGivenDiscount > baseDiscount ? alreadyGivenDiscount : baseDiscount;
  }, [formValues?.cancelReason?.reason, alreadyGivenDiscount]);

  const discountedPlan = useMemo(() => {
    const discountAppliedPrice = selectedPlan.monthlyPrice ? selectedPlan.monthlyPrice : selectedPlan.price;
    if (discountValue) {
      return {
        ...selectedPlan,
        discountLabel: discountValue ? `${discountValue}%` : null,
        discountObject: { code: null, type: "percentage", value: discountValue },
        discountValue: null,
        discountPercent: discountValue,
        finalPrice: Math.floor(discountAppliedPrice * (1 - discountValue / 100) * 100) / 100,
      };
    } else return selectedPlan;
  }, [selectedPlan, discountValue]);

  const upgradePlanAction = useCallback(async () => {
    closePopup();
    const newPlan = { ...discountedPlan, offerTrialDays: 0, upgradeManual: false };
    upgradePlan(newPlan);

    const info = {
      ...profileData,
      cancellationReason: formValues?.cancelReason?.reason,
      cancellationMessage: formValues?.cancelReason?.value,
      oldPlanDiscount: activatedPlan.discountValue,
      newDiscount: `${discountValue}%`,
    };

    const topic = `User clicked on Upgrade Plan from the cancellation flow`;
    const message = slackMessageForPricing(topic, info);
    if (message) await fetch.post(`/slack-channel-message`, { message, channelType: "priceChannel" }, false); // add plan cancel channel name
  }, [discountedPlan, formValues, activatedPlan, discountValue, trialDays]);

  const extendTrialAction = useCallback(async () => {
    closePopup();
    const newPlan = {
      ...discountedPlan,
      extendTrialCode: "TR3IA0ALE",
      offerTrialDays: extendDays,
      upgradeManual: false,
    };
    upgradePlan(newPlan);

    const info = {
      ...profileData,
      cancellationReason: formValues?.cancelReason?.reason,
      cancellationMessage: formValues?.cancelReason?.value,
      oldPlanDiscount: activatedPlan.discountValue,
      newDiscount: `${extendDays} Days`,
    };

    const topic = `User's trial extend from the cancellation flow`;
    const message = slackMessageForPricing(topic, info);
    if (message) await fetch.post(`/slack-channel-message`, { message, channelType: "priceChannel" }, false);
  }, [discountedPlan, formValues, activatedPlan, extendDays, trialDays]);

  const goToNextStep = useCallback(async () => {
    const currentStepId = steps(trialDays, activatedPlan, minuteTrialText)?.[stepCount]?.id;
    if (currentStepId === "reason" && formValues?.cancelReason?.reason === "") {
      setReasonError(t(`common.Please Select One Option`));
    } else {
      setReasonError();
      setStepCount((prev) => prev + 1);
    }
  }, [stepCount, formValues, trialDays, activatedPlan, minuteTrialText]);

  const goToPreviousStep = useCallback(() => {
    if (stepCount !== 0) setStepCount((prev) => prev - 1);
  }, [stepCount]);

  const openSupportChatBox = useCallback(async () => {
    let reason = cancelReasonOptions?.find((item) => item?.value === formValues?.cancelReason?.reason)?.label;
    if (formValues?.cancelReason?.reason === "other") reason = formValues?.cancelReason?.value;

    let msg = `I would like to cancel my plan due to ${reason}.\n
Could you please assist me with this?`;

    if (currentStep === "trialExtend") {
      msg = `I would like to cancel my plan.\n
      Could you please assist me with this?`;
    }

    sendNewMessage(msg);
    closePopup();
  }, [profileData, formValues, currentStep]);

  const handleCancelPlan = useCallback(() => {
    cancelRecurringPlan(formValues);
    closePopup();
  }, [formValues]);

  const closePopup = useCallback(() => {
    setCancelPlanPopup(false);
    setStepCount(0);
    setFormValue(cancelReasonInitialValues);
  }, []);

  useEffect(() => {
    if (currentStep === "trialExtend") setFormValue(cancelReasonInitialValues);
  }, [currentStep]);

  return (
    <>
      <Modal
        open={cancelPlanPopup}
        onClose={closePopup}
        title={t(`common.We're sorry to see you go!`)}
        primaryAction={
          // currentStep === "reason" && { content: t(`common.Continue to cancel`), onAction: goToNextStep }
          currentStep === "reason" && {
            content: t(`common.Cancel Plan`),
            onAction: () => {
              if (formValues?.cancelReason?.reason === "") {
                setReasonError(t(`common.Please Select One Option`));
              } else {
                setReasonError();
                handleCancelPlan();
              }
            },
          }
        }
        secondaryActions={
          stepCount == 1 && currentStep === "reason" && [{ content: t(`common.Back`), onAction: goToPreviousStep }]
        }
        footer={currentStep === "reason" && reasonError && <InlineError message={reasonError} />}
      >
        <Modal.Section>
          <BlockStack gap={800}>
            {currentStep === "trialExtend" && (
              <TrialDaysStep
                extendDays={extendDays}
                goToNextStep={goToNextStep}
                extendTrialAction={extendTrialAction}
                minuteTrialText={minuteTrialText}
                activatedPlan={activatedPlan}
              />
            )}

            {currentStep === "reason" && (
              <ReasonStep formRef={formRef} formValues={formValues} setFormValue={setFormValue} />
            )}
            {currentStep === "support" && (
              <SupportStep
                openSupportChatBox={openSupportChatBox}
                goToPreviousStep={goToPreviousStep}
                goToNextStep={goToNextStep}
              />
            )}
            {currentStep === "discount" && (
              <DiscountStep
                discountValue={discountValue}
                selectedPlan={discountedPlan}
                handleCancelPlan={handleCancelPlan}
                goToPreviousStep={goToPreviousStep}
                upgradePlanAction={upgradePlanAction}
                showButton={true}
              />
            )}
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
}
