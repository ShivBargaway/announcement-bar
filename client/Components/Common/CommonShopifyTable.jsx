import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, DataTable, EmptyState, Pagination, TextField } from "@shopify/polaris";
import debounce from "lodash/debounce";
import { useAuthenticatedFetch } from "@/Api/Axios";
import * as Images from "@/Assets/Index";
import { getSessionStorageItem, isEmptyArray, objectToQueryParams, setSessionStorageItem } from "@/Utils/Index";

export const CommonShopifyTable = forwardRef((props, ref) => {
  const { isAdd = true } = props;
  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();
  const initialFilterValues = {
    first: 10,
  };
  const [filter, setFilter] = useState(props.filter ? props.filter : initialFilterValues);
  const [data, setData] = useState({
    pageInfo: {},
    rows: [],
  });
  const [inputValue, setInputValue] = useState("");

  useImperativeHandle(ref, () => ({
    fetchData: async (filter = { first: 10 }) => {
      const queryParams = objectToQueryParams(filter);
      const response = await fetch.get(`${props.url}${queryParams}`);
      if (response.data) {
        setData({ ...response.data });
      }
    },
  }));

  const rows = useMemo(() => {
    return props.rowsData(data.rows);
  }, [data.rows]);

  useEffect(() => {
    const savedFilter = getSessionStorageItem("filter");
    if (savedFilter?.query) setInputValue(savedFilter?.query);
    ref.current.fetchData(savedFilter || filter);
  }, [filter]);

  const handlePageChange = useCallback(async (type, cursor) => {
    let filter = {};
    if (type === "next") {
      filter = { first: 10, after: cursor };
    } else {
      filter = { last: 10, before: cursor };
    }
    setSessionStorageItem("filter", filter);
    ref.current.fetchData(filter);
  }, []);

  const searchDebounced = useCallback(
    debounce((value) => {
      setSessionStorageItem("filter", { ...filter, query: value });
      setFilter({ ...filter, query: value });
    }, 500),
    [filter]
  );

  return (
    <Card padding="0">
      <div style={{ padding: "10px" }}>
        {/* Search field */}
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
          placeholder={`${t("common.Search")}  ${props.type}`}
        />
      </div>
      {isEmptyArray(rows) ? (
        <EmptyState
          heading={`${t("common.No")}${props.type}  ${t("common.Found")}`}
          action={
            isAdd && {
              content: `${t("common.Add")} ${props.title}`,
              onAction: props.handleAddClick,
            }
          }
          image={Images.EmptyReuslt}
        />
      ) : (
        <React.Fragment>
          <div className={props.className}>
            <DataTable {...props} rows={rows} />
          </div>
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              hasPrevious={data.pageInfo?.hasPreviousPage}
              onPrevious={() => {
                handlePageChange("prev", data.pageInfo?.startCursor);
              }}
              hasNext={data.pageInfo?.hasNextPage}
              onNext={() => {
                handlePageChange("next", data.pageInfo?.endCursor);
              }}
            />
          </div>
          <br />
        </React.Fragment>
      )}
    </Card>
  );
});
