import createApp from "@shopify/app-bridge";
import moment from "moment";

export const manageInitialValue = (res, field) => {
  return field.reduce((values, fieldName) => {
    values[fieldName] = res[fieldName];
    return values;
  }, {});
};
export const manageRemoveValue = (res, fieldsToRemove) => {
  const newObject = { ...res };
  fieldsToRemove.forEach((fieldName) => {
    delete newObject[fieldName];
  });
  return newObject;
};

export const manageObjectInitialValue = (res, field) => {
  return field.reduce((values, fieldObj) => {
    if (typeof fieldObj === "string") {
      values[fieldObj] = res[fieldObj];
    } else {
      const { fieldName, fields } = fieldObj;
      values[fieldName] = fields.reduce((subValues, subField) => {
        subValues[subField] = res[fieldName][subField];
        return subValues;
      }, {});
    }
    return values;
  }, {});
};

export const repeatedHoursChanged = (res) => {
  var { repeatedHours, selectReaptHours, selectReaptTime } = res;
  if (selectReaptTime > 1) {
    if (selectReaptHours == "minute") {
      repeatedHours = parseFloat((selectReaptTime / 60).toFixed(4));
    } else if (selectReaptHours == "day") {
      repeatedHours = selectReaptTime * 24;
    } else {
      repeatedHours = selectReaptTime;
    }
  } else {
    selectReaptTime = 1;
  }
  return repeatedHours;
};

export const getRepeatedTimerData = (data) => {
  var { repeatedHours } = data;
  let tmp;
  let time;
  if (repeatedHours < 1) {
    tmp = Math.round(repeatedHours * 60);
    time = "minute";
  } else if (repeatedHours > 24 && repeatedHours % 24 == 0) {
    tmp = parseInt((repeatedHours / 24).toFixed(0));
    time = "day";
  } else {
    tmp = parseInt(repeatedHours);
    time = "hour";
  }
  data = {
    ...data,
    selectReaptHours: time,
    selectReaptTime: tmp,
  };
  return data;
};

export const calculateShippingPrice = (data) => {
  let shippingPrice = data.shippingBarMessage.shippingPrice;
  let currencySymbol = data.currencySymbol;
  let goal = currencySymbol + (shippingPrice * 40) / 100;
  return goal;
};

export const convertLocalDate = (data) => {
  let localDate;
  if (data) {
    localDate = moment.utc(data).local().format("YYYY-MM-DDTHH:mm");
  }
  return localDate;
};
export const convertToLocaleString = (data) => {
  const targetTime = moment(data);
  const formattedDateTime = targetTime.format("YYYY-MM-DDTHH:mm");
  return formattedDateTime;
};

export const convertIsoDate = (data) => {
  const targetTime = moment(data);
  const isoString = targetTime.toISOString();
  return isoString;
};

export const generateSlideHTML = (values, navigationItems, mobile) => {
  if (
    !values?.backgroundColor?.startsWith("radial-gradient") &&
    !values?.backgroundColor?.startsWith("linear-gradient") &&
    !values?.backgroundColor?.startsWith("#")
  ) {
    if (!values?.backgroundColor?.startsWith("url")) {
      values.backgroundColor = `url(https://announcement-bar.webrexstudio.com/background/${values.backgroundColor})`;
    }
  }
  if (
    values?.mobilebackgroundColor &&
    !values.mobilebackgroundColor.startsWith("radial-gradient") &&
    !values.mobilebackgroundColor.startsWith("linear-gradient") &&
    !values.mobilebackgroundColor.startsWith("#") &&
    values.mobilebackgroundColor !== "undefined"
  ) {
    if (!values.mobilebackgroundColor.startsWith("url")) {
      values.mobilebackgroundColor = `url(https://announcement-bar.webrexstudio.com/background/${values.mobilebackgroundColor})`;
    }
  }

  const createTextElement = (values) => {
    const textElement = {
      element: "div",
      attribute: values.textToolEditor ? { class: "ab-slide-text ql-editor" } : { class: "ab-slide-text" },
      style: {
        fontFamily: values.fontFamilyEnabled ? values.fontFamily : "",
      },
      child: [
        {
          element: "h4",
          textContent: values.textToolEditor ? values.textEditor : values.slideMessage,
          style: {
            fontWeight: values.fontWeight,
            fontSize: values.fontSize + "px",
            color: values.fontColor,
            fontStyle: values.fontStyle,
          },
        },
      ],
    };
    return textElement;
  };

  const createButtonElement = (values, dataType) => {
    if (values.callToActionOption?.buttonType != "entire") {
      let buttonElement = {};
      values.callToAction = values.callToActionOption.buttonType != "none" ? true : false;
      if (values.callToAction) {
        if (values.callToActionOption.buttonType !== "entire") {
          const commonButton = {
            element: "div",
            attribute: {
              class: "ab-slide-btn",
              copyText: values.callToActionOption?.buttonType === "btnCoupon" ? true : false,
              "data-Type": dataType ? dataType : "",
            },
            child: [
              {
                element: "a",
                attribute: {
                  target: values.openEnabled,
                  href: values.btnLink,
                  "Copied-Text": values.btnCopiedText,
                },
                textContent: values.btnName,
                style: {
                  color: values.btnTextColor,
                  fontSize: values.btnFontSize + "px",
                },
              },
              {
                element: "style",
                textContent: `#announcement-bar-with-slider .ab-slide:nth-child .ab-slide-btn:nth-child(${values.btnlength}):hover a `,
                otherStyle: {
                  background: values.btnHoverColor + " !important",
                  color: values.btnTextHoverColor + " !important",
                },
              },
            ],
          };

          const buttonTypeSpecifics = {
            button: {
              style: {
                background: values.btnColor,
                borderRadius: values.btnRadius + "px",
              },
            },
            btnLink: {
              style: {
                textDecoration: "underline",
                padding: "0px",
                boxShadow: "none",
                borderRadius: values.btnRadius + "px",
              },
            },
            btnCoupon: {
              style: {
                boxShadow: "none",
                border: values?.btnBorder || "2px dashed",
                borderRadius: values.btnRadius + "px",
                background: values?.btnColor || "inherit",
              },
              attribute: { href: "javascript:void(0);", target: null },
            },
          };

          const buttonTypeSpecific = buttonTypeSpecifics[values.callToActionOption.buttonType];

          if (buttonTypeSpecific) {
            Object.assign(commonButton.child[0].style, buttonTypeSpecific.style);
            if (buttonTypeSpecific.attribute) {
              Object.assign(commonButton.child[0].attribute, buttonTypeSpecific.attribute);
            }
          }
          buttonElement = commonButton;
        }
      }
      return buttonElement;
    }
  };

  const createClockElement = (values) => {
    let clockElement = {};
    if (values.timerEnabled) {
      const timerElement = {
        element: "div",
        attribute: { class: "ab-clock" },
        child: [
          {
            element: "ul",
            attribute: {
              "clock-type": values.timerType,
              date: values.timerType === "normal" ? values.timer : {},
              ...(values.timerType === "repeated"
                ? {
                    repeatedHours: values.repeatedTimer.repeatedHours,
                    repeatTimerCreateDate: values.repeatedTimer.repeatTimerCreateDate,
                  }
                : {}),
              ...(values.timerSeparator ? { class: "wsab-separator" } : {}),
              removeTimer: values.removeTimer,
            },

            child: [
              {
                element: "li",
                style: {
                  fontSize: (values.timerTextSize * 50) / 100 + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
                child: [
                  {
                    element: "span",
                    attribute: {
                      id: "days",
                    },
                    style: {
                      fontSize: values.timerTextSize + "px",
                      color: values.timerTextColor,
                    },
                  },
                  values.timerCustomOpt ? values.timerTextOption.dayText : "",
                ],
              },
              {
                element: "li",
                attribute: { class: "wsab-timer-separator" },
                textContent: ":",
                style: {
                  fontSize: values.timerTextSize + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
              },

              {
                element: "li",
                style: {
                  fontSize: (values.timerTextSize * 50) / 100 + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
                child: [
                  {
                    element: "span",
                    attribute: {
                      id: "hours",
                    },
                    style: {
                      fontSize: values.timerTextSize + "px",
                      color: values.timerTextColor,
                    },
                  },
                  values.timerCustomOpt ? values.timerTextOption.hourText : "",
                ],
              },
              {
                element: "li",
                style: {
                  fontSize: (values.timerTextSize * 50) / 100 + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
                attribute: { class: "wsab-timer-separator" },
                textContent: ":",
                style: {
                  fontSize: values.timerTextSize + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
              },

              {
                element: "li",
                style: {
                  fontSize: (values.timerTextSize * 50) / 100 + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
                child: [
                  {
                    element: "span",
                    attribute: {
                      id: "minutes",
                    },
                    style: {
                      fontSize: values.timerTextSize + "px",
                      color: values.timerTextColor,
                    },
                  },
                  values.timerCustomOpt ? values.timerTextOption.minuteText : "",
                ],
              },
              {
                element: "li",
                attribute: { class: "wsab-timer-separator" },
                textContent: ":",
                style: {
                  fontSize: values.timerTextSize + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
              },

              {
                element: "li",
                style: {
                  fontSize: (values.timerTextSize * 50) / 100 + "px",
                  color: values.timerTextColor,
                  margin: "0px",
                  lineHeight: 1.3,
                },
                child: [
                  {
                    element: "span",
                    attribute: {
                      id: "seconds",
                    },
                    style: {
                      fontSize: values.timerTextSize + "px",
                      color: values.timerTextColor,
                    },
                  },
                  values.timerCustomOpt ? values.timerTextOption.secondText : "",
                ],
              },
            ],
          },
        ],
      };

      if (values.timer && values.timerType === "normal") {
        if (values.removeTimer && new Date(values.timer) < new Date()) {
        } else {
          clockElement = timerElement;
        }
      } else if (values.repeatedTimer && values.repeatedTimer.repeatedHours) {
        if (
          values.repeatedTimer.repeatedTimeEnd &&
          new Date(Date.parse(values.repeatedTimer.repeatedTimeEnd)) < new Date()
        ) {
        } else {
          clockElement = timerElement;
        }
      }
    }
    return clockElement;
  };

  const createShippingElement = (values) => {
    const shippingElement = {
      element: "div",
      attribute: { class: "ab-slide-shipping ab-slide-text" },
      style: {
        fontFamily: values.fontFamilyEnabled ? values.fontFamily : "",
      },
      child: [
        {
          element: "h4",
          style: {
            fontWeight: values.fontWeight,
            fontSize: values.fontSize + "px",
            color: values.fontColor,
            fontStyle: values.fontStyle,
          },
          child: [
            {
              element: "span",
              attribute: {
                "progress-start-Msg": values.progressMessage.progressStart,
                "gole-msg": values.goalMessage,
              },
              textContent: values.shippingBarMessage.messageStart,
            },
            {
              element: "span",
              attribute: {
                class: values.moneyClass ? "money" : "", // Conditionally set the class
                "price-data": values.shippingBarMessage.shippingPrice, // Set the price-data attribute
                currency: values.currencySymbol,
                position: values.currencyPosition,
              },
              textContent:
                values.currencyPosition == "before"
                  ? values.currencySymbol + values.shippingBarMessage.shippingPrice
                  : values.shippingBarMessage.shippingPrice + values.currencySymbol + " ",
              style: {
                fontWeight: values.shippingWeight,
                fontSize: values.shippingSize + "px",
                color: values.shippingColor,
                padding: "5px",
              },
            },
            {
              element: "span",
              attribute: { "progress-end-Msg": " " + values.progressMessage.progressEnd },
              textContent: values.shippingBarMessage.messageEnd,
            },
          ],
        },
      ],
    };
    return shippingElement;
  };

  const createproductTitleElement = (values) => {
    const productElement = {
      element: "div",
      attribute: { class: "products" },
      child: [],
    };

    const addFieldElement = (fields, targetElement) => {
      fields.forEach((field) => {
        if (values[field.name]) {
          const fieldElement = {
            element: field.element || "div",
            attribute: field.attribute || {},
            textContent: field.textContent || "",
            style: field.style || {},
            child: [],
          };

          if (field.child && field.child.length > 0) {
            addFieldElement(field.child, fieldElement);
          }
          targetElement.child.push(fieldElement);
        }
      });
    };
    const productImgFields = [
      {
        name: "productImage",
        element: "div",
        attribute: { class: "product-img" },
        child: [
          {
            name: "productImage",
            element: "img",
            attribute: { src: `${process.env.SHOPIFY_APP_URL}/background/productImage.png` },
          },
        ],
      },
    ];
    const productFields = [
      {
        name: "productTitle",
        textContent: "Product Title",
        attribute: { class: "product-title" },
        style: { color: "#ffffff" },
      },
    ];
    const comparePrice = [
      {
        name: "comparePrice",
        element: "div",
        attribute: { class: "compare-price" },
        style: { textDecoration: "line-through", color: "#ffffff" },
        child: [
          { name: "comparePrice", element: "span", attribute: { class: "product_symbol" }, textContent: "₹" },
          {
            name: "comparePrice",
            element: "span",
            attribute: { class: "product_price" },
            textContent: "150",
            style: { marginRight: "5px" },
          },
          { name: "comparePrice", element: "span", attribute: { class: "product_currency" }, textContent: "INR" },
        ],
      },
    ];
    const price = [
      {
        name: "price",
        element: "div",
        attribute: { class: "price" },
        style: { color: "#ffffff" },

        child: [
          { name: "price", element: "span", attribute: { class: "product_symbol" }, textContent: "₹" },
          {
            name: "price",
            element: "span",
            attribute: { class: "product_price" },
            textContent: "120",
            style: { marginRight: "5px" },
          },
          { name: "price", element: "span", attribute: { class: "product_currency" }, textContent: "INR" },
        ],
      },
    ];
    const productPriceElement = {
      element: "div",
      attribute: { class: "product-price" },
      child: [],
    };
    const productDetailsElement = {
      element: "div",
      attribute: { class: "product-details" },
      child: [],
    };
    addFieldElement(productFields, productDetailsElement);
    addFieldElement(productImgFields, productElement);
    addFieldElement(comparePrice, productPriceElement);
    addFieldElement(price, productPriceElement);
    productDetailsElement.child.push(productPriceElement);
    productElement.child.push(productDetailsElement);

    return productElement;
  };

  const createVariantElement = (values) => {
    if (values.variant) {
      const variantElement = {
        element: "div",
        attribute: { class: "product-variant" },
        child: [
          {
            element: "select",
            attribute: { class: "variants_Select" },
            child: [
              { element: "option", attribute: { value: "Small" }, textContent: "Small" },
              { element: "option", attribute: { value: "Medium" }, textContent: "Medium" },
              { element: "option", attribute: { value: "Large" }, textContent: "Large" },
            ],
          },
          {
            element: "select",
            attribute: { class: "variants_Select" },
            child: [
              { element: "option", attribute: { value: "White" }, textContent: "White" },
              { element: "option", attribute: { value: "Black" }, textContent: "Black" },
            ],
          },
        ],
      };

      return variantElement;
    }
  };

  const createQuantityElement = (values) => {
    if (values.quantity) {
      const quantityElement = {
        element: "div",
        attribute: { class: "Quantity" },
        child: [
          {
            element: "div",
            attribute: { class: "Quantity_Cut", style: "color: rgb(38, 54, 68); filter: saturate(50%);" },
            textContent: "-",
          },
          { element: "div", attribute: { class: "Quantity_Space" } },
          {
            element: "input",
            attribute: {
              value: "1",
              style: "width: 2.3rem; text-align: center; border: none; font-size: 16px;",
              class: "quantityInput",
            },
          },
          { element: "div", attribute: { class: "Quantity_Space" } },
          {
            element: "div",
            attribute: { class: "Quantity_Add" },
            textContent: "+",
          },
        ],
      };
      return quantityElement;
    }
  };

  const createEmailElement = (values) => {
    const emailElement = {
      element: "div",
      attribute: { class: "email-inputs" },
      child: [],
      style: {
        display: "flex",
        justifyContent: "center",
      },
    };

    const emailFields = [
      { name: "email", type: "email", placeholder: "Email" },
      { name: "firstName", type: "text", placeholder: "First Name" },
      { name: "lastName", type: "text", placeholder: "Last Name" },
      { name: "Phone", type: "text", placeholder: "Phone" },
    ];

    emailFields.forEach((field) => {
      if (values.emailFields[field.name]) {
        emailElement.child.push({
          element: "input",
          attribute: {
            class: "email-input",
            name: field.name,
            type: field.type,
            placeholder: field.placeholder,
            id: "slideId",
          },
        });
      }
    });

    return emailElement;
  };
  const createEmailButtonElement = (values, dataType) => {
    const emailButtonElement = {
      element: "div",
      attribute: { class: "email-button" },
      child: [createButtonElement(values, dataType)],
    };
    return emailButtonElement;
  };

  const createEmailBarElements = (navigation) => {
    const emailBarElementsObject = {
      element: "div",
      attribute: { class: "ab-slide-email" },
      child: [],
    };

    let buttonElement = null;

    navigation.childComponent.forEach((childComponent) => {
      if (childComponent.type === "Email") {
        const emailElement = createEmailElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting
        );
        emailBarElementsObject.child.push(emailElement);
      }
      if (childComponent.type === "Button") {
        buttonElement = createEmailButtonElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting,
          childComponent.dataType
        );
      }
    });

    return [{ ...emailBarElementsObject }, { ...buttonElement }];
  };

  const createCartBarElements = (navigation) => {
    const cartBarElementsObject = {
      element: "div",
      attribute: { class: "ab-slide-cart" },
      child: [],
    };

    navigation.childComponent.forEach((childComponent) => {
      if (childComponent.type === "productTitle") {
        const productTitleElement = createproductTitleElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting
        );
        cartBarElementsObject.child.push(productTitleElement);
      }
      if (childComponent.type === "variant") {
        const VariantElement = createVariantElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting
        );
        if (VariantElement) {
          cartBarElementsObject.child.push(VariantElement);
        }
      }
      if (childComponent.type === "quantity") {
        const quantityElement = createQuantityElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting
        );
        if (quantityElement) {
          cartBarElementsObject.child.push(quantityElement);
        }
      }
      if (childComponent.type === "Button") {
        const buttonElement = createButtonElement(
          mobile
            ? childComponent.mobileSetting
              ? childComponent.mobileSetting
              : childComponent.desktopSetting
            : childComponent.desktopSetting,
          childComponent.dataType
        );
        cartBarElementsObject.child.push(buttonElement);
      }
    });

    return [{ ...cartBarElementsObject }];
  };

  const createOrderedSlideElement = (navigationItems) => {
    const elements = navigationItems.map((navigation) => {
      if (navigation.type === "Text") {
        return createTextElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "Button") {
        return createButtonElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "Clock") {
        return createClockElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "freeShippingBar") {
        return createShippingElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "productTitle") {
        return createproductTitleElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "variant") {
        return createVariantElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "quantity") {
        return createQuantityElement(
          mobile
            ? navigation.mobileSetting
              ? navigation.mobileSetting
              : navigation.desktopSetting
            : navigation.desktopSetting
        );
      } else if (navigation.type === "emailBar") {
        return createEmailBarElements(navigation);
      } else if (navigation.type === "cartBar") {
        return createCartBarElements(navigation);
      }
      return null;
    });
    let finalElement = [];
    elements.map((e) => {
      if (Array.isArray(e)) finalElement = [...finalElement, ...e];
      else finalElement.push(e);
    });
    return finalElement.filter((element) => element);
  };
  let slideElement = null;

  slideElement = createOrderedSlideElement(navigationItems);

  let entireButtonValues;
  let fontFamilyValues;
  let successBarArray = [];

  const checkEntireClickButton = navigationItems.map((navigation) => {
    if (navigation.type === "Button") {
      if (
        navigation?.desktopSetting?.callToActionOption?.buttonType === "entire" ||
        navigation?.mobileSetting?.callToActionOption?.buttonType === "entire"
      ) {
        entireButtonValues = mobile
          ? navigation.mobileSetting
            ? navigation.mobileSetting
            : navigation.desktopSetting
          : navigation.desktopSetting;
      }
    }
    if (navigation.type === "Text") {
      fontFamilyValues = mobile
        ? navigation.mobileSetting
          ? navigation.mobileSetting
          : navigation.desktopSetting
        : navigation.desktopSetting;
    }
    if (navigation.childComponent) {
      navigation.childComponent.map((navigation) => {
        if (navigation.type === "Text") {
          successBarArray.push(
            createTextElement(
              mobile
                ? navigation.mobileSetting
                  ? navigation.mobileSetting
                  : navigation.desktopSetting
                : navigation.desktopSetting
            )
          );
        }
      });
    }
  });
  const hasCartBar = navigationItems.some((navigation) => navigation.type === "cartBar");
  const removeIcon = values.rmvBtnEnabled;

  const htmlDesign = {
    element: "div",
    attribute: {
      class: "ab-slide",
      id: `${hasCartBar ? "cart-bar-added" : ""}`,
    },
    style: {
      background: mobile
        ? values.mobilebackgroundColor
          ? values.mobilebackgroundColor
          : values.backgroundColor
        : values.backgroundColor,
      padding: "5px",
      fontFamily: fontFamilyValues?.fontFamilyEnabled ? fontFamilyValues.fontFamily : "",
    },
    child: (() => {
      const contentArray = [];

      if (entireButtonValues) {
        contentArray.push(
          {
            element: "style",
            textContent: `#announcement-bar-with-slider .ab-slide:nth-child:hover`,
            otherStyle: {
              background: entireButtonValues.textColor + " !important",
            },
          },
          {
            element: "style",
            textContent: `#announcement-bar-with-slider .ab-slide:nth-child:hover h4`,
            otherStyle: {
              color: entireButtonValues.textHoverColor + " !important",
            },
          },
          {
            element: "a",
            attribute: {
              class: "ab-slide-link",
              href: entireButtonValues.targetLink,
              target: entireButtonValues.openEnabled,
            },
            child: [
              {
                element: "div",
                attribute: {
                  class: "ab-slide-content active",
                },
                child: Array.isArray(slideElement) ? slideElement : [slideElement],
              },
              ...(removeIcon
                ? [
                    // Conditionally include remove icon child
                    {
                      element: "div",
                      attribute: {
                        class: "ab-slide-remove",
                        id: `ab-slide-remove_${values._id}`,
                      },
                    },
                  ]
                : []),
            ],
          }
        );
      } else {
        contentArray.push(
          {
            element: "div",
            attribute: {
              class: `ab-slide-content active ${hasCartBar ? "cart-bar" : ""}`,
            },
            child: Array.isArray(slideElement) ? slideElement : [slideElement],
          },
          ...(removeIcon
            ? [
                {
                  element: "div",
                  attribute: {
                    class: "ab-slide-remove",
                    id: `ab-slide-remove_${values._id}`,
                  },
                  style: {
                    color: "#FFF",
                  },
                },
              ]
            : [])
        );

        if (successBarArray.length > 0) {
          contentArray.push({
            element: "div",
            attribute: {
              class: "ab-slide-content email-success",
            },
            child: successBarArray,
          });
        }
      }

      return contentArray;
    })(),
  };
  return htmlDesign;
};

export const removeFormfields = (fields, fieldsToRemove) => {
  const removeFieldRecursive = (field) => {
    if (fieldsToRemove.includes(field.id)) {
      return null;
    }
    if (field.subfields) {
      field.subfields = field.subfields.map(removeFieldRecursive).filter(Boolean);
    }
    return field;
  };
  const updatedFields = fields.map(removeFieldRecursive).filter(Boolean);
  return updatedFields;
};

export const getApp = () => {
  try {
    return createApp({
      apiKey: window?.shopify?.config?.apiKey,
      host: window?.shopify?.config?.host,
    });
  } catch (e) {
    return false;
  }
};
function processClockElement(element) {
  element.desktopSetting.timer = convertToLocaleString(element.desktopSetting.timer);
  element.desktopSetting.repeatedTimer.repeatTimerCreateDate = convertToLocaleString(
    element.desktopSetting.repeatedTimer.repeatTimerCreateDate
  );

  if (element?.mobileSetting) {
    element.mobileSetting.timer = convertToLocaleString(element.mobileSetting.timer);
    element.mobileSetting.repeatedTimer.repeatTimerCreateDate = convertToLocaleString(
      element.mobileSetting.repeatedTimer.repeatTimerCreateDate
    );
  }

  if (element?.desktopSetting?.repeatedTimer) {
    element.desktopSetting.repeatedTimer = getRepeatedTimerData(element.desktopSetting.repeatedTimer);
  }
  if (element?.mobileSetting?.repeatedTimer) {
    element.mobileSetting.repeatedTimer = getRepeatedTimerData(element.mobileSetting.repeatedTimer);
  }
}

export const MakeProperData = (data, countryData, pageData) => {
  data.countryData = data.countryData.map((e) => ({ value: e }));
  const matchCountryData = countryData.filter((countryDataItem) =>
    data.countryData.some((multidataItem) => multidataItem.value === countryDataItem.value)
  );

  data.type = data.type.map((e) => ({ value: e }));
  const matchPageData = pageData.filter((typeItem) =>
    data.type.some((multidataItem) => multidataItem.value === typeItem.value)
  );

  if (data?.repeatedTimer?.repeatedHours) {
    data.repeatedTimer = getRepeatedTimerData(data.repeatedTimer);
  }

  data.displayTime = data.displayTime || {};
  if (data?.displayTime?.startTime) {
    data.displayTime.startTime = convertToLocaleString(data.displayTime.startTime);
  }
  if (data?.displayTime?.endTime) {
    data.displayTime.endTime = convertToLocaleString(data.displayTime.endTime);
  }

  data.displayTime.startTime = data.displayTime.startTime || "";
  data.displayTime.endTime = data.displayTime.endTime || "";
  data.utmSource = data.utmSource || "";
  data.excludeUtm = data.excludeUtm || "";

  data.htmlDesign.forEach((element) => {
    if (element?.type === "Clock") {
      processClockElement(element);
    }
    if (element?.type === "freeShippingBar") {
      processFreeShippingBarElement(element);
    }
  });

  data.type = matchPageData;
  data.countryData = matchCountryData;
  return data;
};

function processFreeShippingBarElement(element) {
  element.desktopSetting.progressMessage.progressGoal = calculateShippingPrice(element.desktopSetting);

  if (element?.mobileSetting) {
    element.mobileSetting.progressMessage.progressGoal = calculateShippingPrice(element.mobileSetting);
  }
}

export const MakeProperSlideData = (data) => {
  for (let i = 0; i < data.htmlDesign.length; i++) {
    const element = data.htmlDesign[i];
    if (element?.type === "Clock") {
      let timerDate = new Date();
      timerDate.setDate(timerDate.getDate() + 2);
      let currentDate = new Date();
      element.desktopSetting.timer = timerDate;
      element.desktopSetting.repeatedTimer.repeatTimerCreateDate = currentDate;
      processClockElement(element);
    }
    if (element?.type === "freeShippingBar") {
      processFreeShippingBarElement(element);
    }
  }
  return data;
};
