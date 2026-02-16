import React, { useState } from "react";
import { t } from "i18next";
import CommonForm from "@/Components/Common/CommonForm";
import { convertToLocaleString } from "../../../Utils/AppUtils";

const getformFields = () => [
  {
    id: "timerType",
    name: "timerType",
    label: t("common.Timer Type"),
    labelPosition: "right",
    type: "select",
    options: [
      { label: t("common.Normal Timer"), value: "normal" },
      { label: t("common.Auto repeat timer"), value: "repeated" },
    ],
  },

  {
    id: "timer",
    name: "timer",
    label: t("common.Date"),
    labelPosition: "right",
    type: "datetime-local",
    dependOn: {
      name: "timerType",
      value: "normal",
      type: "hidden",
    },
  },
  {
    id: "repeatedTimer",
    name: "repeatedTimer",
    nested: "object",
    groupSize: 1,
    section: false,
    dependOn: {
      name: "timerType",
      value: "repeated",
      type: "hidden",
    },
    subfields: [
      {
        id: "repeatTimerCreateDate",
        name: "repeatTimerCreateDate",
        label: t("common.Repeat Timer Date"),
        labelPosition: "right",
        type: "datetime-local",
        dependOn: {
          name: "timerType",
          value: "repeated",
          type: "hidden",
        },
      },
      {
        id: "selectReaptTime",
        name: "selectReaptTime",
        label: t("common.Select Repeat Time"),
        type: "number",
        dependOn: {
          name: "timerType",
          value: "repeated",
          type: "hidden",
        },
      },

      {
        id: "selectReaptHours",
        name: "selectReaptHours",
        label: t("common.Repeated Hours"),
        type: "select",
        options: [
          { label: t("common.Minute"), value: "minute" },
          { label: t("common.Hour"), value: "hour" },
          { label: t("common.Day"), value: "day" },
        ],
        dependOn: {
          name: "timerType",
          value: "repeated",
          type: "hidden",
        },
      },
    ],
  },
  {
    id: "removeTimer",
    name: "removeTimer",
    label: t("common.Remove Timer When Time End"),
    labelPosition: "right",
    type: "checkbox",
    dependOn: {
      name: "timerType",
      value: "normal",
      type: "hidden",
    },
  },
  {
    id: "timerSeparator",
    name: "timerSeparator",
    label: t("common.Timer Separator"),
    labelPosition: "left",
    type: "checkbox",
  },
  {
    id: "timerTextColor",
    name: "timerTextColor",
    label: t("common.Countdown Timer color"),
    labelPosition: "right",
    type: "colorPicker",
    size: "40px",
  },
  {
    id: "timerTextSize",
    name: "timerTextSize",
    label: t("common.Timer Text Size"),
    labelPosition: "right",
    type: "rangeSlider",
  },
  {
    id: "timerCustomOpt",
    name: "timerCustomOpt",
    label: t("common.Timer Text Setting"),
    labelPosition: "right",
    type: "checkbox",
  },
  {
    id: "timerTextOption",
    name: "timerTextOption",
    nested: "object",
    groupSize: 1,
    section: false,
    dependOn: {
      name: "timerCustomOpt",
      value: true,
      type: "hidden",
    },
    subfields: [
      {
        id: "dayText",
        name: "dayText",
        label: t("common.Day Text"),
        type: "text",
        validated: true,
        errormsg: t("common.Day Text is required"),
        dependOn: {
          name: "timerCustomOpt",
          value: true,
          type: "hidden",
        },
      },
      {
        id: "hourText",
        name: "hourText",
        label: t("common.Hour Text"),
        type: "text",
        validated: true,
        errormsg: t("common.Hour Text is required"),
        dependOn: {
          name: "timerCustomOpt",
          value: true,
          type: "hidden",
        },
      },
      {
        id: "minuteText",
        name: "minuteText",
        label: t("common.Minute Text"),
        type: "text",
        validated: true,
        errormsg: t("common.Minute Text is required"),
        dependOn: {
          name: "timerCustomOpt",
          value: true,
          type: "hidden",
        },
      },
      {
        id: "secondText",
        name: "secondText",
        label: t("common.Second Text"),
        type: "text",
        validated: true,
        errormsg: t("common.Second Text is required"),
        dependOn: {
          name: "timerCustomOpt",
          value: true,
          type: "hidden",
        },
      },
    ],
  },
];
export const countDownField = [
  "timerEnabled",
  "timerType",
  "timer",
  "removeTimer",
  "timerSeparator",
  "timerName",
  {
    fieldName: "repeatedTimer",
    fields: ["repeatedHours", "repeatTimerCreateDate", "repeatedTimeEnd", "selectReaptTime", "selectReaptHours"],
  },
];
export const clockInitialValues = () => {
  const inItDate = () => {
    let newDate = new Date();
    newDate.setDate(newDate.getDate() + 1);
    return convertToLocaleString(newDate);
  };

  const initialValues = {
    timerEnabled: true,
    timerType: "normal",
    timer: inItDate(),
    removeTimer: false,
    timerSeparator: false,
    timerName: "normal",
    repeatedTimer: {
      repeatedHours: "0.167",
      repeatTimerCreateDate: convertToLocaleString(new Date()),
      selectReaptTime: 5,
      selectReaptHours: "minute",
    },
    timerTextColor: "#fff",
    timerTextSize: "18",
    timerCustomOpt: true,
    timerTextOption: {
      dayText: "DAYS",
      hourText: "HOURS",
      minuteText: "MINUTE",
      secondText: "SECOND",
    },
  };

  return initialValues;
};

export function CountDownTimer(props) {
  const formFields = getformFields();
  const { handleSubmit, formRef, handleFormChange, initialValue } = props;
  return (
    <CommonForm
      onSubmit={handleSubmit}
      formFields={formFields}
      initialValues={initialValue}
      formRef={formRef}
      isSave={false}
      onFormChange={handleFormChange}
      noCompare={false}
      enableReinitialize={true}
    />
  );
}
