import React from "react";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "textEditor",
    name: "textEditor",
    label: "Message",
    labelPosition: "right",
    type: "editor",
    placeholder: "Enter a announcement slideMessage",
    validated: true,
    config: {
      toolbar: {
        options: ["emoji", "colorPicker", "inline"],
        inline: {
          options: ["bold", "italic", "underline", "strikethrough"],
        },
      },
    },
  },
  {
    nested: "group",
    groupSize: 1,
    section: false,
    subfields: [
      {
        id: "fontFamilyEnabled",
        name: "fontFamilyEnabled",
        label: t("common.Change Font"),
        labelPosition: "right",
        type: "switch",
      },
      {
        id: "fontFamily",
        name: "fontFamily",
        label: t("common.Font Family"),
        labelPosition: "left",
        type: "fontpicker",
        activeFontFamily: "Roboto",
        sort: "popularity",
        dependOn: {
          name: "fontFamilyEnabled",
          value: true,
          type: "hidden",
        },
      },

      {
        id: "fontStyle",
        name: "fontStyle",
        label: t("common.Font Style"),
        options: [
          { label: t("common.Normal"), value: "normal" },
          { label: t("common.Italic"), value: "italic" },
          { label: t("common.Oblique"), value: "oblique" },
          { label: t("common.Unset"), value: "unset" },
        ],
        type: "select",
      },
      {
        id: "fontWeight",
        name: "fontWeight",
        label: t("common.Font Weight"),
        options: [
          { label: "100", value: "100" },
          { label: "400", value: "400" },
          { label: "600", value: "600" },
          { label: "700", value: "700" },
          { label: "900", value: "900" },
          { label: t("common.Bold"), value: "bold" },
          { label: t("common.Normal"), value: "normal" },
        ],
        type: "select",
      },
      {
        id: "fontSize",
        name: "fontSize",
        type: "rangeSlider",
        label: t("common.Message Font Size"),
      },
      {
        id: "fontColor",
        name: "fontColor",
        label: t("common.Message Text color"),
        labelPosition: "right",
        type: "colorPicker",
        size: "40px",
      },
    ],
  },
];

export const messageField = [
  "textEditor",
  "fontFamily",
  "fontSize",
  "fontColor",
  "fontFamilyEnabled",
  "fontStyle",
  "textToolEditor",
  "fontWeight",
];
export const messageInitialValues = {
  textEditor: "Type Your Banner Message ||",
  fontFamily: "Roboto",
  fontFamilyEnabled: false,
  fontStyle: "normal",
  fontSize: "18",
  fontColor: "#fff",
  fontWeight: "normal",
  // slideType: "announcement",
  textToolEditor: true,
};

export function Message(props) {
  const formFields = getformFields();
  const { handleSubmit, formRef, handleFormChange, initialValue } = props;
  return (
    <CommonForm
      onSubmit={handleSubmit}
      formFields={formFields}
      initialValues={initialValue}
      formRef={formRef}
      isSave={false}
      onFormChange={handleFormChange}
      noCompare={false}
      enableReinitialize={true}
    />
  );
}
