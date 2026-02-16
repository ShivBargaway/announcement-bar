import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { excludeFields } from "@/Assets/Mocks/User.mock";
import CommonForm from "@/Components/Common/CommonForm";
import { ViewCommonField, makeCommonFormField } from "../../Utils/Utils";

const trialDayField = (user) => {
  if (!user?.trial_days && user?.trial_days !== 0 && user?.trial_days !== null) {
    return [{ id: "trial_days", name: "trial_days", label: "trial_days", type: "number" }];
  } else return [];
};

export default function UpdateUserButton(props) {
  const { currentUser, formType, openModel, setOpenModel, childRef } = props;
  const fetch = useAuthenticatedFetch();
  const [formValues, setFormValues] = useState(currentUser);
  const formRef = useRef();

  const closeForm = useCallback(() => {
    setOpenModel(!openModel);
  }, [formType]);

  const submitForm = useCallback((e) => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  const updateUser = useCallback(
    async (values) => {
      if (values?.trial_days === "") delete values?.trial_days;
      const response = await fetch.put(`admin/updateUser`, { data: { $set: values }, _id: values?._id });
      childRef.current.fetchData();
      setOpenModel(false);
    },
    [formType]
  );

  useEffect(() => {
    setFormValues(currentUser);
  }, [currentUser]);

  return (
    <Modal
      size="large"
      open={openModel}
      title={formType === "update" ? `Update User Form` : "View User Form"}
      onClose={closeForm}
      primaryAction={
        formType === "update" && {
          content: "Save",
          onAction: submitForm,
        }
      }
    >
      <Modal.Section>
        {formType === "update" && (
          <CommonForm
            onSubmit={updateUser}
            formRef={formRef}
            initialValues={formValues}
            formFields={[...makeCommonFormField(currentUser, excludeFields), ...trialDayField(currentUser)]}
            title="currency converter"
            isSave={false}
          />
        )}
        {formType === "view" && <ViewCommonField user={currentUser} />}
      </Modal.Section>
    </Modal>
  );
}
