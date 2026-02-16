import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@shopify/polaris";
import CommonForm from "@/Components/Common/CommonForm";

export const getFormFields = (placeholder) => [
  {
    id: "source",
    name: "source",
    label: "Source",
    type: "text",
    placeholder: placeholder,
  },
  {
    id: "embedCode",
    name: "embedCode",
    label: "Insert a video by pasting the embed snippet in the box below.",
    type: "text",
    helpText: "The embed snippet usually starts with <iframe …",
  },
  {
    nested: "group",
    groupSize: 2,
    section: false,
    subfields: [
      {
        id: "width",
        name: "width",
        label: "Width",
        validated: true,
        type: "number",
        min: 0,
      },
      {
        id: "height",
        name: "height",
        label: "Height",
        validated: true,
        type: "number",
        min: 0,
      },
    ],
  },
];

export default function VideoButton({ showVideoModal, closeModals, handleVideoSubmit, selectedVideo }) {
  const { t } = useTranslation();
  const formRef = useRef();
  const [formValues, setFormValues] = useState({
    source: "",
    embedCode: "",
  });

  useEffect(() => {
    if (selectedVideo) {
      setFormValues({ ...selectedVideo });
    }
  }, [selectedVideo]);

  const placeholder = "e.g. https://www.youtube.com/embed/w01V5FI03MQ";

  const extractDimensionsFromEmbedCode = (embedCode) => {
    const widthMatch = embedCode.match(/width="(\d+)"/);
    const heightMatch = embedCode.match(/height="(\d+)"/);

    return {
      width: widthMatch ? widthMatch[1] : null,
      height: heightMatch ? heightMatch[1] : null,
    };
  };

  useEffect(() => {
    if (formValues.embedCode) {
      const { width, height } = extractDimensionsFromEmbedCode(formValues.embedCode);
      setFormValues((prevValues) => ({
        ...prevValues,
        width: width || prevValues.width,
        height: height || prevValues.height,
      }));
    }
  }, [formValues.embedCode]);

  const saveForm = useCallback(() => {
    if (formRef.current) formRef.current.handleSubmit();
  }, [formRef]);

  const handleFormChange = useCallback(
    (values) => {
      setFormValues({ ...formValues, ...values });
    },
    [formValues]
  );

  return (
    <Modal
      open={showVideoModal}
      title="Add Video"
      onClose={closeModals}
      primaryAction={{
        content: "Add Video",
        onAction: saveForm,
      }}
      secondaryActions={[
        {
          content: t(`common.Cancel`),
          onAction: closeModals,
        },
      ]}
    >
      <Modal.Section>
        {formValues && (
          <CommonForm
            onSubmit={handleVideoSubmit}
            initialValues={formValues}
            formFields={getFormFields(placeholder)}
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
}
