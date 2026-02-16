import React from "react";
import { Page } from "@shopify/polaris";
import { t } from "i18next";
import FreeAppPromotion from "@/Components/Common/FreeAppPromotion";

const Partners = ({ backbutton }) => {
  return (
    <Page fullWidth title={t("common.Partners")} backAction={backbutton}>
      <FreeAppPromotion />
    </Page>
  );
};

export default Partners;
