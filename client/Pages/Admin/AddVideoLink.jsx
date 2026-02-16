import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BlockStack, Button, IndexTable, InlineStack, Link, Modal, Page, Text } from "@shopify/polaris";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";
import CommonTable from "@/Components/Common/CommonTable/CommonTable";
import TruncatedText from "@/Components/Common/TruncatedText";
import { ToastContext } from "@/Context/ToastContext";

const videoInitialVal = {
  selector: "",
  linkValue: {
    designType: "",
    videoAddingType: "",
    link: "",
    videoTitle: "",
    videoDescription: "",
    articleLink: "",
    linkPosition: [{ position: "", beforeOrAfter: "" }],
  },
};

const videoAddingTypeOption = [
  { label: "", value: "", disabled: true },
  { label: "Form", value: "Form" },
  { label: "Page Title", value: "pageTitle" },
  { label: "Page Tab", value: "pageTab" },
  { label: "Pricing Table", value: "pricingTable" },
];

const designTypeOption = [
  { label: "", value: "" },
  { label: "Wrap With Button", value: "withButton" },
  { label: "Wrap Without Button", value: "withoutButton" },
];

export const themeSelectorFormFields = (isOpenInForm) => [
  {
    id: "selector",
    name: "selector",
    label: "Add Selector",
    type: "text",
    validated: true,
  },
  {
    id: "linkValue",
    name: "linkValue",
    nested: "object",
    groupSize: 1,
    label: "Link Info",
    subfields: [
      {
        label: "Video Title",
        id: "videoTitle",
        name: "videoTitle",
        type: "text",
        multiline: 1,
      },
      {
        label: "Video Description",
        id: "videoDescription",
        name: "videoDescription",
        type: "text",
        multiline: 2,
      },
      {
        nested: "group",
        groupSize: 2,
        section: false,
        subfields: [
          {
            label: "Video Link Address",
            id: "link",
            name: "link",
            type: "text",
            multiline: 1,
          },
          {
            label: "Article Link Address",
            id: "articleLink",
            name: "articleLink",
            type: "text",
            multiline: 1,
          },
          {
            id: "videoAddingType",
            name: "videoAddingType",
            label: "Add Video In",
            type: "select",
            validated: true,
            errormsg: "Add Video is required",
            options: videoAddingTypeOption,
          },
          {
            id: "designType",
            name: "designType",
            label: "Video Icon Design Type",
            type: "select",
            validated: true,
            errormsg: "Video Icon Design Type is required",
            options: designTypeOption,
          },
        ],
      },
      {
        groupSize: 2,
        label: "Link Position",
        id: "linkPosition",
        name: "linkPosition",
        section: true,
        minimum: 1,
        nested: "array",
        subfields: [
          {
            id: "position",
            name: "position",
            label: "Position",
            type: "select",
            validated: true,
            errormsg: "Position is required",
            options: [
              { label: "Enter Position", value: "", disabled: true },
              { label: "Label", value: "label" },
              { label: "HelpText", value: "helpText", disabled: !isOpenInForm },
              { label: "ConnectedRight", value: "connectedRight", disabled: !isOpenInForm },
              { label: "ConnectedLeft", value: "connectedLeft", disabled: !isOpenInForm },
              { label: "Prefix", value: "prefix", disabled: !isOpenInForm },
              { label: "Sufix", value: "sufix", disabled: !isOpenInForm },
            ],
          },
          {
            id: "beforeOrAfter",
            name: "beforeOrAfter",
            label: "Before Or After",
            type: "select",
            validated: true,
            errormsg: "beforeOrAfter is required",
            options: [
              { label: "Enter Before Or After", value: "", disabled: true },
              { label: "Before", value: "before" },
              { label: "After", value: "after" },
            ],
          },
        ],
      },
    ],
  },
];

export default function AddVideoLink() {
  const childRef = useRef();
  const [isModalActive, setIsModalActive] = useState(false);
  const [openDeleteModel, setOpenDeleteModel] = useState(false);
  const [isEditModel, setIsEditModel] = useState(false);
  const [initialValue, setInitialValue] = useState(videoInitialVal);
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();
  const { showToast } = useContext(ToastContext);

  const handleSubmit = useCallback(
    async (value) => {
      await fetch.post("admin/addSingleVideoLink", value);
      showToast("Created successfully");
      childRef?.current?.fetchData();
      toggleModal();
    },
    [isModalActive]
  );

  const deletSingleKey = useCallback(
    async (value) => {
      await fetch.delete(`admin/deleteSingleVideoLink/${value?._id}`, value);
      closeDeleteModel();
      showToast("Deleted successfully");
      childRef?.current?.fetchData();
    },
    [isModalActive]
  );

  const editsingleKey = (data) => {
    setIsEditModel(true);
    setInitialValue(data);
    setIsModalActive(true);
  };

  const deletesingleKey = (data) => {
    setOpenDeleteModel(true);
    setInitialValue(data);
  };

  const closeDeleteModel = useCallback(() => {
    setOpenDeleteModel(false);
    setIsEditModel(false);
    setInitialValue(videoInitialVal);
  }, [isModalActive]);

  const toggleModal = useCallback(() => {
    setIsEditModel(false);
    setInitialValue(videoInitialVal);
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  const createRowsData = useCallback((rows) => {
    if (rows?.length <= 0) return [];
    return rows?.map((row, index) => {
      const linkValue = row?.linkValue;
      return (
        <IndexTable.Row id={row._id} key={row._id} position={index}>
          <IndexTable.Cell>{index}</IndexTable.Cell>
          <IndexTable.Cell>{row?.selector}</IndexTable.Cell>
          <IndexTable.Cell className="video-model-form">
            <BlockStack gap={100}>
              <InlineStack gap={200}>
                <Text fontWeight="bold">Video title :</Text>
                <Text>{linkValue?.videoTitle}</Text>
              </InlineStack>
              <InlineStack gap={200}>
                <Text fontWeight="bold">Video Added In :</Text>
                <Text>{videoAddingTypeOption?.find((e) => e?.value === linkValue?.videoAddingType)?.label}</Text>
              </InlineStack>
              <InlineStack gap={200}>
                <Text fontWeight="bold"> Video Icon Design Type :</Text>
                <Text>{designTypeOption?.find((e) => e?.value === linkValue?.designType)?.label}</Text>
              </InlineStack>
              <InlineStack gap={200}>
                <Text fontWeight="bold">Link :</Text>
                <Link url={linkValue?.link} target="_blank">
                  <TruncatedText text={linkValue?.link} maxLength={70} />
                </Link>
              </InlineStack>

              <InlineStack gap={200}>
                <Text fontWeight="bold">Video Description :</Text>
                <Text>{linkValue?.videoDescription}</Text>
              </InlineStack>
              <InlineStack gap={200}>
                <Text fontWeight="bold">Article Link :</Text>
                <Link url={linkValue?.link} target="_blank">
                  <TruncatedText text={linkValue?.articleLink} maxLength={70} />
                </Link>
              </InlineStack>
              <BlockStack gap={200}>
                {linkValue?.linkPosition?.map((link, i) => (
                  <InlineStack gap={200} key={i}>
                    <Text fontWeight="bold">Link Position :</Text>{" "}
                    {link?.position ? <Text>{link?.position}</Text> : "-"}
                    {link?.beforeOrAfter && (
                      <Text>
                        <b>Before Or After :</b> {link?.beforeOrAfter}
                      </Text>
                    )}
                  </InlineStack>
                ))}
              </BlockStack>
            </BlockStack>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <InlineStack gap={200}>
              <Button icon={EditIcon} onClick={() => editsingleKey(row)} tone="success" />
              <Button icon={DeleteIcon} onClick={() => deletesingleKey(row)} tone="critical" />
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
            Create New Video Link
          </Button>
        </InlineStack>

        <CommonTable
          resourceName={{
            singular: "Bulk Operation",
            plural: "Bulk Operations",
          }}
          title={"Video Link"}
          queryPlaceholder={"Search Video Link"}
          url={"admin/getAllVideoLink"}
          selectable={false}
          rowsData={createRowsData}
          isFilterVisible
          headings={[{ title: "Index" }, { title: "Selector Name" }, { title: "Link Value" }, { title: "Action" }]}
          searchKey={["selector", "linkValue.link"]}
          ref={childRef}
          isAdd={false}
          verticalAlign="center"
          columnContentTypes={["text", "text", "numeric", "numeric", "numeric", "text", "text"]}
        />
      </BlockStack>

      <Modal
        size="large"
        open={isModalActive}
        onClose={toggleModal}
        title={isEditModel ? "Edit Link" : "Add Link"}
        primaryAction={{ content: "Save", onAction: () => formRef.current?.handleSubmit() }}
        secondaryActions={[{ content: "Cancel", onAction: toggleModal }]}
      >
        <Modal.Section>
          <CommonForm
            onSubmit={handleSubmit}
            initialValues={initialValue}
            onFormChange={(value) => setInitialValue(value)}
            formFields={themeSelectorFormFields(initialValue?.linkValue?.videoAddingType === "Form")}
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
        title={"Are you sure you want to delete This Key?"}
        primaryAction={{ content: "Delete", onAction: () => deletSingleKey(initialValue), destructive: true }}
        secondaryActions={[{ content: "Cancel", onAction: closeDeleteModel }]}
      >
        <Modal.Section>
          <BlockStack gap={200}>
            <Text>
              <b>Selector Name :</b> {initialValue?.selector}
            </Text>
            <InlineStack gap={200}>
              <Text fontWeight="bold">Video Added In :</Text>
              <Text>
                {videoAddingTypeOption?.find((e) => e?.value === initialValue?.linkValue?.videoAddingType)?.label}
              </Text>
            </InlineStack>
            <InlineStack gap={200}>
              <Text fontWeight="bold">Link :</Text>
              <Link url={initialValue?.linkValue?.link} target="_blank">
                <TruncatedText text={initialValue?.linkValue?.link} maxLength={70} />
              </Link>
            </InlineStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </Page>
  );
}
