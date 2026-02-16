import React, { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Badge, InlineStack, Text } from "@shopify/polaris";
import { ProfileContext } from "@/Context/ProfileContext";
import { formatAIToken } from "@/Utils/Utils";

export default function AIToken({ aiToken = true, purchasedAiToken = true }) {
  const { t } = useTranslation();
  const { profileData } = useContext(ProfileContext);
  const normalAiToken = useMemo(() => profileData?.credits?.normal?.aiToken || 0, [profileData]);
  const purchaseToken = useMemo(() => profileData?.credits?.purchase?.aiToken || 0, [profileData]);

  return (
    <InlineStack gap={200}>
      {aiToken && (
        <Badge tone={normalAiToken <= 0 ? "critical" : "success"}>
          <Text variant="headingSm" align="center">
            {t(`common.AI token`)} : {formatAIToken(normalAiToken)}
          </Text>
        </Badge>
      )}
      {purchasedAiToken && purchaseToken > 0 && (
        <Badge tone="success">
          <Text variant="headingSm" align="center">
            {t(`common.Purchased AI token`)} : {formatAIToken(purchaseToken)}
          </Text>
        </Badge>
      )}
    </InlineStack>
  );
}
