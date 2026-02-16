import { useCallback, useEffect, useMemo, useState } from "react";
import { Autocomplete, BlockStack, Icon } from "@shopify/polaris";
import { SearchIcon } from "@shopify/polaris-icons";
import { getValueFromNestedObject } from "@/Utils/Index";

const SearchableSelect = (props) => {
  const {
    options,
    form: { values, setFieldValue, setFieldTouched },
    field: { name, label, placeholder },
  } = props;

  const value = getValueFromNestedObject(values, name);

  const deselectedOptions = useMemo(() => [...options], []);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const selectedValue = deselectedOptions.filter((option) => option.value === value);
    return selectedValue || [];
  });
  const [inputValue, setInputValue] = useState(value || "");
  const [availableOptions, setAvailableOptions] = useState(deselectedOptions);

  useEffect(() => {
    if (selectedOptions.length > 0) {
      setFieldValue(name, selectedOptions[0].value || "");
      setInputValue(selectedOptions[0].label);
    }
  }, [selectedOptions]);

  const updateText = useCallback(
    (value) => {
      setInputValue(value);
      setFieldValue(name, value || "");
      if (value === "") {
        setAvailableOptions(deselectedOptions);
        return;
      }
      RegExp.escape = function (s) {
        return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      };

      const escapedValue = RegExp.escape(value);
      const filterRegex = new RegExp(escapedValue, "i");
      const resultOptions = deselectedOptions.filter((option) => option.label.match(filterRegex));
      setAvailableOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const updateSelection = useCallback(
    (selected) => {
      const selectedValue = selected.map((selectedItem) => {
        const matchedOption = availableOptions.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption;
      });
      setSelectedOptions(selectedValue);
    },
    [availableOptions]
  );

  const textField = (
    <Autocomplete.TextField
      {...props}
      onChange={updateText}
      label={label}
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder={placeholder || "Search"}
      autoComplete="off"
      onBlur={() => {
        setFieldTouched(name, true);
      }}
    />
  );

  return (
    <div style={{ height: "auto" }}>
      <BlockStack gap="100">
        <Autocomplete
          options={availableOptions}
          selected={selectedOptions}
          onSelect={updateSelection}
          textField={textField}
        />
      </BlockStack>
    </div>
  );
};

export default SearchableSelect;
