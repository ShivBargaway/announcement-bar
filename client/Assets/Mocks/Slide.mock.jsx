import React, { useState } from "react";
import { convertToLocaleString } from "../../Utils/AppUtils";

const getInitialDate = () => {
  let newDate = new Date();
  newDate.setDate(newDate.getDate() + 1);
  return convertToLocaleString(newDate);
};
export const cartInitialValue = [
  {
    id: "cartBar_1",
    parentId: "cartBar_1",
    desktopSetting: {
      id: "cartBar_1",
    },
    type: "cartBar",
    hideDeleteButton: true,
    childComponent: [
      {
        id: "cartBarproductTitle_1",
        desktopSetting: {
          productImage: true,
          productTitle: true,
          comparePrice: true,
          price: true,
          id: "cartBarproductTitle_1",
        },
        type: "productTitle",
        initialValues: {
          productImage: true,
          productTitle: true,
          comparePrice: true,
          price: true,
        },
        label: "Product Title",
      },
      {
        id: "cartBarvariant_1",
        desktopSetting: {
          variant: true,
          id: "cartBarvariant_1",
        },
        type: "variant",
        initialValues: {
          variant: true,
        },
        label: "Variant",
      },
      {
        id: "cartBarquantity_1",
        desktopSetting: {
          quantity: true,
          id: "cartBarquantity_1",
        },
        type: "quantity",
        initialValues: {
          quantity: true,
        },
        label: "Quantity",
      },
      {
        id: "cartBarButton_1",
        desktopSetting: {
          callToActionOption: {
            buttonType: "button",
          },
          btnName: "Add To Cart",
          btnLink: "",
          btnCopiedText: "",
          openEnabled: false,
          targetLink: "",
          btnFontSize: 14,
          btnColor: "#ffffff",
          btnTextColor: "#453e3e",
          btnRadius: 4,
          btnHoverColor: "",
          btnTextHoverColor: "",
          callToAction: true,
          textColor: "#0D0E0C",
          textHoverColor: "#53BE0F",
          id: "cartBarButton_1",
          btnlength: 1,
        },
        type: "Button",
        initialValues: {
          callToActionOption: {
            buttonType: "button",
          },
          btnName: "Add To Cart",
          btnLink: "",
          btnCopiedText: "",
          openEnabled: false,
          targetLink: "",
          btnFontSize: 14,
          btnColor: "#ffffff",
          btnTextColor: "#453e3e",
          btnRadius: 4,
          btnHoverColor: "",
          btnTextHoverColor: "",
          callToAction: true,
          textColor: "#0D0E0C",
          textHoverColor: "#53BE0F",
        },
        label: "Button",
        dataType: "Add-To-Cart",
        fieldsToRemove: ["callToActionOption", "btnLink", "openEnabled", "targetLink"],
      },
    ],
  },
];
export const emailInitialValue = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "Subscribe to enjoy 10% discount",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
  {
    id: "emailBar_1",
    parentId: "emailBar_1",
    label: "Email Bar",
    desktopSetting: {
      id: "emailBar_1",
    },
    type: "emailBar",
    hideDeleteButton: true,
    childComponent: [
      {
        id: "emailBarEmail_1",
        desktopSetting: {
          emailFields: {
            email: true,
            firstName: false,
            lastName: false,
            Phone: false,
          },
          id: "emailBarEmail_1",
        },
        type: "Email",
        label: "Email",
      },
      {
        id: "emailBarButton_1",
        desktopSetting: {
          callToActionOption: {
            buttonType: "button",
          },
          btnName: "Subscribe",
          btnLink: "",
          btnCopiedText: "",
          openEnabled: false,
          targetLink: "",
          btnFontSize: 14,
          btnColor: "#ffffff",
          btnTextColor: "#453e3e",
          btnRadius: 4,
          btnHoverColor: "",
          btnTextHoverColor: "",
          callToAction: true,
          textColor: "#0D0E0C",
          textHoverColor: "#53BE0F",
          id: "emailBarButton_1",
          btnlength: 1,
        },
        type: "Button",
        label: "Button",
        dataType: "Contact-Submit",
        fieldsToRemove: ["callToActionOption", "btnLink", "openEnabled", "targetLink"],
      },
      {
        id: "emailBarText_1",
        desktopSetting: {
          textEditor: "Thanks",
          fontFamily: "Roboto",
          fontFamilyEnabled: false,
          fontStyle: "normal",
          fontSize: "20",
          fontColor: "#ffffff",
          fontWeight: "normal",
          textToolEditor: true,
          id: "emailBarText_1",
        },
        type: "Text",
        label: "Text",
        helpText: "Add your message for after subscribing",
      },
    ],
  },
];

export const promotionInitialValues = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "🎁<strong> Free Gift </strong> with every order. <strong>Shop now!</strong>",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
];

export const shippingBarInitialValues = [
  {
    id: "Free Shipping Bar_1",
    type: "freeShippingBar",
    label: "Free Shipping Bar",
    hideDeleteButton: true,
    desktopSetting: {
      shippingBarMessage: {
        messageStart: "Free shipping for orders over",
        shippingPrice: 100,
        messageEnd: "!hurry Up",
      },
      progressMessage: {
        progressStart: "Only ",
        progressEnd: "away from free shipping",
        progressGoal: "$40",
      },
      goalMessage: "Congratulations! You have got free shipping",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      slideType: "shippingBar",
      shippingColor: "",
      shippingSize: "18",
      shippingWeight: "600",
      currencySymbol: "$",
      moneyClass: false,
      currencyPosition: "before",
      id: "Free Shipping Bar_1",
    },
  },
];

export const entireinitialValue = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "REVIEW EVENT! Share your review and get $3 off!",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
  {
    id: "Button_2",
    type: "Button",
    label: "Button",
    desktopSetting: {
      callToActionOption: {
        buttonType: "entire",
      },
      btnName: "Learn More",
      btnLink: "",
      btnCopiedText: "",
      openEnabled: false,
      targetLink: "",
      btnFontSize: 14,
      btnColor: "#ffffff",
      btnTextColor: "#453e3e",
      btnRadius: 4,
      btnHoverColor: "",
      btnTextHoverColor: "",
      callToAction: true,
      textColor: "#0D0E0C",
      textHoverColor: "#53BE0F",
      id: "Button_2",
      btnlength: 2,
    },
  },
];

export const couponbtninitialValue = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "🎄 Use coupon code and get 20%discount 🎄",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
  {
    id: "Button_2",
    type: "Button",
    label: "Button",
    desktopSetting: {
      callToActionOption: {
        buttonType: "btnCoupon",
      },
      btnName: "Crismistmas",
      btnLink: "",
      btnCopiedText: "Crismistmas",
      openEnabled: false,
      targetLink: "",
      btnFontSize: 14,
      btnColor: "#ffffff",
      btnTextColor: "#fff",
      btnRadius: 4,
      btnHoverColor: "",
      btnTextHoverColor: "",
      callToAction: true,
      textColor: "#0D0E0C",
      textHoverColor: "#53BE0F",
      id: "Button_2",
      btnlength: 2,
    },
  },
];

export const countdownInitialValues = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "🎉 NEW YEAR SALE! 50% OFF",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
  {
    id: "Clock_2",
    type: "Clock",
    label: "Clock",
    desktopSetting: {
      timerEnabled: true,
      timerType: "normal",
      timer: getInitialDate(),
      removeTimer: false,
      timerSeparator: true,
      timerName: "normal",
      repeatedTimer: {
        repeatedHours: "0.167",
        repeatTimerCreateDate: convertToLocaleString(new Date()),
        selectReaptTime: 5,
        selectReaptHours: "minute",
      },
      timerTextColor: "#ffffff",
      timerTextSize: "20",
      timerCustomOpt: true,
      timerTextOption: {
        dayText: "DAYS",
        hourText: "HOURS",
        minuteText: "MINUTE",
        secondText: "SECOND",
      },
      id: "Clock_2",
    },
  },
];

export const buttonInitialValue = [
  {
    id: "Text_1",
    type: "Text",
    label: "Text",
    desktopSetting: {
      textEditor: "New Years Sale Ends In ",
      fontFamily: "Roboto",
      fontFamilyEnabled: false,
      fontStyle: "normal",
      fontSize: "18",
      fontColor: "#ffffff",
      fontWeight: "normal",
      textToolEditor: true,
      id: "Text_1",
    },
  },
  {
    id: "Button_2",
    type: "Button",
    label: "Button",
    desktopSetting: {
      callToActionOption: {
        buttonType: "button",
      },
      btnName: "Shop Now",
      btnLink: "",
      btnCopiedText: "",
      openEnabled: false,
      targetLink: "",
      btnFontSize: 14,
      btnColor: "#1AF44D",
      btnTextColor: "#164FDF",
      btnRadius: 4,
      btnHoverColor: "",
      btnTextHoverColor: "",
      callToAction: true,
      textColor: "#0D0E0C",
      textHoverColor: "#53BE0F",
      id: "Button_2",
      btnlength: 2,
    },
  },
  {
    id: "Clock_3",
    type: "Clock",
    label: "Clock",
    desktopSetting: {
      timerEnabled: true,
      timerType: "normal",
      timer: getInitialDate(),
      removeTimer: false,
      timerSeparator: true,
      timerName: "normal",
      repeatedTimer: {
        repeatedHours: "0.167",
        repeatTimerCreateDate: convertToLocaleString(new Date()),
        selectReaptTime: 5,
        selectReaptHours: "minute",
      },
      timerTextColor: "#ffffff",
      timerTextSize: "20",
      timerCustomOpt: true,
      timerTextOption: {
        dayText: "DAYS",
        hourText: "HOURS",
        minuteText: "MINUTE",
        secondText: "SECOND",
      },
      id: "Clock_3",
    },
  },
];
export const shippingBarFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-15.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-15.png)",
};
export const countdownFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-11.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-11.png)",
};
export const promotionFormvalue = {
  backgroundColor: "linear-gradient(to right, rgb(95, 44, 130), rgb(73, 160, 157))",
  mobilebackgroundColor: "linear-gradient(to right, rgb(95, 44, 130), rgb(73, 160, 157))",
};
export const entireFormvalue = {
  backgroundColor: "linear-gradient(to right, rgb(235, 51, 73) 0%, rgb(244, 92, 67) 100%)",
  mobilebackgroundColor: "linear-gradient(to right, rgb(235, 51, 73) 0%, rgb(244, 92, 67) 100%)",
};
export const buttonFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-8.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-8.png)",
};
export const couponFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/light.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/light.png)",
};
export const emailFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-8.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-8.png)",
};
export const cartFormvalue = {
  backgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-16.png)",
  mobilebackgroundColor: "url(https://announcement-bar.webrexstudio.com/background/back-16.png)",
};
