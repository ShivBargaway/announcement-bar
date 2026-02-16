import React, { useContext, useRef } from "react";
import { BlockStack, Icon, InlineStack, Scrollable, Text } from "@shopify/polaris";
import { CaretDownIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { SuggestedItem } from "@/Components/Common/SuggestedItems/SuggestedItem";
import VideoTitle from "@/Components/Common/VideoTitle";
import { OnboardingContext } from "@/Context/OnboardingContext";

export function SuggestedItems({ index = 0 }) {
  const scrollableRef = useRef(null);

  const { suggestedItems } = useContext(OnboardingContext);

  const navigatorArrows = suggestedItems.filter((item) => item.status !== true)?.length > 3;

  const handleScroll = (direction) => {
    const scrollableNode = document.querySelector(
      `#suggested-items-container-${index} .Polaris-Scrollable--horizontal`
    );
    if (scrollableNode) {
      if (scrollableNode.scrollLeft == "NaN" || scrollableNode.scrollLeft == undefined) {
        scrollableNode.scrollLeft = 0;
      }
      const scrollAmount = 292;
      if (direction === "left") {
        scrollableNode.scrollLeft -= scrollAmount;
      } else if (direction === "right") {
        scrollableNode.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    suggestedItems &&
    suggestedItems.length > 0 && (
      <BlockStack gap="200">
        <VideoTitle
          selector={`Suggested for you`}
          titleLabel={<Text variant="headingMd">{t("common.Suggested for you")}</Text>}
        />

        <div className="suggested-items-container" id={`suggested-items-container-${index}`}>
          {navigatorArrows && (
            <div className="previous" onClick={() => handleScroll("left")}>
              <Icon source={CaretDownIcon}></Icon>
            </div>
          )}
          <Scrollable vertical={false} ref={scrollableRef} scrollbarWidth="none">
            <InlineStack gap="300" wrap={false}>
              {suggestedItems.map(
                (item, index) => item.status !== true && <SuggestedItem key={index} index={index} item={item} />
              )}
            </InlineStack>
          </Scrollable>
          {navigatorArrows && (
            <div className="next" onClick={() => handleScroll("right")}>
              <Icon source={CaretDownIcon}></Icon>
            </div>
          )}
        </div>
      </BlockStack>
    )
  );
}
