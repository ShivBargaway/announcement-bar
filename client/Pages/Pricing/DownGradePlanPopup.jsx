import React, { useCallback, useMemo } from "react";
import { BlockStack, Button, Icon, InlineStack, Modal, Text } from "@shopify/polaris";
import { DiscountFilledIcon, ThumbsUpIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { slackMessageForPricing } from "@/Utils/Index";
import { DiscountStep } from "./PlanCancelModel";

export default function DownGradePlanPopup({
  downGradeModal,
  setDownGradeModal,
  planForActive,
  selectedPlan,
  activatedPlan,
  profileData,
  trialDays,
  fetch,
  upgradePlan,
}) {
  const discountValue = 50;

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
  }, [selectedPlan]);

  const newPlanOrgPrice = useMemo(() => {
    return planForActive.monthlyPrice ? planForActive.monthlyPrice : planForActive.price;
  }, [planForActive]);

  const selectPlanOrgPrice = useMemo(() => {
    return discountedPlan.monthlyPrice ? discountedPlan.monthlyPrice : discountedPlan.price;
  }, [discountedPlan]);

  const closeDowngrade = () => {
    setDownGradeModal(false);
  };

  const upgradePlanAction = useCallback(async () => {
    closeDowngrade();
    const newPlan = { ...discountedPlan, offerTrialDays: 0, upgradeManual: false };
    upgradePlan(newPlan);

    const info = {
      ...profileData,
      oldPlanDiscount: activatedPlan.discountValue,
      newDiscount: `${discountValue}%`,
    };

    const topic = `User clicked on Upgrade Plan from downgrade options`;
    const message = slackMessageForPricing(topic, info);
    if (message) await fetch.post(`/slack-channel-message`, { message, channelType: "priceChannel" }, false);
  }, [discountedPlan, activatedPlan, discountValue, profileData, trialDays]);

  const downGradePlan = useCallback(async () => {
    closeDowngrade();
    const newPlan = { ...planForActive, skipDowngrade: true };
    upgradePlan(newPlan, planForActive?.isSkipTrial);

    const info = {
      ...profileData,
      oldPlanDiscount: activatedPlan?.discountValue,
      newDiscount: `${planForActive?.discountPercent}%`,
    };

    const topic = `:cry::cry: [User clicked on DownGrade Plan] - ${planForActive?.name}`;
    const message = slackMessageForPricing(topic, info);
    if (message) await fetch.post(`/slack-channel-message`, { message, channelType: "priceChannel" }, false);
  }, [planForActive, trialDays, profileData, activatedPlan]);

  const DiscountLine = ({ orgPrice, plan }) => (
    <InlineStack blockAlign="center" align="end" gap={100}>
      <div>
        <Icon source={DiscountFilledIcon} />
      </div>
      <Text tone="subdued" textDecorationLine="line-through" as="div" fontWeight="bold">
        ${orgPrice}
      </Text>
      <Text tone="subdued" fontWeight="bold">
        ${plan?.finalPrice}/Month
      </Text>
      {plan?.billingInterval === "Year" && (
        <Text tone="subdued" textDecorationLine="line-through" as="div" fontWeight="bold">
          and ${orgPrice * 12}
        </Text>
      )}
      {plan?.billingInterval === "Year" && (
        <Text tone="subdued" fontWeight="bold">
          ${(plan?.finalPrice * 12).toFixed(2)}/Year
        </Text>
      )}
    </InlineStack>
  );

  return (
    <div>
      <Modal
        open={downGradeModal}
        onClose={closeDowngrade}
        title={"🚀 Exclusive Limited-Time Offer – Just For You!"}
      >
        <Modal.Section>
          <BlockStack gap={300}>
            <DiscountStep
              discountValue={discountValue}
              selectedPlan={discountedPlan}
              UpgradeButton={
                <BlockStack gap={100}>
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <Button onClick={upgradePlanAction} variant="primary" fullWidth>
                      <InlineStack gap={100} align="center" blockAlign="center">
                        {t(`common.Upgrade current plan`)} ({activatedPlan?.planName}) {t(`common.with`)}{" "}
                        {discountValue}% {t(`common.discount`)}
                      </InlineStack>
                    </Button>

                    <div className="most-popular-badge">
                      <InlineStack>
                        {t(`common.Recommended`)} <Icon source={ThumbsUpIcon} />
                      </InlineStack>
                    </div>
                  </div>
                  <DiscountLine plan={discountedPlan} orgPrice={selectPlanOrgPrice} />
                </BlockStack>
              }
            />
            <BlockStack gap={100}>
              <Button variant="primary" onClick={downGradePlan} fullWidth>
                <InlineStack gap={100} align="center" blockAlign="center">
                  <Text alignment="center">
                    {t(`common.Upgrade`)} ({planForActive?.name}) {t(`common.plan`)}
                  </Text>
                  {!planForActive?.discountPercent ? (
                    <Text>${planForActive.finalPrice}/Month</Text>
                  ) : (
                    <Text>
                      with {planForActive?.discountPercent}% {t(`common.discount`)}
                    </Text>
                  )}
                </InlineStack>
              </Button>
              {planForActive?.discountPercent && <DiscountLine plan={planForActive} orgPrice={newPlanOrgPrice} />}
            </BlockStack>

            <Text />
          </BlockStack>
        </Modal.Section>
      </Modal>
    </div>
  );
}
