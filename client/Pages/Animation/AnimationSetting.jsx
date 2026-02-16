import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BlockStack, Card, Divider, Loading, Page } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import CommonForm from "@/Components/Common/CommonForm";
import { ToastContext } from "@/Context/ToastContext";
import { getAnimationFormFields, initialValue } from "../../Assets/Mocks/SelectorForm.mock";

export default function AnimationSetting({ backbutton }) {
  const fetch = useAuthenticatedFetch();
  const { showToast } = useContext(ToastContext);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();
  const [formValues, setFormValues] = useState(initialValue);

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

    // Dispatch crispAutomation event for review request
    window.dispatchEvent(
      new CustomEvent("crispAutomation", {
        detail: {
          type: "reviewRequest",
        },
      })
    );
  }, [formValues]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Page
        title={t("common.Animation setting")}
        backAction={backbutton}
        primaryAction={{
          content: t("common.Save Setting"),
          onAction: handleSubmit,
        }}
      >
        <BlockStack gap="400">
          <Divider borderColor="border" />
          <Card>
            <CommonForm
              onSubmit={handleSubmit}
              initialValues={formValues}
              formFields={getAnimationFormFields()}
              onFormChange={handleFormChange}
              formRef={formRef}
              isSave={false}
              enableReinitialize={true}
              noValueChanged={false}
            />
          </Card>
        </BlockStack>
      </Page>
    </>
  );
}
