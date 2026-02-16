import React, { useState } from "react";
import { BlockStack, Collapsible, Text } from "@shopify/polaris";
import { t } from "i18next";
import DismissibleBanner from "@/Components/Common/DismissibleBanner";

export default function CommonFaqSection({ faqList }) {
  const [openIndexes, setOpenIndexes] = useState([]);

  const handleToggle = (index) => {
    setOpenIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  return (
    <DismissibleBanner
      tone="info"
      title={t("common.Frequently asked questions")}
      bannerName="frequentlyAskedQuestions"
      skipRemove={true}
      bannerText={
        <BlockStack gap="100">
          {faqList.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div key={index} style={{ border: "1px solid #E1E3E5", borderRadius: "6px", overflow: "hidden" }}>
                <button
                  onClick={() => handleToggle(index)}
                  style={{
                    all: "unset",
                    width: "100%",
                    padding: "8px 12px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Text variant="headingSm" fontWeight="medium">
                    {index + 1}. {faq.question}
                  </Text>
                </button>
                <Collapsible open={isOpen}>
                  <div style={{ padding: "14px 16px", borderTop: "1px solid #E1E3E5", backgroundColor: "#fff" }}>
                    <Text as="p" variant="bodyMd" tone="subdued">
                      {faq.answer}
                    </Text>
                  </div>
                </Collapsible>
              </div>
            );
          })}
        </BlockStack>
      }
    />
  );
}
