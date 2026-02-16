import React, { useEffect, useState } from "react";
import { BlockStack, Box, Divider, Icon, InlineStack, Text, Tooltip } from "@shopify/polaris";
import { ViewIcon } from "@shopify/polaris-icons";
import { getcountryData, getpageData } from "../../Assets/Mocks/CountryObj";

export default function SlideHideReason(props) {
  const { item } = props;
  const countryData = getcountryData();
  const pageData = getpageData();
  const [countryLabels, setCountryLabels] = useState("");
  const [pageLabels, setPageLabels] = useState("");

  useEffect(() => {
    const mappedCountryData = item.countryData.map((e) => ({ value: e }));
    const matchCountryData = countryData.filter((countryDataItem) => {
      return mappedCountryData.some((multidataItem) => multidataItem.value === countryDataItem.value);
    });
    const labels = matchCountryData.map((country) => country.label).join(", ");
    setCountryLabels(labels);

    const mappedPageData = item.type.map((e) => ({ value: e }));
    const matchPageData = pageData.filter((typeItem) => {
      return mappedPageData.some((multidataItem) => multidataItem.value === typeItem.value);
    });
    const Pages = matchPageData.map((page) => page.label).join(", ");

    setPageLabels(Pages);
  }, [item.countryData, countryData, item.type, pageData]);

  const endDisplayTime =
    item.displayTime.endTime && new Date(item.displayTime.endTime).getTime() > new Date().getTime();
  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle null or undefined case
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const startTime = formatDate(item.displayTime?.startTime ? item.displayTime?.startTime : "");
  const endTime = formatDate(item.displayTime?.endTime ? item.displayTime?.endTime : "");
  const excludedUrls = item?.url?.exclude.join(", ");
  const includedUrls = item?.url?.include.join(", ");
  const showVisitors = item.showVisitors?.join(", ") ?? "";
  const hasDisplayTime = item?.displayTime?.startTime || item?.displayTime?.endTime;
  const hasCountryData = item?.countryData.length > 0;
  const hasIncludedUrls = item?.url?.include.length > 0;
  const hasExcludedUrls = item?.url?.exclude.length > 0;
  const hasSpecificPage = item?.type.length > 0 && !item.type.includes("all");
  const hasSpecificViewMode = item?.viewMode !== "all";
  const hasShowVisitors = Array.isArray(item.showVisitors) && item.showVisitors.length > 0;
  const hasSpecificSlideType = item?.slideType === "cart" || item?.slideType === "embeded";
  const hasUtmCode = item?.utmSource;
  const hasExcludeUtmCode = item?.excludeUtm;

  const shouldShowIcon =
    hasDisplayTime ||
    hasCountryData ||
    hasIncludedUrls ||
    hasExcludedUrls ||
    hasSpecificPage ||
    hasSpecificViewMode ||
    hasShowVisitors ||
    hasUtmCode ||
    hasExcludeUtmCode ||
    hasSpecificSlideType;

  const GetText = (title, value) => {
    return (
      <InlineStack>
        <Text variant="headingSm" as="h6" fontWeight="semibold">
          {title}:{" "}
        </Text>
        <Text tone="subdued">{value}</Text>
      </InlineStack>
    );
  };

  const tooltipContent = (
    <Box padding="4">
      <BlockStack gap="400">
        {(hasDisplayTime || hasCountryData) && (
          <BlockStack gap={100}>
            <Text variant="headingMd" as="h5" fontWeight="bold">
              Announcement bar will not be visible because of
            </Text>
            {hasDisplayTime &&
              GetText(
                "Scheduling",
                `${
                  startTime && endTime
                    ? `${startTime} to ${endTime}.`
                    : `${startTime ? `Scheduled Start ${startTime}.` : `Scheduled End ${endTime}.`}`
                }`
              )}
            {!hasDisplayTime && hasCountryData && GetText("Country", `Only for ${countryLabels}`)}
          </BlockStack>
        )}
        {(hasIncludedUrls ||
          hasExcludedUrls ||
          hasSpecificPage ||
          hasSpecificViewMode ||
          hasShowVisitors ||
          hasSpecificSlideType ||
          hasCountryData ||
          hasUtmCode ||
          hasExcludeUtmCode) && (
          <>
            <Divider />
            <BlockStack gap={100}>
              <Text variant="headingMd" as="h5" fontWeight="bold">
                Other Targeting
              </Text>
              {hasDisplayTime && hasCountryData && GetText("Country", `Only for ${countryLabels}`)}
              {hasIncludedUrls && GetText("Included URLs", `${includedUrls}`)}
              {hasExcludedUrls && GetText("Excluded URLs", `${excludedUrls}`)}
              {hasSpecificPage && GetText("Page", `Only on ${pageLabels}`)}
              {hasUtmCode && GetText("UtmCode", `${hasUtmCode}`)}
              {hasExcludeUtmCode && GetText("Exclude UtmCode", `${hasExcludeUtmCode}`)}
              {hasSpecificViewMode &&
                GetText(
                  "Device",
                  `${item.viewMode} only, not on ${item.viewMode === "desktop" ? "mobile" : "desktop"}.`
                )}
              {hasShowVisitors && GetText("Source", `${showVisitors}`)}
              {hasSpecificSlideType &&
                GetText("This is a Cart Bar/Embedded Bar", "So only visible on product page")}
            </BlockStack>
          </>
        )}
      </BlockStack>
    </Box>
  );

  return (
    <div className="premium_icon">
      <InlineStack gap="4">
        {shouldShowIcon ? (
          <Tooltip content={tooltipContent} width={"wide"}>
            <InlineStack>
              {/* {hasDisplayTime ? <Text>Scheduled</Text> : hasCountryData ? <Text>Country </Text> : ""} */}
              <Icon source={ViewIcon} tone="base" />
            </InlineStack>
          </Tooltip>
        ) : (
          <InlineStack>{item.slideEnabled ? "Visible" : "Invisible"}</InlineStack>
        )}
      </InlineStack>
    </div>
  );
}
