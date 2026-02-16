import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Text } from "@shopify/polaris";
import { t } from "i18next";
import { BannerModal } from "@/Components/Common/BannerModal";

const Switch = ({
  onLabel,
  offLabel,
  checked,
  onChange,
  switchColor,
  switchWidth,
  label,
  helpText,
  labelPosition,
  isBannerEnabled = false,
  bannerTitle,
  bannerSubTitle,
  disabled,
  fontWeight,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isOn, setIsOn] = useState(checked);
  const { t } = useTranslation();

  useEffect(() => {
    setIsOn(checked);
  }, [checked]);

  const handleConfirmationClose = useCallback(() => {
    setShowConfirmation(!showConfirmation);
  }, [showConfirmation]);

  const handleConfirmationSubmit = useCallback(() => {
    setIsOn(!isOn);
    onChange(!isOn);
    handleConfirmationClose();
  }, [isOn, handleConfirmationClose]);

  const toggle = useCallback(() => {
    if (!isOn && isBannerEnabled) setShowConfirmation(true);
    else {
      setIsOn(!isOn);
      onChange(!isOn);
    }
  }, [isOn, isBannerEnabled]);

  return (
    //TODO: Make it more dynamic labels
    <BlockStack gap="100">
      <div className={`switch-container ${labelPosition}`}>
        <div
          className={`switch ${isOn ? "on" : "off"} `}
          style={{
            backgroundColor: isOn ? switchColor : "#ccc",
            width: switchWidth,
            opacity: disabled ? 0.3 : 1,
          }}
        >
          <input
            type="checkbox"
            className="switch-checkbox"
            checked={isOn}
            onChange={toggle}
            disabled={disabled}
          />
          <div className="switch-circle"></div>
          <label className="switch-label">{isOn ? t(`common.${onLabel}`) : t(`common.${offLabel}`)}</label>
        </div>
        <Text variant="headingMd" as="h4" fontWeight={fontWeight || "medium"} color={disabled ? "subdued" : ""}>
          {label}
        </Text>
      </div>
      {helpText && (
        <Text tone="subdued" as="span">
          {helpText}
        </Text>
      )}
      <BannerModal
        open={showConfirmation}
        onClose={handleConfirmationClose}
        primaryAction={{
          content: t("common.Confirm"),
          destructive: true,
          onAction: handleConfirmationSubmit,
        }}
        secondaryActions={[
          {
            content: t("common.Cancel"),
            onAction: handleConfirmationClose,
          },
        ]}
        title={bannerTitle}
        subtitle={bannerSubTitle}
      />
    </BlockStack>
  );
};

Switch.defaultProps = {
  onLabel: "On",
  offLabel: "Off",
  initialState: true,
  onChange: () => {},
  switchColor: "#4CAF50",
  switchWidth: "48px",
};

export default Switch;
