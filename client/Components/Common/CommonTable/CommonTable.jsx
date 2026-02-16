import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import {
  Card,
  EmptyState,
  IndexTable,
  ResourceList,
  Select,
  Spinner,
  Tabs,
  useIndexResourceState,
} from "@shopify/polaris";
import { t } from "i18next";
import debounce from "lodash/debounce";
import { useAuthenticatedFetch } from "@/Api/Axios";
import * as Images from "@/Assets/Index";
import { getSessionStorageItem, isEmptyArray, objectToQueryParams, setSessionStorageItem } from "@/Utils/Index";
import CommonFilter from "./CommonFilter";

const CommonTable = forwardRef((props, ref) => {
  const {
    isAdd = true,
    isFilterVisible = false,
    isPaginationVisible = true,
    tableData,
    promotedBulkActions,
    setParentFilters,
    parentFilters = [],
    setCount,
    setInitialData,
    localStorageKey,
    handleSubmit,
    showTab = false,
    tabOption = [],
    setParentSelectedTab,
    secondaryTabAction,
    handleParentSelectionChange = false,
    patentSelectedRows = [],
    parentAllRowsSelected = false,
    customizeComponent,
    hasRowChange,
    removeFilter,
    showOnlyPagination,
    isPaginationWithCount = true,
    hideCard = false,
    showLoading = true,
    showSpinner = false,
    extraRowParams,
    addButtonText,
  } = props;

  let localStorageItem;
  if (localStorageKey) localStorageItem = getSessionStorageItem(localStorageKey);
  const currentTabFilter = localStorageItem?.filter?.find?.((e) => e?.tabQuery);
  const [selectedItems, setSelectedItems] = useState([]);
  const [allDataSelectId, setAllDataSelectId] = useState([]);
  const [advanceFilter, setAdvanceFilter] = useState(localStorageItem?.filter || parentFilters);
  const [paginationAction, setPaginationAction] = useState();
  const [itemCount, setItemCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState(currentTabFilter?.tabNumber || 0);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allRowsSelected, setAllRowsSelected] = useState(false);
  const [hasInitialData, setHasInitialData] = useState(false);
  const [apiCall, setApiCall] = useState(true);
  const [isFetchingData, setIsFetchingData] = useState(true);

  const fetch = useAuthenticatedFetch();
  const [pagination, setPagination] = useState(localStorageItem?.pagination || { page: 1, pageSize: 10 });
  const [data, setData] = useState({
    count: 0,
    rows: [],
  });

  const getInitialFilter = (pagination, advanceFilter) => {
    if (!pagination && !advanceFilter) {
      let localStorageItem;
      if (localStorageKey) localStorageItem = getSessionStorageItem(localStorageKey);
      pagination = localStorageItem?.pagination || { page: 1, pageSize: 10 };
      advanceFilter = localStorageItem?.filter || [];
    }
    // setPagination(pagination);
    // setAdvanceFilter(advanceFilter);
    return { pagination, advanceFilter };
  };

  useImperativeHandle(ref, () => ({
    fetchData: async (initialPagination, initialAdvanceFilter) => {
      setIsFetchingData(true);
      const { pagination, advanceFilter } = getInitialFilter(initialPagination, initialAdvanceFilter);
      const queryParams = objectToQueryParams({ ...pagination });
      let response;
      if (isFilterVisible || props.fetchType === "post") {
        response = await fetch.post(
          `${props.url}${queryParams}`,
          { advanceFilter, ...props.queryParam },
          showLoading
        );
      } else {
        response = await fetch.get(`${props.url}${queryParams}`, showLoading);
      }
      if (response.code == 200) {
        setCount && setCount(response.data.count);
        setInitialData && setInitialData({ ...response.data });
        setData({ ...response.data });
      }
      setApiCall(false);
      setIsFetchingData(false);
    },
  }));

  useEffect(() => {
    if (tableData) {
      setData(tableData);
    }
  }, [tableData]);

  const { selectedResources, allResourcesSelected, handleSelectionChange, clearSelection } = useIndexResourceState(
    data.rows
  );

  useEffect(() => {
    if (handleParentSelectionChange) {
      setSelectedRows(patentSelectedRows);
      setAllRowsSelected(parentAllRowsSelected);
    } else {
      setSelectedRows(selectedResources);
      setAllRowsSelected(allResourcesSelected);
    }
  }, [patentSelectedRows, parentAllRowsSelected, selectedResources, allResourcesSelected]);

  useEffect(() => {
    props.clearSelection && clearSelection();
  }, [props.clearSelection]);

  useEffect(() => {
    if (allRowsSelected) {
      setAllDataSelectId(data.rows.map((item) => item.id));
    }
  }, [data.rows, allRowsSelected]);

  useEffect(() => {
    if (handleSubmit) handleSubmit(data.rows, selectedRows, allRowsSelected);
  }, [data.rows, selectedRows, allRowsSelected]);

  const rows = useMemo(() => {
    return props.rowsData(data.rows, allRowsSelected ? allDataSelectId : selectedRows, pagination, extraRowParams);
  }, [data.rows, selectedRows, allDataSelectId, allRowsSelected, hasRowChange, pagination, extraRowParams]);

  useEffect(() => {
    ref.current.fetchData(pagination, advanceFilter);
    setParentFilters && setParentFilters(advanceFilter);
    localStorageKey && setSessionStorageItem(localStorageKey, { pagination, filter: advanceFilter });
  }, [advanceFilter, pagination, props?.url]);

  useEffect(() => {
    removeFilter && setAdvanceFilter([]);
  }, [removeFilter]);

  const itemCountHandler = useCallback(
    debounce((data, selectedData, pagination, pageAction, itemCount) => {
      const parcialDataSelectId = data?.filter((item) => selectedData.includes(item.id)).map((item) => item.id);
      if (parcialDataSelectId?.length === data?.length) {
        setItemCount(selectedData?.length);
      } else {
        if (pageAction === "next" || parcialDataSelectId?.length === selectedData?.length) {
          setItemCount(data?.length * pagination.page);
        }
        // if (pageAction === "previous" || parcialDataSelectId.length != selectedData.length) {
        //   setItemCount(itemCount + data.length);
        // }
      }
    }, 500),
    [setItemCount]
  );

  useEffect(() => {
    itemCountHandler(data?.rows || [], selectedRows, pagination, paginationAction, itemCount); // wait for api call
  }, [data.rows, selectedRows, pagination, paginationAction]);

  const commonProps = useMemo(() => {
    return {
      resourceName: props.resourceName,
      itemCount: data?.rows?.length,
      items: data.rows,
      hasMoreItems: pagination.page * pagination.pageSize < data.count,
      renderItem: (item) => props.rowsData(item),
    };
  }, [data, pagination, props]);

  const resourceListWithSelectable = useMemo(
    () => (
      <ResourceList
        {...commonProps}
        selectedItemsCount={data.count === selectedItems?.length ? "All" : selectedItems?.length}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        bulkActions={props.bulkActions}
        promotedBulkActions={props.promotedBulkActions?.map((e) => ({
          content: e.content,
          onAction: () => e.onAction(data, selectedItems),
        }))}
        selectable
      />
    ),
    [commonProps, data, selectedItems, props]
  );

  const resourceListWithoutSelectable = useMemo(() => <ResourceList {...commonProps} />, [commonProps]);

  const handleTabChange = useCallback(
    async (tab) => {
      clearSelection();
      setAllRowsSelected(false);
      setSelectedRows([]);
      setData({ count: 0, rows: [] });
      setSelectedTab(tab);
      setParentSelectedTab && setParentSelectedTab(tab);
      const currentTabQuery = tabOption?.[tab]?.searchQuery;
      currentTabQuery ? setAdvanceFilter([{ ...currentTabQuery, tabNumber: tab }]) : setAdvanceFilter([]);
      setPagination({ page: 1, pageSize: 10 });
    },
    [advanceFilter]
  );

  useEffect(() => {
    setHasInitialData(!(advanceFilter?.length === 0 && (data.count === 0 || !data?.count)));
  }, [advanceFilter, data]);

  const handlePageChange = useCallback(
    (page, action) => {
      setPaginationAction(action);
      setPagination({ ...pagination, page: page });
    },
    [pagination]
  );

  const handleLimitChange = useCallback(
    (size) => {
      setPagination({ ...pagination, pageSize: size });
    },
    [pagination]
  );

  const CommonTableContent = () => {
    return (
      <>
        {showTab && <Tabs tabs={tabOption} selected={parseInt(selectedTab)} onSelect={handleTabChange} />}
        {secondaryTabAction}
        {isFilterVisible && hasInitialData && (
          <CommonFilter
            {...props}
            filters={advanceFilter}
            setPagination={setPagination}
            setFilters={setAdvanceFilter}
            currentTabData={tabOption[selectedTab]}
          />
        )}

        {showSpinner && isFetchingData ? (
          <div className="common-spinner">
            <Spinner></Spinner>
          </div>
        ) : !hasInitialData && customizeComponent && !apiCall ? (
          customizeComponent
        ) : isEmptyArray(data.rows || rows) ? (
          <EmptyState
            heading={props.customizeEmptyHeading || ` ${t("common.No")} ${props.title} ${t("common.found")}`}
            action={
              isAdd && {
                content: addButtonText || ` ${t("common.Add")} ${props.title}`,
                onAction: props.handleAddClick,
              }
            }
            image={Images.EmptyReuslt}
          />
        ) : (
          <React.Fragment>
            {props.type === "resource" ? (
              props.selectable ? (
                resourceListWithSelectable
              ) : (
                resourceListWithoutSelectable
              )
            ) : (
              <IndexTable
                {...props}
                itemCount={itemCount || data?.rows?.length}
                selectedItemsCount={allRowsSelected ? "All" : selectedRows?.length}
                onSelectionChange={handleParentSelectionChange || handleSelectionChange}
                hasMoreItems={pagination.page * pagination.pageSize < data.count}
                promotedBulkActions={
                  promotedBulkActions &&
                  promotedBulkActions.map((e, index) => {
                    return {
                      content: e.content,
                      onAction: () =>
                        e.onAction !== null && e.onAction(data.rows, selectedRows, allRowsSelected, index),
                    };
                  })
                }
                pagination={
                  isPaginationVisible && {
                    hasNext: !isPaginationWithCount || pagination.page * pagination.pageSize < data.count,
                    onNext: () => {
                      handlePageChange(pagination.page + 1, "next");
                    },
                    hasPrevious: pagination.page !== 1,
                    onPrevious: () => {
                      handlePageChange(pagination.page - 1, "previous");
                    },
                    label: (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <span style={{ lineHeight: "2.5" }}>
                          {t("common.Showing")} {pagination.page * pagination.pageSize - pagination.pageSize + 1}
                          {" - "}
                          {pagination.page * pagination.pageSize < data.count
                            ? pagination.page * pagination.pageSize
                            : data.count}{" "}
                          {t("common.of")} {data.count} {!showOnlyPagination && t("common.results, at most")}
                        </span>
                        &nbsp;&nbsp;
                        <Select
                          options={["10", "15", "25", "30", "50", "150"]}
                          onChange={(value) => {
                            handleLimitChange(value);
                          }}
                          value={pagination.pageSize}
                        />
                        &nbsp;&nbsp;
                        {!showOnlyPagination && <span style={{ lineHeight: "2.5" }}>{t("common.per page")}</span>}
                      </div>
                    ),
                  }
                }
              >
                {rows}
              </IndexTable>
            )}
          </React.Fragment>
        )}
      </>
    );
  };

  return hideCard ? <div>{CommonTableContent()}</div> : <Card padding="0">{CommonTableContent()}</Card>;
});

export default CommonTable;
