import React from "react";
import { Text } from "@shopify/polaris";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => {
  return [
    {
      nested: "group",
      groupSize: 2,
      section: false,
      label: (
        <Text variant="headingSm" fontWeight={"Bold"} as="span">
          {t("common.Rotating Animation Setting")}
        </Text>
      ),
      subfields: [
        {
          id: "autoplayTime",
          name: "autoplayTime",
          validated: false,
          label: t("common.Auto play time (time in MS)"),
          labelPosition: "right",
          type: "number",
        },
        {
          id: "animationTime",
          name: "animationTime",
          validated: false,
          label: t("common.Animation time (time in MS)"),
          labelPosition: "right",
          type: "number",
        },
      ],
    },
    {
      nested: "group",
      groupSize: 2,
      section: false,
      label: (
        <Text variant="headingSm" fontWeight={"Bold"} as="span">
          {t("common.Marquee Animation Setting")}
        </Text>
      ),
      subfields: [
        {
          id: "textAnimationTime",
          name: "textAnimationTime",
          validated: false,
          label: t("common.Auto play time (time in Second)"),
          labelPosition: "right",
          type: "number",
        },

        {
          id: "textAnimationPadding",
          name: "textAnimationPadding",
          validated: false,
          label: t("common.Space between slide(px)"),
          labelPosition: "right",
          type: "number",
        },
      ],
    },
  ];
};
export const animationfield = ["autoplayTime", "animationTime", "textAnimationTime", "textAnimationPadding"];

export function Animation(props) {
  const { handleSubmit, formRef, handleFormChange, initialValue } = props;
  const formFields = getformFields();
  return (
    <CommonForm
      onSubmit={handleSubmit}
      formFields={formFields}
      initialValues={initialValue}
      formRef={formRef}
      isSave={false}
      onFormChange={handleFormChange}
      enableReinitialize={true}
      noValueChanged={false}
    />
  );
}
