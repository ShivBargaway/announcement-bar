import React from "react";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "productImage",
    name: "productImage",
    label: "Product Image",
    type: "checkbox",
  },
  {
    id: "productTitle",
    name: "productTitle",
    label: "Product Title",
    type: "checkbox",
  },
  {
    id: "comparePrice",
    name: "comparePrice",
    label: "Compare Price",
    type: "checkbox",
  },
  {
    id: "price",
    name: "price",
    label: "Price",
    type: "checkbox",
  },
];

export const ProductTitleInitialValues = {
  productImage: true,
  productTitle: true,
  comparePrice: true,
  price: true,
};

export function ProductTitle(props) {
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
