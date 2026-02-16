import React, { useCallback, useState } from "react";
import { Badge, BlockStack, Box, Button, Icon, InlineStack, Link, Modal, Text, Tooltip } from "@shopify/polaris";
import { AlertCircleIcon, ChevronRightIcon, ClockIcon, DiscountFilledIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { getOfferTrialText, promocodeFormFields } from "@/Assets/Mocks/CommonPricing.mock";
import CommonForm from "@/Components/Common/CommonForm";
import { slackChannelMsg } from "@/Utils/Index";

export default function SinglePlanHeading({
  plan,
  formValues,
  submitPromocode,
  formRef,
  trialDays,
  urlPromoCode,
  profileData,
  minuteTrialText,
  cancelPlan,
  upgradePlan,
  fetch,
  selectedPlan,
}) {
  const [promoFormValue, setPromoFormValue] = useState(formValues);
  const [currentPlan, setCurrentPlan] = useState();
  const [freeTrialModal, setFreeTrialModal] = useState();

  const countDiscount = Math.round(100 - (plan?.finalPrice * 100) / (plan?.monthlyPrice || plan?.price));
  const getPossibleDiscount = plan.discountValue ? plan.discountLabel : countDiscount ? `${countDiscount}%` : null;

  const openFreeTrialModal = useCallback(
    async (plan) => {
      if (plan?.upgradeManual && plan?.offerTrialDays > 0) {
        setFreeTrialModal(true);
        setCurrentPlan(plan);
      } else upgradePlan(plan);
    },
    [trialDays, selectedPlan]
  );

  const closeModal = async () => {
    setFreeTrialModal(false);
    setCurrentPlan();
  };

  const upgradeTrialPlan = useCallback(
    async (plan) => {
      upgradePlan(plan);
      closeModal();
      const slackMsg = `:moneybag::moneybag: [Upgrade plan manually]. ${plan?.offerTrialDays} days free trial`;
      const message = slackChannelMsg(slackMsg, profileData);
      if (message) {
        await fetch.post(`/slack-channel-message`, { message, channelType: "priceChannel" }, false);
      }
    },
    [profileData, trialDays]
  );

  const trialDaysDescription = [
    { title: "✅ No Shopify plan upgrade required", description: "Skip the hassle!" },
    { title: "✅ No charges cut during trial", description: "Your trial is truly free." },
    { title: "✅ Auto-cancellation after trial", description: "No manual upgrades or cancellations needed." },
  ];

  return (
    <BlockStack gap={200} id={plan?.selected ? "selectedPlanColumn" : ""} inlineAlign="center">
      {plan?.offerTrialDays > 0 && !plan.selected && (
        <Badge tone="attention">
          <BlockStack>
            <InlineStack blockAlign="center" align="center">
              <span>
                <Icon source={DiscountFilledIcon} />
              </span>
              <Text fontWeight="bold">{t(`common.Special offer`)}</Text>
            </InlineStack>
            <Text fontWeight="bold">{`${getOfferTrialText(plan?.offerTrialDays)} ${t(
              "common.free trial"
            )} !!`}</Text>
          </BlockStack>
        </Badge>
      )}
      <Text variant="headingMd">{plan?.name}</Text>
      <InlineStack blockAlign="baseLine" align="center" wrap={false}>
        <Text variant="headingLg" as="h3">
          ${plan.finalPrice}
        </Text>
        {plan.intervalLable && (
          <Text variant="bodySm" as="h6">
            /{t(`common.${plan.intervalLable}`)}
          </Text>
        )}
      </InlineStack>

      {getPossibleDiscount && (
        <InlineStack align="center" gap={100} blockAlign="center">
          <Text variant="headingSm" as="h3">
            <span className="line-through">${plan.monthlyPrice ? plan.monthlyPrice : plan.price}</span>
          </Text>
          <div className="discount_badge">
            <Badge tone="info">
              <Text as="p" tone="info" fontWeight="medium">
                {getPossibleDiscount} {t(`common.Discount`)}
              </Text>
            </Badge>
          </div>
        </InlineStack>
      )}

      {plan.selected &&
        (plan.type === "recurring" ? (
          <Button variant="primary" onClick={() => cancelPlan(plan)}>
            {t(`common.Cancel plan`)}
          </Button>
        ) : (
          <Button variant="primary">{t(`common.Current plan`)}</Button>
        ))}

      {!plan?.offerTrialDays > 0 &&
        plan.type === "recurring" &&
        (profileData?.trial_days === undefined || trialDays > 0) && (
          <Tooltip
            content={
              <Box background="bg-surface-emphasis-active" padding={"200"}>
                <InlineStack gap="100" align="center">
                  <Text variant="bodyMd">
                    {t(
                      `common.Skip the trial and receive your credit immediately`
                    )}
                    .{" "}
                    <Link variant="primary" onClick={() => upgradePlan(plan, true)}>
                      {t(`common.Skip the trial and subscribe now`)}
                    </Link>
                  </Text>
                </InlineStack>
              </Box>
            }
          >
            👉{" "}
            <Link variant="primary" onClick={() => upgradePlan(plan, true)}>
              {t(`common.Skip trial`)}
            </Link>
          </Tooltip>
        )}

      {!plan.selected && plan.type === "recurring" && (
        <span>
          <Button variant="primary" onClick={() => openFreeTrialModal(plan)}>
            {plan?.offerTrialDays > 0
              ? `${getOfferTrialText(plan?.offerTrialDays)} ${t("common.free trial")}`
              : trialDays === 0 && profileData?.trial_days !== undefined
              ? t("common.Subscribe")
              : ` ${profileData?.trial_days === undefined ? plan.trial.days : trialDays} ${t(
                  "common.Day free trial"
                )}`}
          </Button>
        </span>
      )}
      {!plan.isPromoInputHidden && !plan.selected && (
        <BlockStack inlineAlign="center" gap={100}>
          <InlineStack gap={100} blockAlign="start" align="center" wrap={false}>
            <BlockStack inlineAlign="center" gap={100}>
              <div className="promocode_form">
                <CommonForm
                  onSubmit={submitPromocode}
                  initialValues={promoFormValue}
                  formFields={promocodeFormFields}
                  formRef={formRef}
                  isSave={false}
                  onFormChange={(e) => setPromoFormValue(e)}
                />
              </div>
              {plan.touched && !plan.discountValue && !promoFormValue?.promocode && (
                <InlineStack blockAlign="center" align="center" gap={100}>
                  <span>
                    <Icon source={AlertCircleIcon} tone="magic" />
                  </span>
                  <Text tone="magic">{t(`common.Invalid code`)}</Text>
                </InlineStack>
              )}
            </BlockStack>
            <div className="submit_promocode">
              <Button small onClick={() => submitPromocode(plan)}>
                <Icon source={ChevronRightIcon} tone="base" />
              </Button>
            </div>
          </InlineStack>

          {(plan.touched || urlPromoCode) && plan.discountValue && (
            <InlineStack blockAlign="center" align="center" gap={100}>
              <Text as="p" tone="success" fontWeight="bold">
                {getPossibleDiscount}
              </Text>
              <Text tone="success">{t(`common.Discount applied`)}</Text>
            </InlineStack>
          )}
        </BlockStack>
      )}

      {plan.selected && plan.type === "recurring" && minuteTrialText && (
        <Badge tone="attention">
          <InlineStack blockAlign="center" wrap={false}>
            <Icon source={ClockIcon} tone="base" />
            <Text as="p" fontWeight="bold">
              {minuteTrialText}
            </Text>
          </InlineStack>
        </Badge>
      )}
      <Modal
        open={freeTrialModal}
        onClose={closeModal}
        title={"🚀 Exclusive Limited-Time Offer – Just For You!"}
        primaryAction={{
          content: `Get ${currentPlan?.offerTrialDays} days free trial`,
          onAction: () => upgradeTrialPlan(currentPlan),
        }}
        secondaryActions={[{ content: "Cancel", onAction: closeModal }]}
      >
        <Modal.Section>
          <BlockStack gap={400}>
            <Text variant="headingMd" as="div">
              <div style={{ fontSize: "15px" }}>Get premium Shopify features WITHOUT upgrading your plan!</div>
            </Text>
            <BlockStack gap={100}>
              <Text fontWeight="bold" as="div">
                <div style={{ fontSize: "14px" }}>Why this offer is special:</div>
              </Text>
              {trialDaysDescription?.map((e, index) => (
                <InlineStack key={index} gap={200}>
                  <Text fontWeight="bold">{e?.title}</Text>
                  <Text fontWeight="bold">-</Text>
                  <Text>{e?.description}</Text>
                </InlineStack>
              ))}
            </BlockStack>
            <BlockStack gap={100}>
              <Text fontWeight="bold">🔥 Risk-free trial with no commitment!</Text>
              <Text>
                ⏰ <b>Limited availability</b> – Claim yours now before it's gone!
              </Text>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
}
