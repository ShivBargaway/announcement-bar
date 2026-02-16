import { useEffect } from "react";
import { Fullscreen } from "@shopify/app-bridge/actions";
import { BlockStack, Divider, Page } from "@shopify/polaris";
import { t } from "i18next";
import { isAdmin } from "@/Utils/Index";
import { AppStatusBanner } from "../../Components/Common/AppStatusBanner";
import { getApp } from "../../Utils/AppUtils";
import AnnouncementTable from "../Animation/AnnouncementTable";

function Home() {
  if (!isAdmin()) {
    const app = getApp();
    const fullscreen = Fullscreen.create(app);
    useEffect(() => {
      fullscreen.dispatch(Fullscreen.Action.EXIT);
    }, []);
  }
  return (
    <>
      <Page title={t("common.Homepage")}>
        {/* titleMetadata={totalAddedAnnouncement >= 1 ? <CreditOnReview /> : <></>} */}
        <div style={{ marginBottom: "20px" }}>
          <BlockStack gap="600">
            <Divider borderColor="border" />
          </BlockStack>
        </div>
        <AppStatusBanner appName={"announcementBar"} tone={"warning"} />
        <div style={{ marginTop: "20px" }}>
          <BlockStack gap="600">
            <AnnouncementTable reorderStatus={true} addBarStatus={true} />
          </BlockStack>
        </div>
      </Page>
    </>
  );
}

export default Home;
