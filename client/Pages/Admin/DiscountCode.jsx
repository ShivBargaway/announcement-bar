import React, { useCallback, useContext, useRef, useState } from "react";
import { BlockStack, Button, IndexTable, InlineStack, Modal, Page, Text } from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import { ToastContext } from "@/Context/ToastContext";
import { formatTimeAgo } from "@/Utils/Index";

const videoInitialVal = {
  code: "",
  planName: [],
  value: 0,
  trialDays: 0,
  codeType: "planDiscount",
  upgradeManual: false,
  type: "percentage",
};

const allPlanName = [
  "All",
  "Month",
  "Year",
  "Free",
  "Premium",
  "Premium-Monthly",
  "Premium-Yearly",
  "Pro",
  "Pro-Monthly",
  "Pro-Yearly",
];

const codetypeOptions = ["planDiscount", "uninstall", "trialOffer"];

export const themeSelectorFormFields = (isEditForm) => [
  {
    nested: "group",
    groupSize: 2,
    section: false,
    subfields: [
      {
        id: "code",
        name: "code",
        label: "Add Code",
        type: "text",
        validated: true,
        disabled: isEditForm,
      },

      {
        id: "value",
        name: "value",
        label: "Add Discount in(%)",
        type: "number",
        validated: true,
      },
      {
        id: "trialDays",
        name: "trialDays",
        label: "Add Trial Days",
        type: "number",
        validated: true,
      },
      {
        id: "codeType",
        name: "codeType",
        label: "Add Code Type",
        type: "select",
        validated: true,
        options: codetypeOptions?.map((e, index) => ({ label: e, value: e, key: index })),
      },
      {
        id: "upgradeManual",
        name: "upgradeManual",
        label: "Upgrade Plan Manual",
        type: "checkbox",
        validated: true,
        helpText: "Manual upgrade means upgrade directly without being redirected to Shopify.",
      },
      {
        id: "type",
        name: "type",
        label: "Discount Type",
        type: "select",
        validated: true,
        options: [
          { label: "Percentage", value: "percentage" },
          { label: "Amount", value: "amount" },
        ],
      },
      {
        id: "planName",
        name: "planName",
        label: "Add Plan Name",
        type: "choiceList",
        allowMultiple: true,
        choices: allPlanName?.map((e, index) => ({ label: e, value: e, key: index })),
      },
    ],
  },
];

export default function DiscountCode() {
  const childRef = useRef();
  const [openDiscountModal, setOpenDiscountModal] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [isEditModel, setIsEditModel] = useState(false);
  const [initialValue, setInitialValue] = useState(videoInitialVal);
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();
  const { showToast } = useContext(ToastContext);

  const editRow = (data) => {
    setIsEditModel(true);
    setOpenDiscountModal(true);
    setInitialValue(data);
  };

  const toggleModal = useCallback(() => {
    setIsEditModel(false);
    setOpenDiscountModal(!openDiscountModal);
    setInitialValue(videoInitialVal);
  }, [openDiscountModal, videoInitialVal]);

  const closeDeleteModel = useCallback(() => {
    setOpenDeleteModel(false);
    setIsEditModel(false);
    setInitialValue(videoInitialVal);
  }, []);

  const deleteRow = async (value) => {
    setOpenDeleteModel(true);
    setInitialValue(value);
  };

  const handleDelete = async (value) => {
    await fetch.delete(`admin/deleteSinglePromoCode/${value?._id}`, value);
    closeDeleteModel();
    showToast("Deleted successfully");
    childRef?.current?.fetchData();
  };

  const handleSubmit = async (data) => {
    await fetch.post("admin/addPromoCode", data);
    showToast("Created successfully");
    childRef?.current?.fetchData();
    toggleModal();
  };

  const createRowsData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      const linkValue = row?.linkValue;
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index + 1}</IndexTable.Cell>
          <IndexTable.Cell>{row?.code}</IndexTable.Cell>
          <IndexTable.Cell>{row?.value}%</IndexTable.Cell>
          <IndexTable.Cell>{row?.planName?.join(", ")}</IndexTable.Cell>
          <IndexTable.Cell>{row?.codeType}</IndexTable.Cell>
          <IndexTable.Cell>{row?.type}</IndexTable.Cell>
          <IndexTable.Cell>{row?.trialDays}</IndexTable.Cell>
          <IndexTable.Cell>{row?.upgradeManual ? "Yes" : "No"}</IndexTable.Cell>
          <IndexTable.Cell>{formatTimeAgo(row?.created)}</IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack gap={200}>
              <Button icon={EditIcon} onClick={() => editRow(row)} tone="success" />
              <Button icon={DeleteIcon} onClick={() => deleteRow(row)} tone="critical" />
            </InlineStack>
          </IndexTable.Cell>
        </IndexTable.Row>
      );
    });
  }, []);

  return (
    <Page fullWidth>
      <BlockStack gap="500">
        <InlineStack blockAlign="center" gap={200}>
          <Button onClick={toggleModal} variant="primary">
            Create New Discount Code
          </Button>
        </InlineStack>

        <CommonTable
          resourceName={{
            singular: "Discount Code",
            plural: "Discount Codes",
          }}
          title={"Discount Code"}
          queryPlaceholder={"Search Discount Code"}
          url={"admin/getAllPromoCode"}
          selectable={false}
          rowsData={createRowsData}
          isFilterVisible
          headings={[
            { title: "Index" },
            { title: "Code" },
            { title: "Discount" },
            { title: "Plan Name" },
            { title: "Code Type" },
            { title: "Discount Type" },
            { title: "Trial Days" },
            { title: "Upgrade Manual" },
            { title: "Created Date" },
            { title: "Action" },
          ]}
          searchKey={["code"]}
          ref={childRef}
          isAdd={false}
          verticalAlign="center"
        />
      </BlockStack>
      <Modal
        open={openDiscountModal}
        onClose={() => setOpenDiscountModal(false)}
        title={isEditModel ? "Edit Data" : "Add Data"}
        primaryAction={{ content: "Save", onAction: () => formRef.current?.handleSubmit() }}
        secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
      >
        <Modal.Section>
          <CommonForm
            onSubmit={handleSubmit}
            initialValues={initialValue}
            onFormChange={(value) => setInitialValue(value)}
            formFields={themeSelectorFormFields(isEditModel)}
            formRef={formRef}
            isSave={false}
            enableReinitialize={true}
            noValueChanged={false}
          />
        </Modal.Section>
      </Modal>
      <Modal
        open={openDeleteModel}
        onClose={closeDeleteModel}
        title={"Are you sure you want to delete this code?"}
        primaryAction={{ content: "Delete", onAction: () => handleDelete(initialValue), destructive: true }}
        secondaryActions={[{ content: "Cancel", onAction: closeDeleteModel }]}
      >
        <Modal.Section>
          <BlockStack gap={200}>
            <Text>
              <b>Code </b>: {initialValue?.code}
            </Text>
            <Text>
              <b>Discount </b> : {initialValue?.value}
            </Text>
            <Text>
              <b>Plan Name </b> : {initialValue?.planName?.join(", ")}
            </Text>
            <Text>
              <b>Code Type </b> : {initialValue?.codeType}
            </Text>
            <Text>
              <b>Discount Type </b> : {initialValue?.type}
            </Text>
            <Text>
              <b>Trial days </b> : {initialValue?.trialDays}
            </Text>
            <Text>
              <b>Upgrade Manual </b> : {initialValue?.upgradeManual ? "Yes" : "No"}
            </Text>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
