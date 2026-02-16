import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge, BlockStack, Box, Button, Card, Divider, Icon, InlineStack, Text, Tooltip } from "@shopify/polaris";
import { AlertDiamondIcon, CheckCircleIcon, ClockIcon, DiscountIcon } from "@shopify/polaris-icons";
import { promocodeFormFields } from "@/Assets/Mocks/CommonPricing.mock";
import CommonForm from "@/Components/Common/CommonForm";

const Discount = ({ props }) => {
  const {
    plan,
    formRef,
    formValues,
    upgradePlan,
    cancelPlan,
    submitPromocode,
    trialDays,
    profileData,
    urlPromoCode,
    minuteTrialText,
  } = props;
  const [promoFormValue, setPromoFormValue] = useState(formValues);
  const { t } = useTranslation();
  promocodeFormFields[0].placeholder = t(`common.Enter Promocode`);

  let trialText = profileData?.recurringPlanId?.includes(100)
    ? t(`common.No trial days remaining. You have already used the 7-day free trial.`)
    : profileData.trial_days === undefined || trialDays === 7
    ? t(`common.7 days free trial, No Credit card required`)
    : trialDays > 0 && trialDays < 7
    ? `${t("common.Your remaining trial days are")} ${trialDays}. ${t("common.You have used")} ${
        7 - trialDays
      } ${t("common.days.")}`
    : t(`common.No trial days remaining. You have already used the 7-day free trial.`);

  const countDiscount = Math.round(100 - (plan?.finalPrice * 100) / (plan?.monthlyPrice || plan?.price));
  const getPossibleDiscount = plan.discountValue ? plan.discountLabel : countDiscount ? `${countDiscount}%` : null;

  const GetDiscountLine = ({ intervalText }) => {
    return (
      <InlineStack gap="100" blockAlign="center" wrap={false}>
        <Icon source={DiscountIcon} tone="success" />
        <Text as="p" tone="success">
          {getPossibleDiscount}
        </Text>
        <Text as="p" tone="success">
          {intervalText || t(`common.Discount applied`)}
        </Text>
      </InlineStack>
    );
  };

  return (
    <React.Fragment>
      {getPossibleDiscount && (
        <InlineStack blockAlign="center" align="space-between">
          <Text variant="headingSm" as="h3" tone="subdued">
            <span className="line-through">${plan.monthlyPrice ? plan.monthlyPrice : plan.price}</span>
          </Text>

          <GetDiscountLine />
        </InlineStack>
      )}
      {!plan.isPromoInputHidden && !plan.selected && (
        <InlineStack gap={300} wrap={false}>
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

          <Button small onClick={() => submitPromocode(plan)}>
            {t(`common.Apply`)}
          </Button>
        </InlineStack>
      )}
      {(plan.touched || urlPromoCode) && plan.discountValue && (
        <Text tone="success">
          {t(`common.Your code(s)`)} <b>{plan["discountValue"]}</b>{" "}
          {t(`common.and discount have been applied successfully`)}
        </Text>
      )}
      {plan.touched && !plan.discountValue && !promoFormValue?.promocode && (
        <InlineStack gap="200" blockAlign="center" wrap={false}>
          <Icon source={AlertDiamondIcon} tone="critical" />
          <Text tone="critical"> {t(`common.Your entered promocode is not correct, Enter a valid code`)}</Text>
        </InlineStack>
      )}

      {plan.selected && plan.type === "recurring" && (
        <InlineStack align="space-between" blockAlign="center">
          <InlineStack gap={100} blockAlign="center" wrap={false}>
            <Icon source={ClockIcon} tone="base" />
            <Text as="p">
              {minuteTrialText} {t(`common.trial left`)}
            </Text>
          </InlineStack>
        </InlineStack>
      )}
      {plan.type === "recurring" &&
        (plan?.disableActiveButton ? (
          <Tooltip content={t("common.disableButtonTooltip")} width="wide">
            <Button variant="primary" fullWidth disabled={true}>
              {t("common.Upgrade your plan now")}
            </Button>
          </Tooltip>
        ) : (
          <Button
            variant="primary"
            fullWidth
            onClick={() => (plan.selected ? cancelPlan(plan) : upgradePlan(plan))}
          >
            {plan.trial && !plan.selected
              ? trialDays === 0 && profileData.trial_days !== undefined
                ? t("pricing.Upgrade your plan now")
                : `${t("common.Start")} ${profileData.trial_days === undefined ? plan.trial.days : trialDays} ${t(
                    "pricing.Day Free Trial"
                  )}`
              : t(`common.Cancel Plan`)}
          </Button>
        ))}
      {plan.type === "onetime" && !plan.selected && (
        <Button variant="primary" fullWidth onClick={() => upgradePlan(plan)}>
          {t(`common.Upgrade`)}
        </Button>
      )}
      {plan.trial && plan.intervalLable !== "Unlimited" && !plan.selected && (
        <Text variant="headingSm" as="h6" alignment="center">
          {trialText}
        </Text>
      )}
    </React.Fragment>
  );
};

export default function SinglePlan(props) {
  const { t } = useTranslation();
  const { plan } = props;
  return (
    <div
      className={`pricing-card`}
      style={
        plan?.selected
          ? {
              border: "2px solid #008060",
              borderRadius: "15px",
              boxShadow: "0 0 .3125rem #aee9d1,0 .0625rem .125rem #aee9d1",
            }
          : {}
      }
    >
      <Card padding="400" background={"bg-surface"}>
        <BlockStack gap="400">
          <InlineStack blockAlign="center" align="space-between">
            <Text variant="headingLg" as="h2">
              {plan.name}
            </Text>
            {plan.selected && (
              <Badge tone="success">
                <Text variant="bodyMd">{t(`common.Current`)}</Text>
              </Badge>
            )}
          </InlineStack>
          <InlineStack blockAlign="center" gap="100">
            <Text variant="heading2xl" as="h3">
              ${plan.finalPrice}
            </Text>
            {plan.intervalLable && (
              <Text variant="headingSm" as="h6" tone="subdued">
                /{t(`common.${plan.intervalLable}`)}
              </Text>
            )}
          </InlineStack>
          {plan.price !== 0 ? <Discount props={props} /> : <Box minHeight="100px"></Box>}
          <Divider></Divider>
          <BlockStack gap="400">
            {plan.features.map((feature, index) => (
              <InlineStack gap="200" key={index} blockAlign="center" wrap={false}>
                <Icon size="large" source={CheckCircleIcon} tone="success" className="custom-icon" />
                {feature.dynamic ? (
                  <Text wrap as="p">
                    {eval(feature.dynamicText)} {t(`common.${feature.text}`)}
                  </Text>
                ) : (
                  <Text wrap as="p">
                    {t(`common.${feature.text}`)}
                  </Text>
                )}
              </InlineStack>
            ))}
          </BlockStack>
        </BlockStack>
      </Card>
    </div>
  );
}
