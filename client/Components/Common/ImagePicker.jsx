import React, { useCallback, useEffect, useState } from "react";
import { BlockStack, Card, DropZone, Icon, InlineError, InlineStack, Text, Thumbnail } from "@shopify/polaris";
import { XCircleIcon } from "@shopify/polaris-icons";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { getValueFromNestedObject } from "@/Utils/Index";

export default function ImagePicker(props) {
  const fetch = useAuthenticatedFetch();
  const {
    form: { values, setFieldValue, errors, validateForm },
    field: { name, label },
  } = props;
  const { type, ...restFieldProps } = props.field;
  const value = getValueFromNestedObject(values, name);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!props.field.allowMultiple) {
      if (values[name]) {
        setFiles([values[name]]);
      }
    } else {
      setFiles(values[name]);
    }
  }, []);

  useEffect(() => {
    if (!props.field.allowMultiple) {
      setFieldValue(name, files[0]);
    } else {
      setFieldValue(name, files);
    }

    validateForm(values);
  }, [files]);

  const handleDrop = useCallback(
    async (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setLoading(true);
      const formData = new FormData();
      acceptedFiles.forEach((value) => {
        formData.append("files", value);
      });

      const response = await fetch.post("/upload-to-shopify", formData, true, {
        "Content-Type": " multipart/form-data",
      });
      const newFiles = [...files, ...response.data].filter((file) => file.url && file.url !== "");
      setFiles(newFiles);
      setLoading(false);
    },
    [files]
  );

  const handleRemoveFile = async (file, index) => {
    //Remove file from shopify
    // console.log("Removing file :", file);
    // const removeFile = await fetch.delete("/remove-file", file);
    // console.log("removeFile", removeFile);

    //Remove file from state
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <BlockStack gap="200">
      <Text as="p">{label}</Text>
      <InlineStack gap="400" blockAlign="center">
        {files?.map((file, index) => (
          <Card padding="200" key={index}>
            <div className="file-upload-preview">
              <div className="remove-file" onClick={() => handleRemoveFile(file, index)}>
                <Icon source={XCircleIcon} tone="base" />
              </div>
              <Thumbnail size="large" alt={file.name} source={file.url} />
            </div>
          </Card>
        ))}
        {props.field.allowMultiple ? (
          <DropZone {...restFieldProps} type={restFieldProps.fileType} label="" onDrop={handleDrop}>
            <DropZone.FileUpload type={restFieldProps.fileType} />
          </DropZone>
        ) : (
          files.length === 0 && (
            <DropZone {...restFieldProps} label="" type={restFieldProps.fileType} onDrop={handleDrop}>
              <DropZone.FileUpload />
            </DropZone>
          )
        )}
      </InlineStack>
      <InlineError message={errors[name]} />
      {props.helpText && props.helpText.length > 0 && (
        <Text as="span" variant="bodySm" tone="subdued">
          {props.helpText}
        </Text>
      )}
    </BlockStack>
  );
}
