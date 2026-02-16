import { Text } from "@shopify/polaris";
import { t } from "i18next";
import { getcountryData, getpageData } from "../../../Assets/Mocks/CountryObj";
import Background from "../../Announcement/Background";

const urlParams = new URLSearchParams(location.search);
const getUrlParam = (param) => urlParams.get(param);

export const getCampagionFormFields = (type) => {
  let slidePositionOptions = [
    { label: t("common.Top"), value: "static" },
    { label: t("common.Sticky Top"), value: "fixed" },
    { label: t("common.Bottom Fix"), value: "bottomFixed" },
    { label: t("common.Custom Position"), value: "CustomPosition" },
  ];

  if (type === "embeded") {
    slidePositionOptions = [
      { label: t("common.Above Add to cart Button"), value: "beforeAddtoCart" },
      { label: t("common.Below Add to cart Button"), value: "afterAddtoCart" },
    ];
  }

  return [
    {
      id: "campaignTitle",
      name: "campaignTitle",
      label: t("common.Campaign Title"),
      labelPosition: "right",
      type: "text",
      validated: true,
      errormsg: "Please enter a campaign title.",
    },
    {
      id: "slidePosition",
      name: "slidePosition",
      validated: false,
      label: t("common.Position"),
      labelPosition: "right",
      type: "select",
      options: slidePositionOptions,
    },
    {
      id: "customPosition",
      name: "customPosition",
      validated: false,
      label: t("common.Custom Position *Add Class or id of Selected Element."),
      labelPosition: "right",
      type: "text",
      dependOn: {
        name: "slidePosition",
        value: "CustomPosition",
        type: "hidden",
      },
    },
    {
      id: "animationType",
      name: "animationType",
      validated: false,
      label: t("common.Animation"),
      labelPosition: "right",
      type: "select",
      options: [
        { label: t("common.Rotating"), value: "rotating" },
        { label: t("common.Multi Rotating"), value: "multiRotating" },
        { label: t("common.Marquee"), value: "marquee" },
      ],
    },
  ];
};

export const getBackgroundFormFields = () => [
  {
    nested: "group",
    groupSize: 1,
    section: false,
    subfields: [
      {
        id: "backgroundColor",
        name: "backgroundColor",
        label: t("common.Background Color"),
        type: "component",
        component: Background,
      },
      {
        id: "backgroundColor",
        name: "backgroundColor",
        label: t("common.Background Color"),
        labelPosition: "right",
        type: "colorPicker",
        size: "40px",
      },
    ],
  },
];

export const getAdvancFormFields = () => [
  {
    id: "countryData",
    name: "countryData",
    label: (
      <Text variant="headingSm" fontWeight={"Bold"} as="span">
        {t("common.Country Filter")}
      </Text>
    ),
    type: "multiSelect",
    placeholder: t("common.Show On Selected Countries"),
    options: [...getcountryData()],
  },
  {
    id: "viewMode",
    name: "viewMode",
    label: (
      <Text variant="headingSm" fontWeight={"Bold"} as="span">
        {t("common.Visibility")}
      </Text>
    ),
    options: [
      { label: t("common.Desktop and Mobile"), value: "all" },
      { label: t("common.Only Desktop"), value: "desktop" },
      { label: t("common.Only Mobile"), value: "mobile" },
    ],
    type: "select",
  },
  {
    id: "showVisitors",
    name: "showVisitors",
    label: (
      <Text variant="headingSm" fontWeight={"Bold"} as="span">
        {t("common.Show to visitors coming form then specific website")}
      </Text>
    ),
    type: "choiceList",
    allowMultiple: true,
    choices: [
      { label: "Facebook", value: "facebook" },
      { label: "Instagram", value: "instagram" },
      { label: "Twitter", value: "t.co" },
      { label: "Google", value: "google" },
      { label: "Pinterest", value: "pinterest" },
      { label: "Other Website", value: "otherUrl" },
    ],
  },
  {
    id: "customUrl",
    name: "customUrl",
    label: t("common.Add your website URL"),
    labelPosition: "left",
    placeholder: "e.g. http://example.com/",
    type: "text",
    dependOn: {
      name: "showVisitors",
      value: "otherUrl",
      type: "hidden",
    },
  },
  {
    id: "utmCode",
    name: "utmCode",
    label: "UTM code",
    labelPosition: "right",
    type: "checkbox",
  },
  {
    id: "utmSource",
    name: "utmSource",
    label: t("common.Include Utm"),
    labelPosition: "left",
    type: "text",
    placeholder: "Utm_source=Google",
    helpText: t(
      "common.USER SOURCE TARGETING (Visitors Coming From A Link Including This Following UTM Code, Eg.Ref=Facebook, Ref=Web, Utm_source=Google...)"
    ),
    dependOn: {
      name: "utmCode",
      value: true,
      type: "hidden",
    },
  },
  {
    id: "excludeUtm",
    name: "excludeUtm",
    label: t("common.Exclude Utm"),
    labelPosition: "left",
    type: "text",
    placeholder: "Utm_source=Google",
    helpText: t("common.Add Hide Banner UTM code (Eg.Ref=Facebook, Ref=Web, Utm_source=Google...)"),
    dependOn: {
      name: "utmCode",
      value: true,
      type: "hidden",
    },
  },

  {
    id: "type",
    name: "type",
    label: (
      <Text variant="headingSm" fontWeight={"Bold"} as="span">
        {t("common.Select Page")}
      </Text>
    ),
    type: "multiSelect",
    placeholder: t("common.Show On Selected Pages"),
    options: [...getpageData()],
  },
  {
    id: "url",
    name: "url",
    nested: "object",
    groupSize: 1,
    section: true,
    subfields: [
      {
        id: "include",
        name: "include",
        label: t("common.Include"),
        type: "array",
        arrayType: "text",
        validated: true,
        groupSize: 1,
        errormsg: t("common.Url is required"),
        placeholder: "e.g. http://example.com/",
      },
      {
        id: "exclude",
        name: "exclude",
        label: t("common.Exclude"),
        type: "array",
        arrayType: "text",
        validated: true,
        groupSize: 1,
        errormsg: t("common.Url is required"),
        placeholder: "e.g. http://example.com/",
      },
    ],
  },
];

export const getScheduleFormFields = () => [
  {
    id: "displayTime",
    name: "displayTime",
    nested: "object",
    groupSize: 1,
    section: false,
    subfields: [
      {
        id: "startTime",
        name: "startTime",
        label: (
          <Text variant="headingSm" fontWeight={"Bold"} as="span">
            {t("common.Banner Display Start Time")}
          </Text>
        ),
        type: "datetime-local",
        placeholder: "Start Time",
        validated: true,
        errormsg: t("common.Start Time is required"),
      },
      {
        id: "endTime",
        name: "endTime",
        label: (
          <Text variant="headingSm" fontWeight={"Bold"} as="span">
            {t("common.Banner Display End Time")}
          </Text>
        ),
        type: "datetime-local",
        placeholder: "End Time",
        validated: true,
        errormsg: t("common.End Time is required"),
      },
    ],
  },
];

export const initialValues = {
  backgroundColor: "linear-gradient(to right, rgb(252, 74, 26), rgb(247, 183, 51))",
  mobilebackgroundColor: "linear-gradient(to right, rgb(252, 74, 26), rgb(247, 183, 51))",
  displayTime: { startTime: "", endTime: "" },
  countryData: [],
  viewMode: "all",
  utmCode: false,
  utmSource: "",
  excludeUtm: "",
  type: [],
  url: { include: [], exclude: [] },
  htmlDesign: [],
  campaignTitle: "",
  slideType: getUrlParam("type"),
  slidePosition: getUrlParam("type") === "embeded" ? "beforeAddtoCart" : "static",
  animationType: "rotating",
  customPosition: "",
  slidePadding: 5,
  showVisitors: [],
  customUrl: "",
  textAnimationTime: 15,
  textAnimationPadding: 15,
};
