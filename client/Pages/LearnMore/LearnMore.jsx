import React, { useState } from "react";
import { Button, InlineStack, Text } from "@shopify/polaris";
import { t } from "i18next";
import VideoAnnouncement from "../Animation/VideoAnnouncement";

export default function LearnMore({ title }) {
  const [videoModalStatus, setVideoModalStatus] = useState(false);

  const openVideoPopup = () => {
    setVideoModalStatus(true);
  };

  return (
    <div>
      <InlineStack align="center">
        <Text>
          {t("common.Learn more about")}{" "}
          <Button variant="plain" onClick={openVideoPopup}>
            {title}
          </Button>
        </Text>
        {videoModalStatus && (
          <VideoAnnouncement
            videoModalStatus={videoModalStatus}
            setVideoModalStatus={setVideoModalStatus}
            videoLink="https://www.loom.com/embed/0409a8ca69234e4f9a5f30ed9e146d87"
            skip={false}
          />
        )}
      </InlineStack>
    </div>
  );
}
