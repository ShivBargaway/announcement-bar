import React, { useEffect } from "react";
import { Divider, InlineStack, Text } from "@shopify/polaris";

const handleTab = (paramName, action) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchedParamValue = urlParams.get(paramName);
    if (searchedParamValue) {
      setTimeout(() => {
        action(Number(searchedParamValue) || 0);
      }, 300);
    } else {
      action(0);
    }
  }, []);
};

const handleBackPageUrl = (paramName, action) => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchedParamValue = urlParams.get(paramName);
    if (searchedParamValue) {
      setTimeout(() => {
        action(searchedParamValue === "home" ? "" : searchedParamValue || "");
      }, 300);
    }
    // else {
    //   action("");
    // }
  }, []);
};

const ViewCommonField = ({ user = {} }) => {
  const values = [];
  for (const key in user) {
    const value = user[key];
    if (Array.isArray(value) && value !== null) {
      if (typeof value[0] === "string") {
        values.push(
          <div key={key}>
            <InlineStack gap="200" columns={2}>
              <Text variant="headingMd">{key}:</Text>
              <ViewCommonField user={value} />
            </InlineStack>
            <Divider />
          </div>
        );
      } else {
        values.push(
          <div key={key}>
            <InlineStack gap="200">
              <Text variant="headingMd">{key}:</Text>
              {value.map((item, index) => (
                <div key={`${key}_${index}`}>
                  <ViewCommonField user={item} />
                  <br />
                </div>
              ))}
            </InlineStack>
            <Divider />
          </div>
        );
      }
    } else if (typeof value === "object" && value !== null) {
      values.push(
        <div key={key}>
          <InlineStack gap="200">
            <Text variant="headingMd">{key}:</Text>
            <ViewCommonField user={value} />
          </InlineStack>
          <Divider />
        </div>
      );
    } else {
      values.push(
        <div key={key}>
          <InlineStack gap="200">
            <Text variant="headingMd">{key} :</Text>
            <Text>{typeof value === "boolean" ? (value ? "✅" : "❌") : value}</Text>
          </InlineStack>
          <Divider />
        </div>
      );
    }
  }

  return values;
};

const makeCommonFormField = (user = {}, excludeFields = []) => {
  const fieldArray = [];
  for (const key in user) {
    if (!excludeFields.includes(key)) {
      if (Array.isArray(user[key]) && user[key] !== null) {
        if (typeof user[key][0] === "string") {
          let subfields = makeCommonFormField(user[key][0]);
          fieldArray.push({
            id: key,
            name: key,
            label: <b>{key}</b>,
            type: "array",
            hideAddbtn: false,
            hideDeletebtn: false,
            groupSize: subfields.length,
            section: true,
            subfields: subfields,
          });
        } else {
          let subfields = makeCommonFormField(user[key][0]);
          fieldArray.push({
            id: key,
            name: key,
            label: <b>{key}</b>,
            nested: "array",
            hideAddbtn: false,
            hideDeletebtn: false,
            groupSize: subfields.length,
            section: true,
            subfields: subfields,
          });
        }
      } else if (typeof user[key] === "object" && user[key] !== null) {
        let subfields = makeCommonFormField(user[key]);
        fieldArray.push({
          id: key,
          name: key,
          label: <b>{key}</b>,
          nested: "object",
          groupSize: subfields.length > 4 ? 4 : subfields.length,
          section: true,
          subfields: subfields,
        });
      } else {
        if (typeof user[key] === "boolean") {
          fieldArray.push({
            id: key,
            name: key,
            label: key,
            type: "checkbox",
          });
        } else {
          fieldArray.push({
            id: key,
            name: key,
            label: key,
            type: "text",
          });
        }
      }
    }
  }
  return fieldArray;
};

const findOperatorLabel = (value) => {
  switch (value) {
    case "$gt":
      return ">";
    case "$gte":
      return ">=";
    case "$lt":
      return "<";
    case "$lte":
      return "<=";
    case "$eq":
      return "=";
    case "$ne":
      return "!=";
    case "regex":
      return "Contain";
    case "notregex":
      return "Not Contain";
    case "$in":
      return "Include";
    case "$nin":
      return "Not Include";
    case "$all":
      return "All";
    default:
      return value;
  }
};

const booleanLabel = (val) => (typeof val === "boolean" ? (val ? "Yes" : "No") : val);

const makeAdvanceFilterLabel = (value, label) => {
  let labelWithValue = ``;
  if (Array.isArray(value)) {
    const firstElement = value[0];
    const firstElementType = typeof value[0];
    if (firstElementType === "object" && firstElement !== null) {
      const keyValue = value.map((obj) => {
        const keyValuePairs = Object.entries(obj).map(([key, value]) => `${key}:${JSON.stringify(value)}`);
        return keyValuePairs.join(",");
      });
      labelWithValue = `${label}: ${capitalName(keyValue)}`;
    } else {
      labelWithValue = `${label}: ${value?.map((e) => capitalName(booleanLabel(e)))?.join(", ")}`;
    }
  } else if (value !== null && typeof value === "object") {
    const resultString = Object.entries(value)
      .map(([key, value]) => {
        if (key === "operators") return findOperatorLabel(value);
        else return `${value}`;
      })
      .join(" ");
    labelWithValue = `${label}: ${capitalName(resultString)}`;
  } else {
    labelWithValue = `${label}: ${booleanLabel(value)}`;
  }
  return labelWithValue;
};

const capitalName = (name) => name?.charAt(0)?.toUpperCase() + name?.slice(1);

const extractAMPMTime = (userDate) => {
  const date = new Date(userDate);
  const hour = date.getHours() % 12 || 12;
  const minutes = `0${date.getMinutes()}`.slice(-2);
  const ampm = date.getHours() >= 12 ? "PM" : "AM";
  return `${hour}:${minutes} ${ampm}`;
};

const formatAIToken = (num, maxDecimalPlaces = 4) => {
  if (num >= 1000000) {
    const value = num / 1000000;
    return (Number.isInteger(value) ? value : value.toFixed(maxDecimalPlaces)) + "M";
  } else if (num >= 1000) {
    const value = num / 1000;
    return (Number.isInteger(value) ? value : value.toFixed(2)) + "k";
  }
  return num;
};

const generatePartnerAppUrl = (baseUrl, appName) => {
  if (!baseUrl || !appName) return baseUrl || "";

  // Encode app name (replace spaces with %20)
  const utmSource = encodeURIComponent(appName);
  const utmMedium = "webrex_shopify_app";
  const utmCampaign = "app_campaign";

  // Check if URL already has query parameters
  const separator = baseUrl.includes("?") ? "&" : "?";

  return `${baseUrl}${separator}utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
};

export {
  handleTab,
  handleBackPageUrl,
  makeCommonFormField,
  ViewCommonField,
  makeAdvanceFilterLabel,
  capitalName,
  extractAMPMTime,
  formatAIToken,
  generatePartnerAppUrl,
};
