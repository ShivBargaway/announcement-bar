import React from "react";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "variant",
    name: "variant",
    label: "Variant",
    type: "checkbox",
  },
];

export const VariantInitialValues = {
  variant: true,
};

export function Variant(props) {
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
