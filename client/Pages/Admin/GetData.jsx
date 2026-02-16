import React, { useCallback, useEffect, useRef, useState } from "react";
import { BlockStack, Button, Divider, InlineStack, List, Text } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { formFields, initialValues } from "@/Assets/Mocks/GetData.mock";
import CommonForm from "@/Components/Common/CommonForm";

function GetData() {
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();
  const [responseData, setResponseData] = useState([]);
  const [showWarning, setShowWarning] = useState();
  const [dynamicFormField, setDynamicFormField] = useState(formFields());

  const handleSubmit = useCallback(async (value) => {
    const query = checkJsonQuery(value?.query || "{}");
    const fields = checkJsonQuery(value?.fields || "{}");
    if (query && fields) {
      const response = await fetch.post(`admin/getDynamicFields`, { ...value, query, fields });
      setResponseData(response.data);
    }
  }, []);

  const submitForm = useCallback(() => {
    setResponseData();
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  }, []);

  const checkJsonQuery = (query) => {
    try {
      const jsonVal = JSON.parse(query);
      if (typeof jsonVal == "object") {
        setShowWarning();
        return JSON.parse(query);
      } else setShowWarning("make proper query");
    } catch (error) {
      setShowWarning(error?.message || "make proper query");
    }
  };

  const getAllCollectionNames = async () => {
    const response = await fetch.get(`admin/getAllCollectionNames`);
    const options = response?.data?.map((e) => {
      return { label: e, value: e };
    });
    setDynamicFormField(formFields(options));
  };

  useEffect(() => {
    getAllCollectionNames();
  }, []);

  return (
    <div className="getData" style={{ padding: "40px" }}>
      <BlockStack gap="200">
        <CommonForm
          onSubmit={handleSubmit}
          initialValues={initialValues}
          formFields={dynamicFormField}
          title="searchUserQuery"
          formRef={formRef}
          isSave={false}
          enableReinitialize={true}
          noValueChanged={false}
        />
        <InlineStack align="end">
          <Button variant="primary" onClick={submitForm} medium>
            Search
          </Button>
        </InlineStack>

        {showWarning && (
          <InlineStack align="end">
            <Text tone="critical">{showWarning}</Text>
          </InlineStack>
        )}
        <Text fontWeight="bold">Your Response is </Text>

        {responseData &&
          (typeof responseData === "object" ? (
            <List type="number">
              {responseData?.map((item, index) => (
                <div key={index}>
                  <List.Item key={index}>
                    {typeof item === "string"
                      ? item
                      : Object.keys(item).map((key) => (
                          <Text key={key}>
                            <b>{key}</b> : {JSON.stringify(item[key])}
                          </Text>
                        ))}
                  </List.Item>
                  <Divider borderColor={"border-inverse"} />
                </div>
              ))}
            </List>
          ) : (
            <Text> {responseData}</Text>
          ))}
      </BlockStack>
    </div>
  );
}

export default GetData;
