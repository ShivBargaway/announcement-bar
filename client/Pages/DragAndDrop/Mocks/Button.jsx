import React from "react";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";
import { removeFormfields } from "../../../Utils/AppUtils";

const getformFields = () => [
  {
    id: "callToActionOption",
    name: "callToActionOption",
    minimum: 1,
    nested: "object",
    groupSize: 1,
    section: false,
    subfields: [
      {
        id: "buttonType",
        name: "buttonType",
        label: t("common.Type"),
        options: [
          { label: t("common.Button"), value: "button" },
          { label: t("common.Entire clickable bar"), value: "entire" },
          { label: t("common.Add a simple link"), value: "btnLink" },
          { label: t("common.Add coupon placement"), value: "btnCoupon" },
        ],
        type: "select",
      },
    ],
  },
  {
    id: "targetLink",
    name: "targetLink",
    label: t("common.Linked Url"),
    labelPosition: "right",
    type: "text",
    placeholder: "http://example.com/",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: "entire",
      type: "hidden",
    },
  },
  {
    id: "textColor",
    name: "textColor",
    label: t("common.Background Hover Color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: "entire",
      type: "hidden",
    },
  },
  {
    id: "textHoverColor",
    name: "textHoverColor",
    label: t("common.Text Hover Color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: "entire",
      type: "hidden",
    },
  },
  {
    id: "btnName",
    name: "btnName",
    label: t("common.Button Text"),
    labelPosition: "right",
    type: "text",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnCopiedText",
    name: "btnCopiedText",
    label: t("common.Copied Text"),
    labelPosition: "right",
    type: "text",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnBorder",
    name: "btnBorder",
    label: t("common.Border"),
    labelPosition: "right",
    options: [
      { label: t("common.Bashed"), value: "2px dashed" },
      { label: t("common.None"), value: "none" },
    ],
    type: "select",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["btnCoupon"],
      type: "hidden",
    },
  },

  {
    id: "btnLink",
    name: "btnLink",
    label: t("common.URL"),
    labelPosition: "right",
    type: "text",
    placeholder: "http://example.com/",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink"],
      type: "hidden",
    },
  },
  {
    id: "openEnabled",
    name: "openEnabled",
    label: t("common.Open in the new tab"),
    labelPosition: "left",
    type: "checkbox",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "entire"],
      type: "hidden",
    },
  },
  {
    id: "btnFontSize",
    name: "btnFontSize",
    label: t("common.Font Size"),
    labelPosition: "right",
    type: "rangeSlider",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },

  {
    id: "btnRadius",
    name: "btnRadius",
    label: t("common.Button Radius"),
    labelPosition: "right",
    type: "rangeSlider",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnColor",
    name: "btnColor",
    label: t("common.Button color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnTextColor",
    name: "btnTextColor",
    label: t("common.Button Text color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnHoverColor",
    name: "btnHoverColor",
    label: t("common.Button Hover Color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
  {
    id: "btnTextHoverColor",
    name: "btnTextHoverColor",
    label: t("common.button Text HoverColor"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
    dependOn: {
      name: "callToActionOption.buttonType",
      value: ["button", "btnLink", "btnCoupon"],
      type: "hidden",
    },
  },
];
export const calltoActionField = [
  "btnName",
  "btnLink",
  "btnCopiedText",
  "openEnabled",
  "targetLink",
  "btnFontSize",
  "btnColor",
  "btnTextColor",
  "btnRadius",
  "btnHoverColor",
  "btnTextHoverColor",
  "callToAction",
  "textColor",
  "textHoverColor",
  {
    fieldName: "callToActionOption",
    fields: ["buttonType"],
  },
];

export const buttonInitialValues = {
  callToActionOption: { buttonType: "button" },
  btnName: "Shop now!",
  btnLink: "",
  btnCopiedText: "",
  openEnabled: false,
  targetLink: "",
  btnFontSize: 14,
  btnColor: "#ffffff",
  btnTextColor: "#453e3e",
  btnRadius: 4,
  btnHoverColor: "",
  btnTextHoverColor: "",
  callToAction: true,
  textColor: "#0D0E0C",
  textHoverColor: "#53BE0F",
};

export function ButtonComponent(props) {
  let formFields = getformFields();
  const { handleSubmit, formRef, handleFormChange, initialValue, fieldsToRemove } = props;
  formFields = removeFormfields(formFields, fieldsToRemove);
  return (
    <CommonForm
      onSubmit={handleSubmit}
      formFields={formFields}
      initialValues={initialValue}
      formRef={formRef}
      isSave={false}
      onFormChange={handleFormChange}
      enableReinitialize={true}
    />
  );
}
