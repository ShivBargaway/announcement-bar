import React, { useCallback, useEffect, useState } from "react";
import { Text } from "@shopify/polaris";
import FontPicker from "@techstack/font-picker-react";
import { getValueFromNestedObject } from "@/Utils/Index";

export default function Fontpicker(props) {
  const {
    form: { values, setFieldValue },
    field: { name, sort, label },
  } = props;
  const value = getValueFromNestedObject(values, name);
  const [inputValue, setInputValue] = useState(value);
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const onFormChange = (e) => {
    setInputValue(e.family);
  };
  useEffect(() => {
    setFieldValue(name, inputValue);
  }, [inputValue, name, setFieldValue]);

  return (
    <>
      <Text>{label}</Text>
      <FontPicker
        apiKey={process.env.GOOGLE_FONT_KEY}
        activeFontFamily={inputValue}
        onChange={onFormChange}
        sort={sort}
      />
    </>
  );
}
