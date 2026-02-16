import React from "react";
import { Button } from "@shopify/polaris";
import { differenceInDays } from "date-fns";
import { t } from "i18next";
import { Google, Help, YouTube } from "@/Assets/Index";
import Meeting from "@/Components/Common/Meeting";

const hideMeeting = (profileData) => {
  const day = differenceInDays(new Date(), new Date(profileData?.created_at));
  return day < 180 ? true : false;
};

export const getSupportsList = (profileData) => [
  {
    title: t("common.Schedule Meeting"),
    tagLine: t(
      "common.Book a dedicated time slot with our Shopify app experts to address your queries and ensure optimal performance."
    ),
    action: t("common.Schedule Meeting"),
    link: "https://appt.link/webrex-studio/webrex-seo-app-demo-and-support",
    meeting: true,
    image: Google,
    children: (
      <Meeting
        page="https://appt.link/webrex-studio/webrex-seo-app-demo-and-support"
        button={t("common.Schedule Meeting")}
      ></Meeting>
    ),
    // hide: hideMeeting(profileData),
  },
  {
    title: t("common.Instant Google Meet call"),
    tagLine: t(
      "common.Need immediate assistance? Jump on a Google Meet call now with our Shopify app specialists for real-time support."
    ),
    action: t("common.Call Now"),
    link: "https://appt.link/webrex-studio/webrex-seo-app-demo-and-support",
    image: Google,
    hide: true,
  },
  {
    title: t("common.Help Center"),
    tagLine: t("common.Find a solution to your problem with Webrex help center documentations and tutorials."),
    action: t("common.Visit Help Center"),
    link: "https://webrex-seo-optimizer.customerly.help/en",
    children: (
      <Button target="_blank" url="https://webrex-seo-optimizer.customerly.help/en">
        {t("common.Visit Help Center")}
      </Button>
    ),
    image: Help,
  },
  {
    title: t("common.Webrex Youtube Chanel"),
    tagLine: t("common.Check our comprehensive video tutorials about webrex all application."),
    action: t("common.Go to Youtube Channel"),
    link: "https://webrex-seo-optimizer.customerly.help/en",
    image: YouTube,
    hide: true,
  },
];

const uninstallOptions = () => [
  { label: t(`Uninstall.Did not meet my expectations`), value: " Did not meet my expectations" },
  { label: t(`Uninstall.Feature Limitations`), value: "Feature Limitations" },
  { label: t(`Uninstall.Banner doesn't set in my app`), value: "Banner doesn't set in my app" },
  { label: t(`Uninstall.Banner is not show properly`), value: "Banner is not show properly" },
  {
    label: t(`Uninstall.Confusing Set Multi Position and Multi Animation`),
    value: "Confusing Set Multi Position and Multi Animation",
  },
  { label: t(`Uninstall.Not getting how to use or setup`), value: "Not getting how to use or setup" },
  { label: t(`Uninstall.Poor customer support`), value: "Poor customer support" },
  { label: t(`Uninstall.Performance issues`), value: "Performance issues" },
  { label: t(`Uninstall.Other`), value: "Other" },
];

export const getUninstallFormField = (isHidden) => [
  {
    id: "reason",
    name: "reason",
    label: t("common.Please Choose a UnInstallation Reason"),
    labelPosition: "left",
    type: "select",
    options: [...uninstallOptions()],
    placeholder: t("common.Select a reason"),
    validated: true,
    errormsg: t(`common.Please Choose at least one reason`),
  },
  {
    id: "reasonValue",
    name: "reasonValue",
    label: t("common.Mention Your Specific Reason Here"),
    type: "text",
    validated: isHidden,
    errormsg: t(`common.Mention Your Specific Reason Here`),
  },

  {
    id: "support",
    name: "support",
    label: t("common.Get Help from Our Support Team"),
    type: "checkbox",
  },
];

export const uninstallFormValue = { reason: "", reasonValue: "" };
