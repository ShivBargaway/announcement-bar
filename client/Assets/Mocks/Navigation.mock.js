import { t } from "i18next";

export const getNavigationLinks = () => [
  {
    label: t("common.Animation"),
    destination: "/animationSetting",
  },
  {
    label: t("common.Contacts"),
    destination: "/contacts",
  },
  {
    label: t("common.Custom Css"),
    destination: "/animation",
  },
  {
    label: t("common.Price"),
    destination: "/pricing",
  },
  {
    label: t("common.Partners"),
    destination: "/Partners",
  },
  {
    label: t("common.Settings"),
    destination: "/settings",
  },
  // {
  //   label: t("common.Feedback"),
  //   destination: "/feedback",
  // },
];
