import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { Card, DataTable, EmptyState, Pagination, ResourceList, Select, TextField } from "@shopify/polaris";
import { t } from "i18next";
import debounce from "lodash/debounce";
import { useAuthenticatedFetch } from "@/Api/Axios";
import * as Images from "@/Assets/Index";
import { getSessionStorageItem, isEmptyArray, objectToQueryParams, setSessionStorageItem } from "@/Utils/Index";

const CommonTable = forwardRef((props, ref) => {
  const {
    isAdd = true,
    isSearchVisible = true,
    isPaginationVisible = true,
    isPaginationWithCount = true,
    paginationOptions,
    tableData,
    hideCard = false,
  } = props;

  const [selectedItems, setSelectedItems] = useState([]);
  const fetch = useAuthenticatedFetch();

  const initialFilterValues = {
    page: 1,
    pageSize: 10,
    search: "",
  };

  const [filter, setFilter] = useState(props.filter ? props.filter : initialFilterValues);
  const [data, setData] = useState({
    count: 0,
    rows: [],
  });
  const [inputValue, setInputValue] = useState("");

  useImperativeHandle(ref, () => ({
    fetchData: async (filter = { page: 1, pageSize: 10, search: "" }) => {
      const queryParams = objectToQueryParams({
        ...filter,
        ...props.queryParam,
      });
      const response = await fetch.get(`${props.url}${queryParams}`);
      if (response.data) {
        setData({ ...response.data });
      }
    },
  }));

  useEffect(() => {
    if (tableData) {
      setData(tableData);
    }
  }, [tableData]);

  const rows = useMemo(() => {
    return props.rowsData(data.rows);
  }, [data.rows]);

  useEffect(() => {
    let savedFilter;
    if (props.type === "resource") {
      savedFilter = getSessionStorageItem("indexfilter");
    }
    ref.current.fetchData(savedFilter || filter);
  }, [filter, props.url]);

  const handlePageChange = useCallback(
    (page) => {
      setFilter({ ...filter, page: page });
      props.type === "resource" && setSessionStorageItem("indexfilter", { ...filter, page: page });
    },
    [filter]
  );

  const handleLimitChange = useCallback(
    (size) => {
      setFilter({ ...filter, pageSize: size });
      props.type === "resource" && setSessionStorageItem("indexfilter", { ...filter, pageSize: size });
    },
    [filter]
  );

  const searchDebounced = useCallback(
    debounce((value) => {
      setFilter({ ...filter, search: value, page: 1 });
    }, 500),
    [setFilter]
  );

  const commonProps = useMemo(() => {
    return {
      resourceName: props.resourceName,
      itemCount: data.rows.length,
      items: data.rows,
      hasMoreItems: filter.page * filter.pageSize < data.count,
      renderItem: (item) => props.rowsData(item),
    };
  }, [data, filter, props]);

  const resourceListWithSelectable = useMemo(
    () => (
      <ResourceList
        {...commonProps}
        selectedItemsCount={data.count === selectedItems.length ? "All" : selectedItems.length}
        selectedItems={selectedItems}
        onSelectionChange={setSelectedItems}
        bulkActions={props.bulkActions}
        promotedBulkActions={props.promotedBulkActions?.map((e) => ({
          content: e.content,
          onAction: () => e.onAction(data, selectedItems, inputValue),
        }))}
        selectable
      />
    ),
    [commonProps, data, selectedItems, inputValue, props]
  );

  const resourceListWithoutSelectable = useMemo(() => <ResourceList {...commonProps} />, [commonProps]);

  const CommonTableContent = () => {
    return (
      <>
        {isSearchVisible && (
          <div style={{ padding: "10px" }}>
            <TextField
              value={inputValue}
              onChange={(value) => {
                setInputValue(value);
                searchDebounced(value);
              }}
              autoComplete="off"
              clearButton
              onClearButtonClick={() => {
                setInputValue("");
                setFilter(initialFilterValues);
              }}
              textAlign="right"
              placeholder={`${t("common.Search")} ${props.title}`}
            />
          </div>
        )}
        {isEmptyArray(data.rows || rows) ? (
          <EmptyState
            heading={` ${t("common.No")} ${props.title} ${t("common.found")}`}
            action={
              isAdd && {
                content: ` ${t("common.Add")} ${props.title}`,
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
              <DataTable {...props} rows={rows} />
            )}
            <br />
            {isPaginationVisible && (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Pagination
                  label={
                    isPaginationWithCount && (
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <span style={{ lineHeight: "2.5" }}>
                          {t("common.Showing")} {filter.page * filter.pageSize - filter.pageSize + 1}
                          {" - "}
                          {filter.page * filter.pageSize < data.count
                            ? filter.page * filter.pageSize
                            : data.count}{" "}
                          {t("common.of")} {data.count} {t("common.results, at most")}
                        </span>
                        &nbsp;&nbsp;
                        <Select
                          options={paginationOptions || ["10", "15", "25", "30"]}
                          onChange={(value) => {
                            handleLimitChange(value);
                          }}
                          value={filter.pageSize}
                        />
                        &nbsp;&nbsp;
                        <span style={{ lineHeight: "2.5" }}>{t("common.per page")}</span>
                      </div>
                    )
                  }
                  hasPrevious={filter.page !== 1}
                  onPrevious={() => {
                    handlePageChange(filter.page - 1);
                  }}
                  hasNext={!isPaginationWithCount || filter.page * filter.pageSize < data.count}
                  onNext={() => {
                    handlePageChange(filter.page + 1);
                  }}
                />
              </div>
            )}
            <br />
          </React.Fragment>
        )}
      </>
    );
  };

  return hideCard ? <div>{CommonTableContent()}</div> : <Card padding="0">{CommonTableContent()}</Card>;
});
export default CommonTable;
