import { formatDistanceToNow } from "date-fns";

export const isEmptyArray = (a) => Array.isArray(a) && a.every(isEmptyArray);
export const objectToQueryParams = (obj) => {
  const queryParams = Object.entries(obj)
    .filter(([key, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

export const handleError = (err) => {
  if (typeof err === "string") {
    return err;
  } else if (err?.response?.data?.message) {
    return err?.response?.data?.message;
  } else {
    return "Something went wrong!";
  }
};

export const getValueFromNestedObject = (obj, keyString) => {
  let keys = keyString.split(".");
  let value = obj;
  for (let i = 0; i < keys.length; i++) {
    if (value[keys[i]] !== undefined) {
      value = value[keys[i]];
    } else {
      value = undefined;
      break;
    }
  }

  return value;
};

export const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "N/A";
  const dateTime = new Date(dateTimeString);
  if (!dateTime) return "N/A";

  const formattedDate = dateTime?.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = dateTime?.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  const formattedDateTime = formattedDate && formattedTime ? `${formattedDate} at ${formattedTime}` : "N/A";
  return formattedDateTime;
};

export const getValue = (row, valueOption) => {
  if (valueOption.type === "key") {
    return row[valueOption.value];
  }

  if (valueOption.type === "boolean") {
    return row[valueOption.value]?.toString();
  }

  if (valueOption.type === "element") {
    return valueOption.value;
  }

  if (valueOption.type === "date") {
    return formatDateTime(row[valueOption.value]);
  }

  if (valueOption.type === "nestedKey") {
    if (valueOption.value.includes(".")) {
      return valueOption.value.split(".").reduce((acc, prop) => acc && acc[prop], row);
    }

    if (valueOption.value.includes(",")) {
      return valueOption.value.split(",").map((e) => {
        return `${row[e]} ${e} `;
      });
    }
  }
};

export const localStorage = () => {
  try {
    return window?.localStorage;
  } catch (error) {
    return undefined;
  }
};

export const getTrimmedLowercaseValue = (value) => {
  return value?.trim()?.toLowerCase();
};

export function removeBasePriceURL(urlString) {
  try {
    let url = new URL(urlString);

    // Store the parts of the URL we want to keep.
    let paths = "/" + url.pathname.split("/").slice(3).join("/");
    let query = url.search;
    let hash = url.hash;

    return paths + query + hash;
  } catch (error) {
    console.error(error);
  }
}

export function isAdmin() {
  try {
    return localStorage()?.getItem("adminAccessToken");
  } catch (error) {
    console.error(error);
  }
}

export function isAdminPanelAccess() {
  try {
    return localStorage()?.getItem("adminPanelAccessToken");
  } catch (error) {
    console.error(error);
  }
}
export const isObject = (value) => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

export const getLocalStorageItem = (variable) => {
  try {
    return localStorage()?.getItem(variable);
  } catch (error) {
    return false;
  }
};
export const setLocalStorageItem = (variable, value) => {
  try {
    localStorage()?.setItem(variable, value);
  } catch (error) {
    return false;
  }
};
export const removeLocalStorageItem = (variable) => {
  try {
    localStorage()?.removeItem(variable);
  } catch (error) {
    return false;
  }
};

export const mergeLanguage = (modifyData, data) => {
  const finalData = { ...data };
  for (const key in modifyData) {
    if (typeof modifyData[key] === "object" && data.hasOwnProperty(key)) {
      finalData[key] = mergeLanguage(data[key], modifyData[key]);
    } else {
      finalData[key] = modifyData[key];
    }
  }
  return finalData;
};

export const adminEnvCheck = () => {
  try {
    if (isAdmin() || new URLSearchParams(location.search).get("token") || process.env.ENV !== "prod") {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const adminEnvAndTeamCheck = (profileData) => {
  try {
    if (
      isAdmin() ||
      new URLSearchParams(location.search).get("token") ||
      process.env.ENV !== "prod" ||
      profileData?.email?.includes("webrexstudio.com")
    ) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

export const checkPartenerAcc = (profileData) => {
  try {
    if (
      profileData &&
      profileData?.plan_name === "partner_test" &&
      !profileData?.email?.includes("webrexstudio.com")
    ) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const parseJSONData = (data) => {
  try {
    return JSON?.parse(data);
  } catch (error) {
    return data;
  }
};

export const sessionStorage = () => {
  try {
    return window?.sessionStorage;
  } catch (error) {
    return undefined;
  }
};

export function getSessionStorageItem(variable) {
  try {
    return parseJSONData(sessionStorage()?.getItem(variable));
  } catch (error) {
    return false;
  }
}

export const setSessionStorageItem = (variable, value) => {
  try {
    sessionStorage()?.setItem(variable, JSON?.stringify(value));
  } catch (error) {
    return false;
  }
};

export const removeSessionStorageItem = (variable) => {
  try {
    sessionStorage()?.removeItem(variable);
  } catch (error) {
    return false;
  }
};

export const formatTimeAgo = (dateString) => {
  if (dateString) {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } else {
    return "N/A";
  }
};

const commonSlackMessage = (profileData) => `*Our App Plan Name:* ${profileData?.recurringPlanName}
      *Premium with Us:* ${formatTimeAgo(profileData?.trial_start)}
      *Time with Us:* ${formatTimeAgo(profileData?.created)}
      *Open in our admin panel:* <${process.env.SHOPIFY_APP_URL}/admin/user?shopUrl=${
  profileData.shopUrl
}|Click here>
      *Open in shopify partner:* <https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${
  profileData.storeId
}|Click here>
      *Store url:* ${profileData?.shopUrl}
      *Shopify Plan Name:* ${profileData?.plan_display_name}
      *Store created date:* ${formatTimeAgo(profileData?.created_at)}
      *Store name:* ${profileData?.storeName}`;

export const slackChannelMsg = (title, profileData) => {
  if (!adminEnvAndTeamCheck(profileData)) {
    return `\n\n *${title} :*
     ${commonSlackMessage(profileData)}
      `;
  } else return false;
};

export const slackChannelMsgForCustomServices = (title, profileData, storageData = {}) => {
  const { key, time } = storageData;

  // If key is provided, check time-based logic
  if (key && time) {
    const parseLocalStorageItem = JSON.parse(getLocalStorageItem(key) || "null");
    const isShowNotification = parseLocalStorageItem?.expiryDate
      ? new Date() > new Date(parseLocalStorageItem?.expiryDate)
      : true;
    // If notification should not be shown, return false
    if (!isShowNotification) {
      return false;
    }

    // Set expiry date for next notification
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + time);
    setLocalStorageItem(key, JSON.stringify({ expiryDate }));
  }

  // Continue with existing logic
  if (!adminEnvAndTeamCheck(profileData)) {
    return `\n\n *${title} :*
     *App name:* ${process.env.SHOPIFY_APP_NAME}
     ${commonSlackMessage(profileData)}
      `;
  } else return false;
};

export const slackMessageForPricing = (title, profileData) => {
  if (!adminEnvAndTeamCheck(profileData)) {
    return `\n\n *${title} :*
      *Cancellation Reason:* ${profileData?.cancellationReason}
      *Cancellation Message:* ${profileData?.cancellationMessage}
      *Old Plan Discount:* ${profileData?.oldPlanDiscount}
      *New Discount:* ${profileData?.newDiscount}
      *Our App Plan Name:* ${profileData?.recurringPlanName}
      *Premium with Us:* ${formatTimeAgo(new Date(profileData?.trial_start))}
      *Time with Us:* ${formatTimeAgo(new Date(profileData?.created))}
      *Open in our admin panel:* ${`<${process.env.SHOPIFY_APP_URL}/admin/user?shopUrl=${profileData?.shopUrl}|Click here>`}
      *Open in shopify partner:* ${`<https://partners.shopify.com/${process.env.PARTNER_ACCOUNT_ID}/stores/${profileData?.storeId}|Click here>`}
      *Store url:* ${profileData?.shopUrl}
      *Store name:* ${profileData?.storeName}
      `;
  } else return false;
};
