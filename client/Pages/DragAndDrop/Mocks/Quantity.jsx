import React from "react";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "quantity",
    name: "quantity",
    label: "Quantity",
    type: "checkbox",
  },
];

export const quantityInitialValues = {
  quantity: true,
};

export function Quantity(props) {
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
