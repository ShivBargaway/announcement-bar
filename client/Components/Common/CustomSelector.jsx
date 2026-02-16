import React, { useCallback, useEffect, useState } from "react";
import { ActionList, BlockStack, Button, Icon, Popover, Text } from "@shopify/polaris";
import { CheckSmallIcon } from "@shopify/polaris-icons";
import { getValueFromNestedObject } from "@/Utils/Index";

export default function CustomSelector(props) {
  const {
    form: { values, setFieldValue },
    field: { name, options, label },
    disabled,
  } = props;
  const value = getValueFromNestedObject(values, name);
  const [inputValue, setInputValue] = useState(value);
  const [inputLabel, setInputLabel] = useState(options?.find((e) => e.value === value)?.label);
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const setItemValue = (e) => {
    setInputValue(e?.value);
    setInputLabel(e?.label);
  };

  const activator = (
    <Button onClick={toggleActive} fullWidth disclosure="select" textAlign="left" disabled={disabled}>
      {inputLabel}
    </Button>
  );

  const makeItem = options?.map((e) => ({
    content: e.label,
    onAction: () => setItemValue(e),
    active: inputValue === e?.value,
    disabled: e?.disabled,
    suffix: inputValue === e?.value && <Icon source={CheckSmallIcon} />,
  }));

  useEffect(() => {
    setFieldValue(name, inputValue);
  }, [inputValue]);

  return (
    <div className="custom_selector_container">
      <BlockStack gap={100}>
        {label && <Text>{label}</Text>}
        <Popover
          active={active}
          activator={activator}
          autofocusTarget="first-node"
          onClose={toggleActive}
          fullWidth
        >
          <ActionList actionRole="menuitem" items={makeItem} />
        </Popover>
      </BlockStack>
    </div>
  );
}
