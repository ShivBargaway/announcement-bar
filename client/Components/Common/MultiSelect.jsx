import { useCallback, useEffect, useState } from "react";
import { Autocomplete, InlineStack, Tag } from "@shopify/polaris";
import { getValueFromNestedObject } from "@/Utils/Index";

const MultiSelect = (props) => {
  const {
    options,
    form: { values, setFieldValue },
    field: { name, hasRemoveIndex },
  } = props;

  const value = getValueFromNestedObject(values, name) || [];
  const [selectedOptions, setSelectedOptions] = useState(value || []);
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [removeIndex, setRemoveIndex] = useState();

  const updateText = useCallback((value) => {
    setInputValue(value);
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase()));
    setFilteredOptions(filteredOptions);
  }, []);

  useEffect(() => {
    setFieldValue(name, selectedOptions);
    let data;
    if (hasRemoveIndex) {
      data = {
        selectedOptions: selectedOptions,
        removeIndex: removeIndex,
      };
    } else {
      data = selectedOptions;
    }
    props.onChange && props.onChange(data, props.form);
  }, [selectedOptions, removeIndex]);

  useEffect(() => {
    setFieldValue(name, value);
    setSelectedOptions(value);
  }, [value]);

  const removeTag = useCallback(
    (tag, index) => () => {
      const newSelectedOptions = selectedOptions.filter((option) => option.value !== tag);
      setSelectedOptions(newSelectedOptions);
      setRemoveIndex(index);
    },
    [selectedOptions, removeIndex]
  );

  const verticalContentMarkup =
    selectedOptions.length > 0 ? (
      <InlineStack gap="100" inlineAlign="start">
        {selectedOptions.map((option, index) => {
          let tagLabel = option.label;
          return (
            <Tag key={`option${option.value}`} onRemove={removeTag(option.value, index)}>
              {tagLabel}
            </Tag>
          );
        })}
      </InlineStack>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      {...props.field}
      onChange={updateText}
      value={inputValue}
      verticalContent={verticalContentMarkup}
      autoComplete="off"
    />
  );

  const handleSelectChange = useCallback(
    (selectedValues) => {
      const newSelectedOptions = selectedValues.map((value) => options.find((option) => option.value === value));
      setSelectedOptions(newSelectedOptions);
    },
    [options]
  );

  return (
    <div style={{ height: "auto" }}>
      <Autocomplete
        allowMultiple
        options={filteredOptions}
        selected={selectedOptions.map((option) => option.value)}
        textField={textField}
        onSelect={handleSelectChange}
      />
    </div>
  );
};

export default MultiSelect;
