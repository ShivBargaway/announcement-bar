import React, { useCallback, useContext, useRef, useState } from "react";
import { BlockStack, Button, ButtonGroup, Icon, IndexTable, Page } from "@shopify/polaris";
import { DeleteIcon } from "@shopify/polaris-icons";
import moment from "moment";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import { ToastContext } from "@/Context/ToastContext";

function AnnouncementsPreview() {
  const fetch = useAuthenticatedFetch();
  const childRef = useRef();
  const { showToast } = useContext(ToastContext);
  const [showTextArea, setShowTextArea] = useState(false);
  const [textAreaValue, setTextAreaValue] = useState("");

  const removeSlide = useCallback(async (rows) => {
    let id = rows._id;
    await fetch.delete(`admin/announcement/${id}`);
    showToast("Delete successfully");
  });
  const handleClick = () => {
    setShowTextArea(true);
  };

  const handleSave = useCallback(async () => {
    await fetch.post("admin/add-annoucement", JSON.parse(textAreaValue));
    showToast("Copy successfully");
    setShowTextArea(false);
  });

  const handleChange = (event) => {
    setTextAreaValue(event.target.value);
  };

  const handleBlur = () => {
    setShowTextArea(false);
  };

  const rowsData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index + 1}</IndexTable.Cell>
          <IndexTable.Cell>
            {!row.campaignTitle
              ? row.htmlDesign
                  .find((row) => row.type === "Text")
                  ?.desktopSetting.textEditor.replace(/<[^>]*>/g, "") ||
                row.htmlDesign.find((row) => row.type === "freeShippingBar")?.desktopSetting.shippingBarMessage
                  .messageStart
              : row.campaignTitle}
          </IndexTable.Cell>
          <IndexTable.Cell>{row.slideType}</IndexTable.Cell>
          <IndexTable.Cell>{moment(row.created).format("MM-DD-YYYY, h:mmA")}</IndexTable.Cell>
          <IndexTable.Cell>
            <ButtonGroup verticalAlign="center">
              <Button variant="plain" onClick={() => removeSlide(row)}>
                <Icon source={DeleteIcon} tone="base" />
              </Button>
            </ButtonGroup>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);
  return (
    <Page fullWidth>
      <BlockStack gap="500">
        <BlockStack gap="500">
          <ButtonGroup>
            <Button variant="primary" onClick={handleClick}>
              Add Copy Announcement
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Copy Announcement
            </Button>
          </ButtonGroup>
        </BlockStack>
        {showTextArea && (
          <textarea value={textAreaValue} onChange={handleChange} onBlur={handleBlur} rows={40} cols={100} />
        )}
        <BlockStack gap="500">
          <CommonTable
            resourceName={{
              singular: "Announcement",
              plural: "Announcements",
            }}
            title="Announcement"
            queryPlaceholder="Search Announcement by (shopUrl, email, storeName, recurringPlanId, recurringPlanName)"
            url={`admin/preview`}
            selectable={false}
            rowsData={rowsData}
            isFilterVisible
            headings={[
              { title: "No" },
              { title: "Campaign Title" },
              { title: "Slide Type" },
              { title: "Create At" },
              { title: "Actions" },
            ]}
            searchKey={["campaignTitle", "slideType"]}
            ref={childRef}
            isAdd={false}
            verticalAlign="center"
            columnContentTypes={["text", "text", "text", "text", "text"]}
          />
        </BlockStack>
      </BlockStack>
    </Page>
  );
}

export default AnnouncementsPreview;
