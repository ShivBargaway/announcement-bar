import React from "react";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "shippingBarMessage",
    name: "shippingBarMessage",
    nested: "object",
    groupSize: 1,
    section: true,
    subfields: [
      {
        id: "messageStart",
        name: "messageStart",
        label: t("common.Initial Message"),
        validated: true,
        type: "text",
      },
      {
        id: "shippingPrice",
        name: "shippingPrice",
        label: t("common.Shipping Goal"),
        validated: true,
        type: "number",
      },
      {
        id: "messageEnd",
        name: "messageEnd",
        label: t("common.Initial Message"),
        validated: true,
        type: "text",
      },
    ],
  },
  {
    id: "progressMessage",
    name: "progressMessage",
    nested: "object",
    groupSize: 2,
    section: true,
    subfields: [
      {
        id: "progressStart",
        name: "progressStart",
        label: t("common.Progress Message"),
        validated: true,
        type: "text",
      },
      {
        id: "progressGoal",
        name: "progressGoal",
        label: t("common.Progress goal"),
        validated: true,
        type: "text",
      },
      {
        id: "progressEnd",
        name: "progressEnd",
        label: t("common.Progress Message"),
        validated: true,
        type: "text",
      },
    ],
  },
  {
    nested: "group",
    groupSize: 1,
    section: true,
    subfields: [
      {
        id: "goalMessage",
        name: "goalMessage",
        label: t("common.Goal Message"),
        validated: true,
        type: "text",
      },
    ],
  },
  {
    nested: "group",
    groupSize: 3,
    section: true,
    subfields: [
      {
        id: "currencySymbol",
        name: "currencySymbol",
        label: t("common.Currency Symbol"),
        validated: true,
        type: "text",
      },
      {
        id: "currencyPosition",
        name: "currencyPosition",
        label: t("common.Currency Position"),
        validated: true,
        type: "select",
        options: [
          { label: t("common.Before"), value: "before" },
          { label: t("common.After"), value: "after" },
        ],
      },
      {
        id: "moneyClass",
        name: "moneyClass",
        label: t("common.money Class"),
        validated: true,
        type: "checkbox",
      },
    ],
  },
  {
    nested: "group",
    groupSize: 1,
    section: true,
    subfields: [
      {
        id: "shippingColor",
        name: "shippingColor",
        label: t("common.Shipping Price Color"),
        validated: true,
        type: "colorPicker",
        size: "40px",
      },
      {
        id: "shippingSize",
        name: "shippingSize",
        label: t("common.Shipping Price Size"),
        validated: true,
        type: "rangeSlider",
      },
      {
        id: "shippingWeight",
        name: "shippingWeight",
        label: t("common.Shipping Font Weight"),
        validated: true,
        type: "select",
        options: [
          { label: "100", value: "100" },
          { label: "400", value: "400" },
          { label: "600", value: "600" },
          { label: "700", value: "700" },
          { label: "900", value: "900" },
          { label: t("common.Bold"), value: "bold" },
          { label: t("common.Normal"), value: "normal" },
        ],
      },
    ],
  },
  {
    nested: "group",
    groupSize: 1,
    section: true,
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

const messageField = [
  "goalMessage",
  {
    fieldName: "shippingBarMessage",
    fields: ["messageStart", "shippingPrice", "messageEnd"],
  },
  {
    fieldName: "progressMessage",
    fields: ["progressStart", "progressEnd", "progressGoal"],
  },
];

export const shippingInitialValue = {
  shippingBarMessage: {
    messageStart: "Free shipping for orders over",
    shippingPrice: 100,
    messageEnd: "!hurry Up",
  },
  progressMessage: {
    progressStart: "Only ",
    progressEnd: "away from free shipping",
    progressGoal: "$40",
  },
  goalMessage: "Congratulations! You have got free shipping",
  fontFamily: "Roboto",
  fontFamilyEnabled: false,
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: "18",
  fontColor: "#fff",
  slideType: "shippingBar",
  shippingColor: "",
  shippingSize: "18",
  shippingWeight: "100",
  currencySymbol: "$",
  moneyClass: false,
  currencyPosition: "before",
};

function ShippingText(props) {
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
      enableReinitialize={true}
    />
  );
}

export { ShippingText, messageField };
