import React, { useCallback, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Box, Button, Card, Image, InlineStack, Text } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { BlankStar, FilledStar } from "@/Assets/Index";
import CommonForm from "@/Components/Common/CommonForm";

export default function Review() {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const [rate, setRate] = useState(urlParams.get("rate") || 5);
  const [feedBack, setFeedBack] = useState({ feedBack: "" });
  const formRef = useRef();
  const fetch = useAuthenticatedFetch();

  const formField = [
    {
      id: "feedBack",
      name: "feedBack",
      validated: false,
      type: "text",
      placeholder: t("common.Enter Your Feedback Here"),
      multiline: 3,
    },
  ];

  const handleSubmit = useCallback(async () => {
    formRef.current.fetchData();
  }, []);

  const postReview = useCallback(async () => {
    await fetch.post("/update/review", JSON.stringify({ review: { ...feedBack, rate } }));
    setFeedBack({});
  }, [feedBack, rate]);

  return (
    <div style={{ margin: "100px 200px" }}>
      <Card padding="1000">
        <BlockStack inlineAlign="center" gap={200}>
          <Text variant="headingXl">{t("common.Rate us!")}</Text>
          <Text fontWeight="medium" tone="subdued">
            {t("common.How would you Love this app?")}
          </Text>
          <InlineStack gap={100}>
            {[...Array(5)].map((_, index) => (
              <Button key={index} variant="plain" onClick={() => setRate(index + 1)}>
                <Image source={index + 1 > rate ? BlankStar : FilledStar} width={30} />
              </Button>
            ))}
          </InlineStack>
          <Box width="70%">
            <CommonForm
              onSubmit={handleSubmit}
              initialValues={feedBack}
              onFormChange={(val) => setFeedBack(val)}
              formFields={formField}
              formRef={formRef}
              isSave={false}
              enableReinitialize={true}
            />
          </Box>
          <InlineStack align="end">
            <Text />
            <Button variant="primary" onClick={postReview}>
              {t("common.Submit")}
            </Button>
          </InlineStack>
        </BlockStack>
      </Card>
    </div>
  );
}
