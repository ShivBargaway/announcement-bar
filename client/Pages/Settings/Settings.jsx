import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BlockStack, Card, Icon, InlineGrid, Page, Text } from "@shopify/polaris";
import {
  EmailIcon,
  FinanceIcon,
  FlagIcon,
  LinkIcon,
  PhoneIcon,
  PlanIcon,
  StoreIcon,
} from "@shopify/polaris-icons";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { MockData } from "@/Assets/Mocks/Settings.mock";
import LanguageSelector from "@/Components/Common/LanguageSelector";
import { ProfileContext } from "@/Context/ProfileContext";
import { ToastContext } from "@/Context/ToastContext";

export default function Settings({ backbutton }) {
  let color = "base";
  const { profileData, updateProfileData } = useContext(ProfileContext);
  const { t } = useTranslation();
  const fetch = useAuthenticatedFetch();
  const { showToast } = useContext(ToastContext);
  const iconMap = {
    FinanceIcon: FinanceIcon,
    FlagIcon: FlagIcon,
    PhoneIcon: PhoneIcon,
    StoreIcon: StoreIcon,
    LinkIcon: LinkIcon,
    EmailIcon: EmailIcon,
    PlanIcon: PlanIcon,
  };
  function getIcon(iconName) {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <Icon source={IconComponent} tone={color} />;
    }
    return null;
  }
  const syncProfileData = async () => {
    const res = await fetch.get("syncProfile");
    if (res) {
      showToast("Update Successfully");
    }
    updateProfileData(res.data);
  };
  const infoCard = (value) => {
    return (
      <div style={{ display: "flex" }} key={value?.id}>
        <div
          style={{
            background: "#EDEEEF",
            borderRadius: "20px",
            width: "40px",
            height: "40px",
            padding: "10px",
          }}
        >
          {getIcon(value?.icon)}
        </div>
        <div
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ fontSize: "14px", color: "#666666" }}> {t(`common.${value?.title}`)}</div>
          {profileData && (
            <div style={{ fontSize: "16px", fontWeight: "bold" }}>{profileData[value?.valueKey] || "-"}</div>
          )}
        </div>
      </div>
    );
  };
  return (
    <Page
      title={t("common.Settings")}
      primaryAction={{ content: t("common.Sync Profile"), onAction: syncProfileData }}
      backAction={backbutton}
    >
      <BlockStack gap="500">
        <Card>
          <LanguageSelector />
        </Card>

        <Card>
          <Text variant="headingMd" as="h5">
            {t("common.My Profile")}
          </Text>
          <InlineGrid gap="400" columns={{ xs: "1", sm: "1", md: "2", lg: "2", xl: "2" }}>
            {MockData.profile.map((e) => infoCard(e))}
          </InlineGrid>
        </Card>
        <Card>
          <Text variant="headingMd" as="h5">
            {t("common.My Subscription")}
          </Text>
          {MockData.subscription.map((e) => infoCard(e))}
        </Card>
      </BlockStack>
    </Page>
  );
}
