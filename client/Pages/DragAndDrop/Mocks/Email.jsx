import React from "react";
import CommonForm from "@/Components/Common/CommonForm";

const getformFields = () => [
  {
    id: "emailFields",
    name: "emailFields",
    label: "Email Fields",
    nested: "object",
    groupSize: 4,
    section: false,
    subfields: [
      {
        id: "email",
        name: "email",
        label: "Email",
        type: "checkbox",
        disabled: true,
      },
      {
        id: "firstName",
        name: "firstName",
        label: "First Name",
        type: "checkbox",
      },
      {
        id: "lastName",
        name: "lastName",
        label: "Last Name",
        type: "checkbox",
      },
      {
        id: "Phone",
        name: "Phone",
        label: "Phone",
        type: "checkbox",
      },
    ],
  },
];

export const emailInitialValues = {
  emailFields: {
    email: true,
    firstName: false,
    lastName: false,
    Phone: false,
  },
};

export function Email(props) {
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
