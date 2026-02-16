import React, { useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, IndexTable, Modal, Thumbnail } from "@shopify/polaris";
import { ProductIcon } from "@shopify/polaris-icons";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import TruncatedText from "@/Components/Common/TruncatedText";
import { ToastContext } from "@/Context/ToastContext";

export default function ShopifyImages({ showImageModal, setShowImageModal, closeModals, handleImageSubmit }) {
  const modelRef = useRef();
  const { showToast } = useContext(ToastContext);
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [patentSelectedRows, setPatentSelectedRows] = useState([]);
  const [parentAllRowsSelected, setParentAllRowsSelected] = useState(false);
  const [initialData, setInitialData] = useState([]);

  const extractFilenameFromURL = useCallback((url) => {
    if (url) {
      const pathComponents = url.split("/");
      const lastPathComponent = pathComponents[pathComponents.length - 1].split("?")[0];
      return lastPathComponent;
    }
  }, []);

  const createOtherImageRowsData = useCallback(
    (rows, selectedResources) => {
      if (rows?.length <= 0) return [];
      return rows?.map((row, index) => {
        return (
          <IndexTable.Row
            id={row.id}
            key={row.id + index}
            selected={selectedResources.includes(row.id)}
            position={index}
            onClick={() => {}}
          >
            <IndexTable.Cell>
              <Box width="100%" padding="200">
                <Thumbnail source={row?.image?.originalSrc || ProductIcon} size="small" />
              </Box>
            </IndexTable.Cell>
            <IndexTable.Cell>
              <Box width="100%">
                <TruncatedText
                  text={extractFilenameFromURL(row?.image?.originalSrc)}
                  maxLines={2}
                  maxLength={40}
                />
              </Box>
            </IndexTable.Cell>
          </IndexTable.Row>
        );
      });
    },
    [data]
  );

  const handleSubmit = useCallback(async (rows, selectedResources) => {
    let selectedObjects = rows.find((row) => selectedResources.includes(row.id));
    setData(selectedObjects);
  }, []);

  const handleAddImages = useCallback(async () => {
    if (!data) showToast(t("common.Please select at least one image"));
    else handleImageSubmit(data);
  }, [data]);

  const handleParentSelectionChange = useCallback(
    (selectionType, isSelecting, selection, _position) => {
      let val = [];
      if (isSelecting) {
        if (selection) val = [selection];
        else val = patentSelectedRows?.length > 0 ? patentSelectedRows : [initialData?.rows?.[0]?.id];
      } else val = [];

      setParentAllRowsSelected(false);
      setPatentSelectedRows([...new Set(val)]);
    },
    [initialData, patentSelectedRows, parentAllRowsSelected]
  );

  return (
    <Modal
      open={showImageModal}
      title="Add Image"
      onClose={closeModals}
      primaryAction={{
        content: t(`common.Add Images`),
        onAction: handleAddImages,
      }}
      secondaryActions={[
        {
          content: t(`common.Cancel`),
          onAction: closeModals,
        },
      ]}
    >
      <Modal.Section>
        <CommonTable
          title={t("common.other image")}
          url={"/get/shopify/image"}
          rowsData={createOtherImageRowsData}
          ref={modelRef}
          headings={[{ title: t("common.Image") }, { title: t("common.Filename") }]}
          isAdd={false}
          searchKey={["image.originalSrc"]}
          verticalAlign="middle"
          isFilterVisible
          isPaginationVisible={false}
          queryPlaceholder={t("common.Search filename")}
          handleSubmit={handleSubmit}
          setInitialData={setInitialData}
          handleParentSelectionChange={handleParentSelectionChange}
          patentSelectedRows={patentSelectedRows}
          parentAllRowsSelected={parentAllRowsSelected}
        />
      </Modal.Section>
    </Modal>
  );
}
