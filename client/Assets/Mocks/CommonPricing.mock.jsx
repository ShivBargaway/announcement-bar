import { differenceInCalendarMonths, differenceInDays, differenceInYears, formatDistanceToNow } from "date-fns";
import { t } from "i18next";
import { ABLogo, CCLogo, LinkifyLogo, SeoLogo } from "@/Assets/Index";

export const paidFeatures = [
  {
    text: "Unlimited Slides",
    icon: "",
  },
  {
    text: "Multiple Position",
    icon: "",
  },
  {
    text: "Live Chat Support",
    icon: "",
  },
  {
    text: "Priority, 24*7 Urgent setup and support",
    icon: "",
  },
  {
    text: "Contact Bar",
    icon: "",
  },
  {
    text: "Add To Cart Bar",
    icon: "",
  },
  {
    text: "Analytics data",
    icon: "",
  },
];

export const freeFeatures = [
  {
    text: "Free Shipping Bar",
    icon: "",
  },
  {
    text: "Rich Text Editor",
    icon: "",
  },
  {
    text: "One Slide(banner)",
    icon: "",
  },
  {
    text: "Country Filter",
    icon: "",
  },
  {
    text: "Repeated Countdown timer",
    icon: "",
  },
  {
    text: "Fully Customisable",
    icon: "",
  },
  {
    text: "Background-image",
    icon: "",
  },
  {
    text: "Custom Css",
    icon: "",
  },
];

export const featureList = {
  Free: freeFeatures,
  Premium: paidFeatures,
  Yearly: paidFeatures,
  Lifetime: paidFeatures,
  "Default-feature": paidFeatures,
  Pro100: paidFeatures,
};
export const interval = {
  Premium: "EVERY_30_DAYS",
  Yearly: "ANNUAL",
  Premium100: "EVERY_30_DAYS",
  Lifetime: "",
  Default: "",
};

const monthlyCodes = [
  {
    name: "Promotional",
    code: "PE4ACENT",
    type: "percentage", // can be (amount|percentage)
    value: 5,
  },
  {
    name: "Promotional",
    code: "OS1HOR",
    type: "percentage",
    value: 10,
  },
  {
    name: "Promotional",
    code: "SO2ULA",
    type: "percentage",
    value: 15,
  },
  {
    name: "Promotional",
    code: "TG3KSD",
    type: "percentage",
    value: 20,
  },
  {
    name: "Promotional",
    code: "RU4LIX",
    type: "percentage",
    value: 25,
  },
  {
    name: "Promotional",
    code: "BW5JAK",
    type: "percentage",
    value: 30,
  },
  {
    name: "Promotional",
    code: "SI6LENPM",
    type: "percentage",
    value: 35,
  },
  {
    name: "Promotional",
    code: "IN0NERDP",
    type: "percentage",
    value: 40,
  },
  {
    name: "Promotional",
    code: "AW3AKEPS",
    type: "percentage",
    value: 45,
  },
  {
    name: "Promotional",
    code: "EN7GHLIG",
    type: "percentage",
    value: 50,
  },
];
const yearlyCodes = [
  {
    name: "Promotional",
    code: "OS1HOR",
    type: "percentage",
    value: 30,
  },
  {
    name: "Promotional",
    code: "SO2ULA",
    type: "percentage",
    value: 35,
  },
  {
    name: "Promotional",
    code: "TG3KSD",
    type: "percentage",
    value: 40,
  },
  {
    name: "Promotional",
    code: "RU4LIX",
    type: "percentage",
    value: 45,
  },
  {
    name: "Promotional",
    code: "BW5JAK",
    type: "percentage",
    value: 50,
  },
];

export const getPlansData = () => [
  {
    type: "free",
    id: "Free",
    name: "Free",
    price: 0.0,
    isHidden: false,
    features: [...featureList["Free"]],
  },

  {
    type: "recurring",
    is_recurring: true,
    intervalLable: "Month",
    billingInterval: "Month",
    isHidden: "hasBillingButton ? !isFirstButtonActive : false", //value true or false
    interval: "EVERY_30_DAYS",
    id: "Premium",
    name: "Premium",
    price: 4.99,
    isPromoInputHidden: false,
    features: [...featureList["Premium"]],
    discounts: [...monthlyCodes],
    trial: {
      days: 7,
    },
    badge: {
      text: "POPULAR",
    },
  },
  {
    type: "recurring", //it could be (recurring|onetime)
    is_recurring: true,
    intervalLable: "Month", //if type is recurring then it could be (monthly|annual)
    billingInterval: "Year", // it could be (Year | Month | Unlimited) for differentiate plans in database
    isHidden: "hasBillingButton ? isFirstButtonActive : false", //value true or false
    interval: "ANNUAL",
    id: "Yearly",
    name: "Yearly",
    monthlyPrice: 4.99,
    price: 59.88,
    isPromoInputHidden: false,
    features: [...featureList["Yearly"]],
    trial: {
      days: 7,
    },
    discounts: [...yearlyCodes],
    initialDiscountPrice: 3.49,
    initialDiscountObject: {
      type: "percentage",
      value: 30,
    },
    discountPercent: 30,
  },
];

export const promocodeFormFields = [
  {
    id: "promocode",
    name: "promocode",
    labelPosition: "right",
    type: "text",
    errormsg: "Promocode is required",
    placeholder: "Enter Promocode",
  },
];

export const initialValues = {
  promocode: "",
};

export const formFieldsCancelReason = [
  {
    id: "cancelReason",
    name: "cancelReason",
    label: "Please Choose a Cancellation Reason",
    nested: "object",
    groupSize: 2,
    section: false,
    subfields: [
      {
        radioId: "noLongerNeeded",
        id: "noLongerNeeded",
        name: "reason",
        label: "No Longer Needed?",
        type: "radio",
      },
      {
        radioId: "dontWork",
        id: "dontWork",
        name: "reason",
        label: "Didn't Meet Expectations",
        type: "radio",
      },
      {
        radioId: "costConcerns",
        id: "costConcerns",
        name: "reason",
        label: "Cost Concerns",
        type: "radio",
      },
      {
        radioId: "technicalIssues",
        id: "technicalIssues",
        name: "reason",
        label: "Technical Issues",
        type: "radio",
      },
      {
        radioId: "foundAlternative",
        id: "foundAlternative",
        name: "reason",
        label: "Found an Alternative",
        type: "radio",
      },
      {
        radioId: "complexity",
        id: "complexity",
        name: "reason",
        label: "Complexity",
        type: "radio",
      },
      {
        radioId: "lackFeatures",
        id: "lackFeatures",
        name: "reason",
        label: "Lack of Features",
        type: "radio",
      },
      {
        radioId: "poorCustomerSupport",
        id: "poorCustomerSupport",
        name: "reason",
        label: "Poor Customer Support",
        type: "radio",
      },
      {
        radioId: "businessClosure",
        id: "businessClosure",
        name: "reason",
        label: "Business Closure or Change",
        type: "radio",
      },
      {
        radioId: "temporaryPause",
        id: "temporaryPause",
        name: "reason",
        label: "Temporary Pause",
        type: "radio",
      },
      {
        radioId: "performanceIssues",
        id: "performanceIssues",
        name: "reason",
        label: "Performance Issues",
        type: "radio",
      },
      {
        radioId: "other",
        id: "other",
        name: "reason",
        label: "Other",
        type: "radio",
      },
      {
        id: "value",
        name: "value",
        label: "Mention Your Specific Reason Here",
        labelPosition: "left",
        type: "text",
      },
    ],
  },
];

export const cancelReasonInitialValues = {
  cancelReason: {
    reason: "",
    value: "",
  },
};

const dateWisePrice = (date, billingInterval) => {
  const day = differenceInDays(new Date(), new Date(date));
  if (day <= 60) {
    return billingInterval === "Year" ? 1.99 : 2.99;
  } else if (day > 60 && day <= 180) {
    return billingInterval === "Year" ? 2.49 : 3.99;
  } else if (day > 180 && day <= 365) {
    return billingInterval === "Year" ? 2.99 : 4.49;
  } else {
    return billingInterval === "Year" ? 3.49 : 4.99;
  }
};

export const dateWisePriceObj = (date, plan) => {
  const { billingInterval } = plan;
  const monthlyPrice = 4.99;
  const finalPrice = dateWisePrice(date, billingInterval);
  const persent = Math.round(100 - (finalPrice * 100) / 4.99);
  let finalObj = {};
  if (finalPrice !== 4.99) {
    finalObj = {
      initialDiscountPrice: finalPrice,
      initialDiscountObject: { type: "percentage", value: persent },
      discountPercent: persent,
    };
  }
  const price = billingInterval === "Year" ? monthlyPrice * 12 : monthlyPrice;
  if (plan?.id !== "Free") {
    return billingInterval === "Year" ? { price, monthlyPrice, ...finalObj } : { price, ...finalObj };
  } else {
    return {};
  }
};
export const dateWisePersent = (date, isFirstButtonActive) => {
  const billingInterval = isFirstButtonActive ? "Month" : "Year";
  const finalPrice = dateWisePrice(date, billingInterval);
  const persent = Math.round(100 - (finalPrice * 100) / 4.99);
  return persent > 0 ? persent : false;
};

const makeBanner = (distanceText, persent, bannerKey) => {
  if (persent > 0) {
    const bannerMsg = `${t(`common.${bannerKey}MsgStart`)} ${distanceText}. ${t(
      `common.${bannerKey}MsgMiddle`
    )} ${persent}% ${t(`common.${bannerKey}MsgEnd`)}`;
    const bannerTitle = `${t(`common.${bannerKey}TitleStart`)} ${persent}% ${t(
      `common.${bannerKey}TitleEnd`
    )} ${distanceText}.`;
    return { bannerMsg, bannerTitle };
  } else {
    const bannerMsg = `${t("common.generalMsg")}`;
    const bannerTitle = `${t("common.veryImportantTitleStart")} ${distanceText} ${t(
      "common.veryImportantTitleEnd"
    )}.`;
    return { bannerMsg, bannerTitle };
  }
};

export const dateWisePriceBanner = (date, isFirstButtonActive) => {
  const day = differenceInDays(new Date(), new Date(date));
  const distanceText = formatDistanceToNow(new Date(date), { addSuffix: true });
  const billingInterval = isFirstButtonActive ? "Month" : "Year";
  const finalPrice = dateWisePrice(date, billingInterval);
  const persent = Math.round(100 - (finalPrice * 100) / 4.99);

  if (day <= 60) {
    return makeBanner(distanceText, persent, "low");
  } else if (day > 60 && day <= 180) {
    return makeBanner(distanceText, persent, "medium");
  } else if (day > 180 && day <= 365) {
    return makeBanner(distanceText, persent, "important");
  } else {
    let bannerMsg = ``;
    const differenceInMonth = differenceInCalendarMonths(new Date(), new Date(date));
    const differenceInYear = differenceInYears(new Date(), new Date(date));
    const finalMonth = differenceInMonth - differenceInYear * 12;
    let monthYearText = ``;
    if (finalMonth > 0) {
      monthYearText = `${differenceInYear} ${t("common.year and")} ${finalMonth} ${t("common.month")}`;
    } else {
      monthYearText = `${differenceInYear} ${t("common.year")}`;
    }
    if (persent > 0) {
      bannerMsg = `${t("common.veryImportantMsgStart")}  ${monthYearText} ${t("common.ago")}. ${t(
        "common.veryImportantMsgMiddle"
      )} ${persent}% ${t("common.veryImportantMsgEnd")}`;
    } else {
      bannerMsg = `${t("common.generalMsg")}`;
    }
    const bannerTitle = `${t("common.veryImportantTitleStart")} ${monthYearText} ${t(
      "common.veryImportantTitleEnd"
    )}.`;
    return { bannerMsg, bannerTitle };
  }
};

export const AppList = [
  {
    title: "Webrex SEO: AI, Speed & Schema",
    tagLine: "Optimize your Store by align correct SEO to improve organic ranking, boost visibility",
    link: "https://apps.shopify.com/breadcrumbs-schemas?source=Announcement-bar-app",
    image: SeoLogo,
    starRate: 4.9,
    reviweCount: 437,
    popular: true,
    // hide: true,
  },
  {
    title: "WebRex Multi Announcement Bar",
    tagLine: "Boost sales with customizable bars for announcements, free shipping, and countdown timers",
    link: "https://apps.shopify.com/announcement-bar-with-slider?source=Announcement-bar-app",
    image: ABLogo,
    starRate: 4.9,
    reviweCount: 436,
    hide: true,
    // popular: true,
  },
  {
    title: "Linkify ‑ Backlink SEO Booster",
    tagLine: "Supercharge SEO with top-tier backlinks from high DA sites. Boost rankings, traffic, and authority",
    link: "https://apps.shopify.com/linkify-app?source=Announcement-bar-app",
    image: LinkifyLogo,
    starRate: 5.0,
    reviweCount: 8,
    hide: true,
    // popular: true,
  },
  {
    title: "Webrex ‑ Currency Converter",
    tagLine: "Solution for your International Selling that will help to show converted prices, local currency",
    link: "https://apps.shopify.com/currency-converter-11?source=Announcement-bar-app",
    image: CCLogo,
    starRate: 4.9,
    reviweCount: 306,
    // hide: true,
    // popular: true,
  },
];
export const getOfferTrialText = (totalDays) => {
  const units = [
    { label: "year", days: 365 },
    { label: "month", days: 30 },
    { label: "day", days: 1 },
  ];

  const parts = [];

  for (const { label, days } of units) {
    const count = Math.floor(totalDays / days);
    if (count > 0) {
      parts.push(`${count} ${label}${count > 1 ? "s" : ""}`);
      totalDays %= days;
    }
  }
  return parts.join(" and ");
};

export const cancelReasonOptions = [
  { label: "No Longer Needed?", value: "noLongerNeeded" },
  { label: "Didn't Meet Expectations", value: "dontWork" },
  { label: "Cost Concerns", value: "costConcerns" },
  { label: "Technical Issues", value: "technicalIssues" },
  { label: "Found an Alternative", value: "foundAlternative" },
  { label: "Complexity", value: "complexity" },
  { label: "Lack of Features", value: "lackFeatures" },
  { label: "Poor Customer Support", value: "poorCustomerSupport" },
  { label: "Business Closure or Change", value: "businessClosure" },
  { label: "Temporary Pause", value: "temporaryPause" },
  { label: "Performance Issues", value: "performanceIssues" },
  { label: "Other", value: "other" },
];

export const pricingPlanFeatureList = [
  {
    key: "Plan highlights",
    label: "Plan highlights",
    list: [
      { key: "productAccess", label: "Product access" },
      { key: "aiToken", label: "AI token" },
      { key: "Premium", label: "AI and manually bulk operation" },
      { key: "Premium", label: "Advance schema" },
      { key: "Pro", label: "Remove error and warnings in schema" },
      { key: "Pro", label: "Breadcrumb design advance settings" },
      { key: "Pro", label: "eCommerce blog AI agent" },
      { key: "Pro", label: "Clean invalid schemas" },
      { key: "Pro", label: "Remove duplicate schemas" },
      { key: "keywordAnalysis", label: "Keyword analysis" },
      { key: "otherImageAutomation", label: "Theme & other image automation" },
      { key: "Elite", label: "Technical SEO" },
      { key: "analyzePageSpeed", label: "Core web vitals analysis" },
      { key: "blogAutomation", label: "eCommerce blog automation" },
      // { key: "contactUsButton", label: "Affordable SEO services" },
      // { key: "customThemeButton", label: "Affordable store customization" },
    ],
  },
  {
    key: "Access & Credit",
    label: "Access & credit",
    list: [
      { key: "productAccess", label: "Product access" },
      { key: "aiToken", label: "AI token" },
      { key: "blogLimit", label: "AI blog credit" },
      { key: "imageOptimizeProduct", label: "Unlimited image optimization" },
      { key: "Free", label: "Unlimited 404 redirects" },
    ],
  },
  {
    key: "AI MetaTag",
    label: "AI metatag",
    list: [
      { key: "Free", label: "SEO audit summary & reports" },
      { key: "Free", label: "AI-Powered description" },
      { key: "Free", label: "SEO analysis & score" },
      { key: "Free", label: "Advanced filter" },
      { key: "Free", label: "Train GPT-4o AI model for ecommerce meta" },
      { key: "Premium", label: "AI and manually bulk operation" },
      { key: "Premium", label: "Meta tag manual & AI-powered automation" },
      { key: "Premium", label: "Collection metatag" },
      { key: "Premium", label: "Page metatag" },
      { key: "Premium", label: "Blog metatag" },
      { key: "Premium", label: "Manage item level sitemap" },
      { key: "Premium", label: "Stop search engines indexing" },
      { key: "Premium", label: "Prevent passing pagerank" },
      { key: "Pro", label: "Find duplicate metatags" },
      { key: "aiProductContentTab", label: "AI-Powered product content tab" },
      {
        key: "descriptionBulkOperation",
        label: "AI-Powered description bulkOperation",
        releaseDate: "2025-11-14",
      },
      {
        key: "aiDescriptionWithLinks",
        label: "AI-Powered description with interlinking",
        releaseDate: "2025-11-14",
      },
      {
        key: "productTabBulkOperation",
        label: "AI-Powered product tabs bulk operation",
        releaseDate: "2025-11-14",
      },
      { key: "faqSchemaBulkOperation", label: "AI-Powered FAQ bulk operation", releaseDate: "2025-11-14" },
      {
        key: "noIndexNoFollowBulkOperation",
        label: "No index/No follow bulk operation",
        releaseDate: "2025-11-14",
      },
      { key: "descriptionAutomation", label: "AI-Powered description automation", releaseDate: "2025-12-08" },
      { key: "productTabAutomation", label: "AI-Powered product tabs automation", releaseDate: "2025-12-08" },
      { key: "faqSchemaAutomation", label: "AI-Powered FAQ generation automation", releaseDate: "2025-12-08" },
      { key: "noIndexNoFollowAutomation", label: "No index/No follow automation", releaseDate: "2025-12-08" },
    ],
  },
  {
    key: "Page Speed Analysis",
    label: "Page speed analysis",
    list: [
      { key: "analyzePageSpeed", label: "Daily automated page speed analysis" },
      { key: "analyzePageSpeed", label: "Multi-URL monitoring" },
      { key: "analyzePageSpeed", label: "Real user monitoring (RUM)" },
      { key: "analyzePageSpeed", label: "Origin performance analysis" },
      { key: "analyzePageSpeed", label: "Multi-page type monitoring" },
      { key: "analyzePageSpeed", label: "Detailed performance breakdown" },
      { key: "analyzePageSpeed", label: "Historical reports by date" },
      { key: "analyzePageSpeed", label: "Web vitals comparison tool" },
      { key: "analyzePageSpeed", label: "Single page deep analysis" },
      { key: "analyzePageSpeed", label: "Page-type report summary" },
      { key: "analyzePageSpeed", label: "Custom URL analysis" },
      { key: "analyzePageSpeed", label: "Device-specific testing" },
      { key: "analyzePageSpeed", label: "Exportable performance reports" },
    ],
  },
  {
    key: "Technical SEO",
    label: "Technical SEO",
    list: [
      { key: "Elite", label: "Check duplicate or missing title tags" },
      { key: "Elite", label: "Check duplicate or missing meta descriptions" },
      { key: "Elite", label: "Check missing alt text for images" },
      { key: "Elite", label: "Check missing OG(Facebook) tags" },
      { key: "Elite", label: "Check missing or incorrect Twitter card tags" },
      { key: "Elite", label: "Check duplicate content" },
      { key: "Elite", label: "Check incorrect H1, H2, H3 structure" },
      { key: "Elite", label: "Check incorrect or missing href lang tags" },
      { key: "Elite", label: "URL length exceeds recommended limit" },
      { key: "Elite", label: "Check incorrect canonical tag implementation" },
      { key: "Elite", label: "Script execution without defer attribute" },
      { key: "Elite", label: "Check AMP-related issues" },
      { key: "Elite", label: "Social media preview" },
    ],
  },
  {
    key: "Keyword Analysis",
    label: "Keyword analysis",
    list: [
      { key: "keywordAnalysis", label: "Keyword analysis" },
      { key: "keywordSuggestion", label: "Keyword suggestion" },
    ],
  },
  {
    key: "AI Image AltText",
    label: "AI image alttext",
    list: [
      { key: "Free", label: "Advanced filter" },
      { key: "Free", label: "Image alt dashboard & analysis" },
      { key: "Free", label: "Train GPT-4o AI model for ecommerce alt" },
      { key: "Premium", label: "AI and manually bulk operation" },
    ],
  },
  {
    key: "Schema Optimizations",
    label: "Schema optimizations",
    list: [
      { key: "Free", label: "Product schema" },
      { key: "Free", label: "Organization schema" },
      { key: "Free", label: "Local business schema" },
      { key: "Free", label: "Breadcrumbs schema" },
      { key: "Free", label: "Product merchant schema" },
      { key: "Free", label: "Article schema" },
      { key: "Premium", label: "Product review schema" },
      { key: "Premium", label: "30+ review app integration" },
      { key: "Pro", label: "Add generator schema to product page" },
      { key: "Pro", label: "Clean invalid schemas" },
      { key: "Pro", label: "Remove duplicate schemas" },
      { key: "videoSchema", label: "Video Section (Block + Schema Markup)" },
      { key: "faqSchema", label: "FAQ Section (Block + Schema Markup)" },
    ],
  },
  {
    key: "Image Optimization",
    label: "Image optimization",
    list: [
      { key: "imageOptimizeProduct", label: "Unlimited image optimization" },
      { key: "Free", label: "Image optimization dashboard & analysis" },
      { key: "Free", label: "Advanced filter" },
      { key: "Premium", label: "Product image automation" },
      { key: "Premium", label: "Bulk operation" },
      { key: "Premium", label: "Theme & other image optimization" },
      { key: "Pro", label: "Homepage image optimization" },
      { key: "homePageImageAutomation", label: "Homepage image automation" },
      { key: "otherImageAutomation", label: "Theme & other image automation" },
    ],
  },
  {
    key: "Broken Link",
    label: "Broken link",
    list: [
      { key: "Free", label: "Capture unlimited broken link" },
      { key: "Free", label: "Manually resolve broken link" },
      { key: "Free", label: "Archived broken link don't fix" },
      { key: "Premium", label: "Broken link automation" },
    ],
  },
  {
    key: "Design Breadcrumb",
    label: "Design breadcrumb",
    list: [
      { key: "Free", label: "Breadcrumbs design" },
      { key: "Free", label: "Customize design as per store branding" },
      { key: "Free", label: "All page setting" },
      { key: "Free", label: "Blog post breadcrumb" },
      { key: "Premium", label: "Collection breadcrumb priority for product" },
      { key: "Premium", label: "Block collection for products" },
      { key: "Pro", label: "Five level breadcrumb" },
      { key: "Pro", label: "Custom breadcrumb" },
    ],
  },
  {
    key: "AI Blog",
    label: "AI blog",
    list: [
      { key: "blogLimit", label: "AI blog credit" },
      { key: "Pro", label: "Deepseek model for ecommerce blog post" },
      { key: "AutomatedBlogPost", label: "Auto blog-post generation using AI agent" },
    ],
  },
  {
    key: "Google Index Status",
    label: "Google index status",
    list: [
      { key: "Pro", label: "Report and dashboard" },
      { key: "Pro", label: "Analysis of not index pages" },
      { key: "Pro", label: "Detail of which error need to fix" },
      { key: "Pro", label: "Collection index status" },
      { key: "Pro", label: "Auto status check every 2 week" },
    ],
  },
  {
    key: "Support",
    label: "Unstoppable support",
    list: [
      { key: "Free", label: "24*7 support" },
      { key: "Free", label: "Live chat support" },
      { key: "Free", label: "Email support" },
      { key: "Free", label: "Demo calls" },
      { key: "Premium", label: "Loom recording support" },
      { key: "Pro", label: "Live 1 to 1 meeting support" },
      // { key: "seoSetupDedication", label: "Dedicated SEO expert" },
      { key: "ultiMateYearly", label: "Dedicated assistant" },
      // { key: "contactUsButton", label: "Affordable SEO services" },
      // { key: "conversationRate", label: "Conversion rate optimization" },
      // { key: "customThemeButton", label: "Affordable store customization" },
    ],
  },
  {
    key: "Other features",
    label: "Other features",
    list: [
      { key: "Free", label: "SEO quick wins" },
      { key: "Free", label: "Instant page" },
      { key: "Free", label: "Dashboard & report" },
      { key: "Free", label: "XML sitemap" },
      { key: "Free", label: "Html sitemap generator" },
      { key: "Free", label: "Google search report" },
      { key: "Free", label: "Keyword analysis report" },
      { key: "Free", label: "Last 12 month report" },
    ],
  },
];
