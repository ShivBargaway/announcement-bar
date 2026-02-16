import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Box, Button, Divider, Icon, InlineStack, Link, Popover, Text } from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { SupportData } from "@/Assets/Mocks/Support.mock";
import { ProfileContext } from "@/Context/ProfileContext";

export default function Support() {
  const { profileData } = useContext(ProfileContext);
  const [popoverActive, setPopoverActive] = useState(false);
  const [currentSupportData, setCurrentSupportData] = useState({});
  const location = useLocation();

  const togglePopoverActive = useCallback(() => {
    setPopoverActive((popoverActive) => !popoverActive);
  }, [profileData, popoverActive]);

  useEffect(() => {
    let data = SupportData.find((support) => support.destination === location.pathname);
    setCurrentSupportData(data);
    setPopoverActive(false);
  }, [SupportData, location]);

  if (!currentSupportData) return;

  return (
    <Popover
      active={popoverActive}
      activator={
        <div
          className={
            currentSupportData.fullWidth
              ? "Polaris-Page Polaris-Page--fullWidth Support-page"
              : "Polaris-Page Support-page"
          }
        >
          <div className="support-section">
            <Button onClick={togglePopoverActive} variant="primary">
              {t("common.Help")}
            </Button>
          </div>
        </div>
      }
      preferredAlignment="right"
      preferredPosition="below"
      preferInputActivator
      autofocusTarget="first-node"
      onClose={togglePopoverActive}
    >
      <div className="sidebar-support">
        <Box padding="500">
          <BlockStack gap="500">
            <InlineStack gap="800" blockAlign="center" align="space-between">
              <Text variant="headingLg" as="h5">
                {currentSupportData?.help?.title}
              </Text>
              <Button variant="plain" onClick={togglePopoverActive}>
                <Icon source={XIcon} tone="base" />
              </Button>
            </InlineStack>
            <Divider />
            <BlockStack gap="300" align="start">
              {currentSupportData?.help?.list?.map((e, i) => (
                <Link key={i} url={e.url} target="_blank">
                  {e.title}
                </Link>
              ))}
            </BlockStack>
          </BlockStack>
        </Box>
      </div>
    </Popover>
  );
}
