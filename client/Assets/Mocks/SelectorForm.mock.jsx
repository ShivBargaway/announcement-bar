import { Text } from "@shopify/polaris";
import { t } from "i18next";
import { isAdmin } from "@/Utils/Index";

export const getSelectorFormFields = () => {
  if (!isAdmin()) return [];

  return [
    {
      nested: "group",
      groupSize: 2,
      section: false,
      subfields: [
        {
          id: "selector",
          name: "selector",
          label: "Fix Selector",
          labelPosition: "right",
          type: "text",
        },
        {
          id: "fixMobileSelector",
          name: "fixMobileSelector",
          label: "Fix selector for Mobile",
          labelPosition: "right",
          type: "text",
        },
        {
          id: "StrictSelector",
          name: "StrictSelector",
          label: "Strict Fix Selector",
          labelPosition: "right",
          type: "text",
        },
        {
          id: "StrictMobileSelector",
          name: "StrictMobileSelector",
          label: "Strict Fix Selector for Mobile",
          labelPosition: "right",
          type: "text",
        },
        {
          id: "absolutePosition",
          name: "absolutePosition",
          label: "Selector for absolute",
          labelPosition: "right",
          type: "text",
        },
      ],
    },
  ];
};

export const getcustomCssFormFields = () => [
  {
    id: "customCss",
    name: "customCss",
    label: t("common.Custom css"),
    labelPosition: "right",
    type: "codeMirror",
    height: "300px",
    width: "100%",
    theme: "dark",
  },
];

export const getAnimationFormFields = () => {
  return [
    {
      nested: "group",
      groupSize: 2,
      section: false,
      label: (
        <Text variant="headingSm" fontWeight={"Bold"} as="span">
          {t("common.Rotating Animation Setting")}
        </Text>
      ),
      subfields: [
        {
          id: "autoplayTime",
          name: "autoplayTime",
          validated: false,
          label: t("common.Auto play time (time in MS)"),
          labelPosition: "right",
          type: "number",
        },
        {
          id: "animationTime",
          name: "animationTime",
          validated: false,
          label: t("common.Animation time (time in MS)"),
          labelPosition: "right",
          type: "number",
        },
      ],
    },
    {
      nested: "group",
      groupSize: 2,
      section: false,
      label: (
        <Text variant="headingSm" fontWeight={"Bold"} as="span">
          {t("common.Marquee Animation Setting")}
        </Text>
      ),
      subfields: [
        {
          id: "textAnimationTime",
          name: "textAnimationTime",
          validated: false,
          label: t("common.Auto play time (time in Second)"),
          labelPosition: "right",
          type: "number",
        },

        {
          id: "textAnimationPadding",
          name: "textAnimationPadding",
          validated: false,
          label: t("common.Space between slide(px)"),
          labelPosition: "right",
          type: "number",
        },
      ],
    },
  ];
};

export const initialValue = {
  animationIn: "slideInDown",
  animationOut: "slideOutDown",
  autoplayTime: 5000,
  animationTime: 1500,
  type: "all",
  textAnimation: false,
  textAnimationTime: 15,
  textAnimationBg: "#000",
  textAnimationPadding: 15,
  textAnimationWidth: 0,
  textAnimationSliderWidth: 0,
  timePerPixel: 0,
  slidePosition: "static",
  slidePadding: 10,
  rmvBtnEnabled: false,
  cssEnabled: true,
  customCss: "",
  selector: "",
  customPosition: "",
  absolutePosition: "",
  fixMobileSelector: "",
  StrictSelector: "",
  StrictMobileSelector: "",
  rmvBtnColor: "#ffffff",
  slideHeight: 40,
};
