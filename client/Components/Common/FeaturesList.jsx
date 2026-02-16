import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Box, Checkbox, InlineGrid, InlineStack, Text } from "@shopify/polaris";

export function FeaturesList({ setFeatures, features, setFeaturesInOrder }) {
  const { t } = useTranslation();

  const [status, setStatus] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const [shuffledFeatures, setShuffledFeatures] = useState(() => shuffleArray(features));

  const changeStatus = (id, label, isChecked, index) => {
    const selectedFeaturesCount = Object.values(status).filter((isSelected) => isSelected).length;

    if (isChecked) {
      const data = {
        id: id,
        index: index,
        label: label,
      };
      if (selectedItems.some((selected) => selected.id === id)) {
        setSelectedItems((prevSelected) => prevSelected.filter((selected) => selected.id !== id));
      } else {
        setSelectedItems((prevSelected) => [...prevSelected, data]);
      }
    } else {
      setSelectedItems((prevSelected) => prevSelected.filter((selected) => selected.id !== id));
    }
    if (!isChecked) {
      setStatus((prevStatus) => {
        const updatedStatus = { ...prevStatus };
        delete updatedStatus[id];
        return updatedStatus;
      });
      return;
    }

    if (selectedFeaturesCount === 3 && !status[id]) {
      return;
    }
    setStatus((prevStatus) => ({
      ...prevStatus,
      [id]: isChecked,
    }));
  };

  useEffect(() => {
    setFeatures(status);
  }, [status]);

  useEffect(() => {
    setFeaturesInOrder(selectedItems);
  }, [selectedItems]);

  return (
    <InlineStack gap="500" align="center">
      <Box padding="500" maxWidth="600px">
        <BlockStack gap="500">
          <Text variant="headingMd" as="h6">
            {t("common.Select any three problem your are facing right now in your store SEO ?")}
          </Text>
          <InlineGrid gap="400" columns={2} alignItems="center" padding="400">
            {shuffledFeatures.map((feature, index) => (
              <Checkbox
                key={index}
                label={feature.name}
                checked={status[feature.id] || false}
                disabled={Object.keys(status).length === 3 && !status[feature.id]}
                onChange={(isChecked) => changeStatus(feature.id, feature.label, isChecked, index)}
              />
            ))}
          </InlineGrid>
        </BlockStack>
      </Box>
    </InlineStack>
  );
}
