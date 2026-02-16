import React, { useCallback, useEffect, useRef, useState } from "react";
import { Modal } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";

export const AITextGenerator = ({
  selectedData,
  showAiModal,
  setShowAiModal,
  setAiGeneratedValue,
  aiGeneratedValue,
  closeModals,
  handleAiSubmit,
}) => {
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    selectedData: selectedData,
    AiInstruction: "",
    aiData: "",
  });

  const getFormFields = (aiGeneratedValue) => {
    const formFields = [
      {
        id: "selectedData",
        name: "selectedData",
        label: "Selected Text",
        validated: true,
        type: "text",
        errormsg: "selected text is required",
      },
      {
        id: "AiInstruction",
        name: "AiInstruction",
        label: "AI Instruction",
        validated: true,
        type: "text",
        errormsg: "AI Instruction is required",
        placeholder: "e.g. Improve more and describe deeply",
        helpText: "We use above instruction and update your selected data using AI",
      },
    ];
    if (aiGeneratedValue) {
      formFields.push({
        id: "aiData",
        name: "aiData",
        label: "AI Generated Text",
        validated: true,
        type: "text",
        errormsg: "AI Generated Value is required",
      });
    }
    return formFields;
  };

  const saveForm = useCallback(() => {
    if (formRef.current) formRef.current.handleSubmit();
  }, [formRef]);

  const handleFormChange = useCallback(
    (values) => {
      setFormValues({ ...formValues, ...values });
    },
    [formValues]
  );

  const handleSubmit = useCallback(
    async (value) => {
      setLoading(true);
      let res;
      if (aiGeneratedValue) {
        handleAiSubmit(formValues.aiData);
      } else {
        res = await fetch.post("/create/customize/ai", value);
        if (res.data?.value) {
          setAiGeneratedValue(res.data.value);
        }
      }
      setLoading(false);
      res?.data?.value && setFormValues({ ...value, aiData: res.data.value });
    },
    [aiGeneratedValue, formValues]
  );

  return (
    <Modal
      open={showAiModal}
      onClose={closeModals}
      title="AI Generator"
      primaryAction={{
        content: aiGeneratedValue ? "Apply changes" : "Submit",
        onAction: saveForm,
        loading: loading,
      }}
      secondaryActions={[
        {
          content: t("common.Close"),
          onAction: closeModals,
        },
      ]}
    >
      <Modal.Section>
        {formValues && (
          <CommonForm
            onSubmit={handleSubmit}
            initialValues={formValues}
            formFields={getFormFields(aiGeneratedValue)}
            formRef={formRef}
            onFormChange={handleFormChange}
            isSave={false}
            noCompare={false}
            noValueChanged={false}
            enableReinitialize={true}
          />
        )}
      </Modal.Section>
    </Modal>
  );
};
