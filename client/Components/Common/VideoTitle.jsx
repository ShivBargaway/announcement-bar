import React, { useContext, useMemo } from "react";
import { InlineStack } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";
import VideoPopup from "./VideoPopup";

export default function VideoTitle({ selector, positionName = "label", titleLabel }) {
  const { videoLinks } = useContext(ProfileContext);
  const linkData = useMemo(
    () => videoLinks?.find((e) => e.selector === selector)?.linkValue,
    [videoLinks, selector]
  );

  const position = linkData?.linkPosition?.filter((e) => e.position === positionName);
  const hasBefore = position?.find((e) => e.beforeOrAfter === "before") ? true : false;
  const hasAfter = position?.find((e) => e.beforeOrAfter === "after") ? true : false;

  if (selector && position?.length > 0) {
    if (titleLabel) {
      return (
        <InlineStack blockAlign="center" gap={100}>
          {hasBefore && (
            <VideoPopup linkData={linkData} buttonName={`${selector.replace(/\s+/g, "")}Before${positionName}`} />
          )}
          {titleLabel}
          {hasAfter && (
            <VideoPopup linkData={linkData} buttonName={`${selector.replace(/\s+/g, "")}After${positionName}`} />
          )}
        </InlineStack>
      );
    } else return <VideoPopup linkData={linkData} buttonName={selector} />;
  }
  return titleLabel;
}
