import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Box, Button, ColorPicker, InlineStack, Popover, TextField } from "@shopify/polaris";
import convert from "color-convert";
import { getValueFromNestedObject } from "@/Utils/Index";

function ColorPickerCircle(props) {
  const {
    form: { values, setFieldValue },
    field: { name, label, size },
  } = props;
  const value = getValueFromNestedObject(values, name);
  const { t } = useTranslation();

  const [popoverActive, setPopoverActive] = useState(false);
  const [color, setColor] = useState({
    hue: 0,
    brightness: 1,
    saturation: 0,
  });
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
    handleHexChange(value);
  }, [value]);

  useEffect(() => {
    setFieldValue(name, inputValue);
  }, [inputValue]);

  const handleHexChange = useCallback((newHexColor) => {
    setInputValue(newHexColor);

    if (/^#([0-9A-F]{3}){1,2}$/i.test(newHexColor)) {
      const [hue, sat, bright] = convert.hex.hsv(newHexColor.replace("#", ""));
      setColor({ hue, saturation: sat / 100, brightness: bright / 100 });
    }
  }, []);

  const handleColorChange = useCallback((newColor) => {
    setColor(newColor);
    setInputValue("#" + convert.hsv.hex([newColor.hue, newColor.saturation * 100, newColor.brightness * 100]));
  }, []);

  const togglePopoverActive = useCallback(() => setPopoverActive((popoverActive) => !popoverActive), []);

  const activator = (
    <div
      onClick={togglePopoverActive}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `hsl(${color.hue}, ${Math.round(color.saturation * 100)}%, ${Math.round(
          color.brightness * 100
        )}%)`,
        cursor: "pointer",
        border: "2px solid #d0d0d0",
        display: "inline-block",
      }}
    />
  );

  return (
    <InlineStack gap="200" align="start" blockAlign="center" spacing="extraTight">
      {activator}
      <span>{label}</span>
      <Popover active={popoverActive} activator={<div></div>} onClose={togglePopoverActive}>
        <Box padding="400">
          <BlockStack gap="400" align="space-around">
            <ColorPicker color={color} onChange={handleColorChange} />
            <TextField label={label} value={inputValue} onChange={handleHexChange} />
            <Button onClick={togglePopoverActive}>{t("common.Done")}</Button>
          </BlockStack>
        </Box>
      </Popover>
    </InlineStack>
  );
}

export default ColorPickerCircle;
