import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BlockStack, Card, Divider, Loading, Page } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";
import { ToastContext } from "@/Context/ToastContext";
import {
  getSelectorFormFields,
  getcustomCssFormFields,
  initialValue,
} from "../../Assets/Mocks/SelectorForm.mock.jsx";

export default function CustomCss({ backbutton }) {
  const fetch = useAuthenticatedFetch();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(initialValue);
  const { showToast } = useContext(ToastContext);
  const formRef = useRef();

  const handleFormChange = useCallback(
    (e) => {
      setFormValues((previous) => ({ ...previous, ...e }));
    },
    [formValues]
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const type = "all";
      const res = await fetch.get(`animation-backend?type=${type}`);
      setFormValues({ ...res.data });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }, [formValues]);

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = useCallback(async () => {
    delete formValues.annoucements;
    await fetch.put(`animation/${formValues._id}`, formValues);
    showToast(t("common.Update successfully"));
  }, [formValues]);

  if (loading) {
    return <Loading />;
  }

  const formSections = [getcustomCssFormFields, getSelectorFormFields].filter(
    (getFormFields) => getFormFields().length > 0
  );

  return (
    <>
      <Page
        title={t("common.Custom Css")}
        backAction={backbutton}
        primaryAction={{
          content: t("common.Save Setting"),
          onAction: handleSubmit,
        }}
      >
        <BlockStack gap="400">
          <Divider borderColor="border" />
          {formSections.map((getFormFields, index) => (
            <div key={index} style={{ width: "100%" }}>
              <Card>
                <CommonForm
                  onSubmit={handleSubmit}
                  initialValues={formValues}
                  formFields={getFormFields()}
                  onFormChange={handleFormChange}
                  formRef={formRef}
                  isSave={false}
                  enableReinitialize={true}
                  noValueChanged={false}
                />
              </Card>
            </div>
          ))}
        </BlockStack>
      </Page>
    </>
  );
}
