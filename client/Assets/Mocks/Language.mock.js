import { t } from "i18next";

export const formFields = () => [
  {
    id: "appLanguage",
    name: "appLanguage",
    label: t("common.Select language"),
    validated: false,
    type: "select",
    options: [
      { label: "English (English)", value: "en" },
      { label: "Čeština (Czech)", value: "cs" },
      { label: "Dansk (Danish)", value: "da" },
      { label: "Deutsch (German)", value: "de" },
      { label: "Español (Spanish)", value: "es" },
      { label: "Français (French)", value: "fr" },
      { label: "हिन्दी (Hindi)", value: "hi" },
      { label: "Italiano (Italian)", value: "it" },
      { label: "日本語 (Japanese)", value: "ja" },
      { label: "한국어 (Korean)", value: "ko" },
      { label: "Nederlands (Dutch)", value: "nl" },
      { label: "Polski (Polish)", value: "pl" },
      { label: "Português (Portuguese)", value: "pt" },
      { label: "Svenska (Swedish)", value: "sv" },
      { label: "Türkçe (Turkish)", value: "tr" },
      { label: "中文 (Chinese)", value: "zh" },
    ],
  },
];

export const initialValues = {
  appLanguage: "en",
};
