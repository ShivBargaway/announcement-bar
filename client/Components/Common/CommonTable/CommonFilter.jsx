import { useCallback, useEffect, useRef, useState } from "react";
import { IndexFilters } from "@shopify/polaris";
import debounce from "lodash/debounce";
import CommonForm from "@/Components/Common/CommonForm";
import { makeAdvanceFilterLabel } from "../../../Utils/Utils";

export default function CommonFilter(props) {
  const {
    filterFormFields,
    filters,
    setFilters,
    setPagination,
    searchKey = "",
    pinnedFilter = [],
    currentTabData,
  } = props;

  const initialPagination = { page: 1, pageSize: 10 };
  const formRef = useRef();
  const [queryValue, setQueryValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [mode, setMode] = useState("FILTERING");

  useEffect(() => {
    const foundSearch = filters.find((e) => e.key === "searchQuery");
    setQueryValue(foundSearch?.value || "");
  }, [filters]);

  const handleFiltersQueryChange = useCallback(
    (value) => {
      const filterObj = {
        filterType: "searchQuery",
        nestedKey: searchKey,
      };
      if (value) handleFilterChange({ searchQuery: value }, filterObj); // add searchQuery in filter
      else handleFilterRemove("searchQuery"); // remove searchQuery from array
      setQueryValue(value);
    },
    [filters]
  );

  const handleQueryValueRemove = useCallback(() => setQueryValue(""), []);

  const handleFiltersClearAll = useCallback(() => {
    const searchQueryFilter = filters?.filter((e) => e?.tabQuery || e?.key === "searchQuery");
    if (searchQueryFilter) {
      setFilters([...searchQueryFilter]); //remain search query when filter clear
    } else {
      setFilters([]);
    }
  }, [filters]);

  //call from common form and push that value in filter array
  const handleFilterChange = useCallback(
    debounce((changedFilter, initialValue) => {
      const { filterType, nestedKey, label, dynamicLabel } = initialValue;
      const [key, value] = Object.entries(changedFilter)[0]; //separate key and value from object
      if (!isEmpty(value)) {
        const existingFilterIndex = filters.findIndex((filter) => filter.key === key); // find if object is exist in filter array
        if (existingFilterIndex !== -1) {
          const updatedFilters = [...filters];
          updatedFilters[existingFilterIndex] = {
            key,
            value,
            type: filterType || "string",
            nestedKey,
            label,
            dynamicLabel,
          }; // modify exist object
          setFilters(updatedFilters);
        } else {
          setFilters([...filters, { key, value, type: filterType || "string", nestedKey, label, dynamicLabel }]); // push new object
        }
      } else {
        handleFilterRemove(key);
      }

      setPagination(initialPagination);
    }, 500),
    [filters]
  );

  const handleFilterRemove = useCallback(
    (keyToRemove) => {
      const updatedFilters = filters.filter(({ key }) => key !== keyToRemove); // remove object from array
      setFilters(updatedFilters);
      setPagination(initialPagination);
    },
    [filters]
  );

  const getFormValueFromArray = filters.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  //make filter's form field
  const filterField = filterFormFields
    ?.map((value) => {
      return {
        key: value.key,
        label: value.label,
        filter: (
          <CommonForm
            formRef={formRef}
            initialValues={{ [value.key]: getFormValueFromArray[value.key] || value?.initialValue }} // find value from array
            onFormChange={(e) => handleFilterChange(e, value)}
            formFields={value.formFields}
            isSave={false}
          />
        ),
        pinned: pinnedFilter.includes(value?.key),
      };
    })
    ?.filter((e) => !currentTabData?.hideFilter?.includes(e?.key));

  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    } else {
      return value === "" || value == null;
    }
  }

  useEffect(() => {
    //make filter for shopify field
    const tempAppliedFilters = filters
      .filter((val) => !isEmpty(val.value) && !val?.tabQuery)
      .map(({ key, value, label, dynamicLabel }) => ({
        key,
        label: makeAdvanceFilterLabel(value, label, dynamicLabel),
        onRemove: () => handleFilterRemove(key),
      }));
    setAppliedFilters(tempAppliedFilters);
  }, [filters]);

  return (
    <IndexFilters
      {...props}
      filters={filterField || []}
      appliedFilters={appliedFilters}
      queryValue={queryValue}
      onQueryChange={handleFiltersQueryChange}
      onQueryClear={() => handleFiltersQueryChange("")}
      onClearAll={handleFiltersClearAll}
      tabs={[]}
      canCreateNewView={false}
      mode={mode}
      setMode={setMode}
    />
  );
}
