import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BlockStack, Divider, IndexTable, Page } from "@shopify/polaris";
import { t } from "i18next";
import moment from "moment";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import { getFilterField } from "../../Assets/Mocks/Contact.mock";

export default function Contacts({ backbutton }) {
  const childRef = useRef();
  const fetch = useAuthenticatedFetch();
  const [choices, setChoices] = useState([]);
  const getFilters = useCallback(async () => {
    let result = await fetch.get("getAllCampaign");
    setChoices(result.data);
  }, [setChoices]);

  useEffect(() => {
    getFilters();
  }, []);
  const filterFormFields = useMemo(() => getFilterField(choices), [choices]);

  const rowData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index} onClick={() => {}}>
          <IndexTable.Cell>{row.email}</IndexTable.Cell>
          <IndexTable.Cell>{row.firstName ? row.firstName : "-"}</IndexTable.Cell>
          <IndexTable.Cell>{row.lastName ? row.lastName : "-"}</IndexTable.Cell>
          <IndexTable.Cell>{row.phone ? row.phone : "-"}</IndexTable.Cell>
          <IndexTable.Cell>{moment(row.updated).format("MM-DD-YYYY, h:mmA")}</IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Page title={t("common.Contacts")} backAction={backbutton}>
        <BlockStack gap="600">
          <Divider borderColor="border" />
          <CommonTable
            resourceName={{
              singular: "User",
              plural: "Users",
            }}
            title={t("common.Contacts")}
            url={`contact`}
            selectable={false}
            rowsData={rowData}
            isFilterVisible
            headings={[
              { title: t(`common.${"Email"}`) },
              { title: t(`common.${"First Name"}`) },
              { title: t(`common.${"Last Name"}`) },
              { title: t(`common.${"Phone"}`) },
              { title: t(`common.${"Create At"}`) },
            ]}
            searchKey={["storeName", "shopUrl", "email", "recurringPlanId", "recurringPlanName"]}
            ref={childRef}
            isAdd={false}
            verticalAlign="center"
            columnContentTypes={["string", "string", "string", "number", "string"]}
            filterFormFields={filterFormFields}
            pinnedFilter={["campaignTitle"]}
            localStorageKey="adminDeleteUser"
            hideQueryField
          />
        </BlockStack>
      </Page>
    </div>
  );
}
