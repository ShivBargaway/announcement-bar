import React, { useEffect, useState } from "react";
import { BlockStack, Text } from "@shopify/polaris";
import CodeMirror from "@uiw/react-codemirror";
import { getValueFromNestedObject } from "@/Utils/Index";

export default function Codemirror(props) {
  const {
    form: { values, setFieldValue },
    field: { name, label, height, width, theme, helpText },
  } = props;
  const value = getValueFromNestedObject(values, name);
  const [inputValue, setInputValue] = useState(value);
  const onFormChange = (e) => {
    setInputValue(e);
  };
  useEffect(() => {
    setFieldValue(name, inputValue);
  }, [inputValue]);
  return (
    <BlockStack>
      <Text as="div">{label}</Text>
      <CodeMirror value={inputValue} height={height} onChange={onFormChange} width={width} theme={theme} />
      <Text as="div">{helpText}</Text>
    </BlockStack>
  );
}
