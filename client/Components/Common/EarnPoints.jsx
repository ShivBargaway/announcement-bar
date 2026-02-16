import React, { useContext } from "react";
import { Badge, Icon, InlineStack, Text, Tooltip } from "@shopify/polaris";
import { DiscountFilledIcon } from "@shopify/polaris-icons";
import { t } from "i18next";
import { ProfileContext } from "../../Context/ProfileContext";

export default function EarnPoints({ item }) {
  const { profileData } = useContext(ProfileContext);

  if (!profileData) return <></>;
  if (Array.isArray(item?.earningId)) {
    let hideBadge = true;
    item?.earningId?.map((id) => {
      if (!profileData?.earningPoints?.[id]) hideBadge = false;
    });
    if (hideBadge) return <></>;
  } else {
    if (profileData?.earningPoints?.[item?.earningId]) return <></>;
  }

  return <></>;
  return (
    <div className="review-btoon">
      <Tooltip content={t(`common.${item?.earnText || "Earn upto 20 points"}`)}>
        <Badge tone="info">
          <InlineStack blockAlign="center" gap={100}>
            <Icon source={DiscountFilledIcon} tone="success" />
            <Text fontWeight="bold">{t(`common.Earn Credits`)}</Text>
          </InlineStack>
        </Badge>
      </Tooltip>
    </div>
  );
}
