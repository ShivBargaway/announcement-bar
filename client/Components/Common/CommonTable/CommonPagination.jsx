import React, { useCallback } from "react";
import { Pagination, Select } from "@shopify/polaris";
import { t } from "i18next";

export default function CommonPagination(props) {
  const {
    isPaginationWithCount = true,
    paginationOptions,
    filter,
    setFilter,
    data,
    setPaginationAction,
    showOnlyPagination,
  } = props;

  const handlePageChange = useCallback(
    (page, action) => {
      setPaginationAction(action);
      setFilter({ ...filter, page: page });
    },
    [filter]
  );

  const handleLimitChange = useCallback(
    (size) => {
      setFilter({ ...filter, pageSize: size });
    },
    [filter]
  );

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Pagination
        label={
          isPaginationWithCount && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <span style={{ lineHeight: "2.5" }}>
                {t("common.Showing")} {filter.page * filter.pageSize - filter.pageSize + 1}
                {" - "}
                {filter.page * filter.pageSize < data.count ? filter.page * filter.pageSize : data.count}{" "}
                {t("common.of")} {data.count} {!showOnlyPagination && t("common.results, at most")}
              </span>
              &nbsp;&nbsp;
              <Select
                options={paginationOptions || ["10", "15", "25", "30", "50", "150"]}
                onChange={(value) => {
                  handleLimitChange(value);
                }}
                value={filter.pageSize}
              />
              &nbsp;&nbsp;
              {!showOnlyPagination && <span style={{ lineHeight: "2.5" }}>{t("common.per page")}</span>}
            </div>
          )
        }
        hasPrevious={filter.page !== 1}
        onPrevious={() => {
          handlePageChange(filter.page - 1, "previous");
        }}
        hasNext={!isPaginationWithCount || filter.page * filter.pageSize < data.count}
        onNext={() => {
          handlePageChange(filter.page + 1, "next");
        }}
      />
    </div>
  );
}
