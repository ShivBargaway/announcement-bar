import React, { useEffect, useState } from "react";
import { BlockStack, Card, InlineGrid, InlineStack, Link, Text, Thumbnail } from "@shopify/polaris";
import { getClientReviews } from "@/Assets/Mocks/ClientReviews.mock";

export default function ClientReviews() {
  const reviews = getClientReviews();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const review = reviews[current];

  const renderStars = (rating) => (
    <InlineStack align="start">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            color: i < rating ? "#FFB800" : "#E1E3E5",
            fontSize: "18px",
          }}
        >
          ★
        </span>
      ))}
    </InlineStack>
  );

  return (
    <Card>
      <BlockStack gap="400" alignment="center">
        <InlineGrid columns={"0.3fr 0.5fr 2.2fr"}>
          <InlineStack blockAlign="center">
            <Thumbnail source={review.image} size="large" alt={review.name} />
          </InlineStack>

          <BlockStack gap="200">
            <Link url={review.url} target="_blank" removeUnderline>
              {review.name}
            </Link>
            <InlineStack gap="200">
              {renderStars(review.rating)}
              <Text fontWeight="medium">{review.rating}/5</Text>
            </InlineStack>
            <Text tone="subdued">📍 {review.location}</Text>
            {review.shopifyPlan && <Text tone="subdued">🛒 Shopify plan: {review.shopifyPlan}</Text>}
            {review.customerSince && <Text tone="subdued">⏱️ With us for {review.customerSince}</Text>}
          </BlockStack>

          <div
            style={{
              position: "relative",
              padding: "16px",
              backgroundColor: "#F8F9FA",
              borderRadius: "12px",
              border: "1px solid #DCE1E5",
              fontStyle: "italic",
              height: "130px",
              maxHeight: "130px",
              overflowY: "auto",
            }}
          >
            <Text variant="bodyMd" as="p" alignment="center">
              “{review.review}”
            </Text>
          </div>
        </InlineGrid>
      </BlockStack>
    </Card>
  );
}
