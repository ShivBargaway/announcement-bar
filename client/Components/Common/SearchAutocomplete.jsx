import { memo, useCallback, useEffect, useState } from "react";
import { Autocomplete, Icon } from "@shopify/polaris";
import { BlogIcon, CollectionIcon, PageIcon, ProductIcon, SearchIcon } from "@shopify/polaris-icons";
import debounce from "lodash/debounce";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { objectToQueryParams } from "@/Utils/Index";

function SearchAutocomplete(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch = useAuthenticatedFetch();
  const {
    form: { setFieldTouched },
    field: { name, initialQueryParams = {} },
  } = props;

  const fetchResults = async (query) => {
    let queryParams = {};
    if (props?.subtype?.length > 0) queryParams = { resource: props?.subtype, query };

    const searchQuery = objectToQueryParams({ ...queryParams, ...initialQueryParams });
    const response = await fetch.get(`searchShopify${searchQuery}`, false);
    const results = [];
    props.subtype.map((type) =>
      response?.data[type + "s"]?.map((node) =>
        results.push({
          ...node,
          type: type,
          title: node.title,
          id: node.id,
          label: type.toUpperCase() + " - " + node.title,
          value: node.id,
          handle: node.handle,
          originalSrc: node.featured_image ? node.featured_image.url : node.originalSrc,
          description: node.featured_image ? node?.body?.replace(/<[^>]*>/g, "") : node?.description,
          media: loadMedia(type + "s"),
        })
      )
    );
    return results;
  };

  const loadMedia = (type) => {
    if (type === "products") {
      return <Icon source={ProductIcon} />;
    }
    if (type === "collections") {
      return <Icon source={CollectionIcon} />;
    }
    if (type === "articles") {
      return <Icon source={BlogIcon} />;
    }
    if (type === "pages") {
      return <Icon source={PageIcon} />;
    }
  };

  useEffect(() => {
    setSelectedOptions([props?.value]);
    setInputValue(props?.value?.label || "");
    updateText("");
  }, []);

  const updateText = useCallback(
    async (value) => {
      if (!loading) {
        setLoading(true);
      }

      let result = await fetchResults(value);
      setLoading(false);
      delete result.media;
      setOptions(result);
    },
    [loading, options]
  );

  useEffect(() => {
    props.form.setFieldValue(props.field.name, selectedOptions[0]);
  }, [selectedOptions]);

  const updateSelection = useCallback(
    (selected) => {
      const selectedOption = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.toString().match(selectedItem);
        });
        return matchedOption && matchedOption;
      });
      delete selectedOption.media;
      setSelectedOptions(selectedOption);
      setInputValue(selectedOption[0].label || "");
    },
    [options]
  );

  const searchDebounced = useCallback(debounce(updateText, 500), [updateText]);

  const textField = (
    <Autocomplete.TextField
      {...props}
      onChange={(value) => {
        setInputValue(value);
        searchDebounced(value);
      }}
      label={props.label}
      value={inputValue}
      prefix={<Icon source={SearchIcon} tone="base" />}
      placeholder={props.placeholder}
      autoComplete="off"
      disabled={props.disabled}
      onBlur={() => {
        setFieldTouched(name, true);
      }}
    />
  );

  return (
    <div>
      <Autocomplete
        options={options}
        selected={selectedOptions}
        onSelect={updateSelection}
        loading={loading}
        textField={textField}
      />
    </div>
  );
}

export default memo(SearchAutocomplete);
