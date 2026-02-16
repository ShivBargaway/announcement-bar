import {
  ButtonIcon,
  CartIcon,
  ClockIcon,
  DeliveryIcon,
  EmailIcon,
  ProductIcon,
  ProductUnavailableIcon,
  TextIcon,
  VariantIcon,
} from "@shopify/polaris-icons";
import { ButtonComponent, buttonInitialValues } from "../Mocks/Button";
import { CountDownTimer, clockInitialValues } from "../Mocks/CountdownTimer";
import { Email, emailInitialValues } from "../Mocks/Email";
import { Message, messageInitialValues } from "../Mocks/Message";
import { ProductTitle, ProductTitleInitialValues } from "../Mocks/ProductTitle";
import { Quantity, quantityInitialValues } from "../Mocks/Quantity";
import { ShippingText, shippingInitialValue } from "../Mocks/ShippingText";
import { Variant, VariantInitialValues } from "../Mocks/Variant";

export default function AllComponents() {
  const countdown = clockInitialValues();
  const mainComponents = {
    text: createComponent("Text", messageInitialValues, TextIcon, Message, "Text", [
      "general",
      "shippingBar",
      "email",
      "cart",
      "entire",
      "countdown",
      "promotionBar",
      "button",
      "coupon",
      "embeded",
    ]),
    button: createComponent("Button", buttonInitialValues, ButtonIcon, ButtonComponent, "Button", [
      "general",
      "shippingBar",
      "email",
      "cart",
      "entire",
      "countdown",
      "promotionBar",
      "button",
      "coupon",
      "embeded",
    ]),
    clock: createComponent("Clock", countdown, ClockIcon, CountDownTimer, "Clock", [
      "general",
      "shippingBar",
      "email",
      "cart",
      "entire",
      "countdown",
      "promotionBar",
      "button",
      "coupon",
      "embeded",
    ]),
    shipping: createComponent(
      "freeShippingBar",
      shippingInitialValue,
      DeliveryIcon,
      ShippingText,
      "Free Shipping Bar",
      []
    ),
    email: createComponent("Email", emailInitialValues, EmailIcon, Email, "Email"),
    product: createComponent(
      "productTitle",
      ProductTitleInitialValues,
      ProductIcon,
      ProductTitle,
      "Product Title"
    ),
    variant: createComponent("variant", VariantInitialValues, VariantIcon, Variant, "Variant"),
    quantity: createComponent("quantity", quantityInitialValues, ProductUnavailableIcon, Quantity, "Quantity"),
  };
  const fieldsToRemove = ["callToActionOption", "btnLink", "openEnabled", "targetLink"];

  const createModifiedButton = (dataType, btnName) => ({
    ...mainComponents.button,
    dataType,
    fieldsToRemove,
    initialValues: { ...mainComponents.button.initialValues, btnName },
  });

  const createModifiedText = (helpText, textEditor) => ({
    ...mainComponents.text,
    helpText,
    initialValues: { ...mainComponents.text.initialValues, textEditor },
  });

  // Final Component Structure
  const components = [
    mainComponents.text,
    mainComponents.button,
    mainComponents.clock,
    mainComponents.shipping,
    {
      type: "emailBar",
      icon: EmailIcon,
      label: "Email Bar",
      showfield: [],
      childComponent: [
        mainComponents.email,
        createModifiedButton("Contact-Submit", "Subscribe"),
        createModifiedText("Add your message for after subscribing", "Thanks"),
      ],
    },
    {
      type: "cartBar",
      icon: CartIcon,
      label: "Add To Cart",
      showfield: [],
      childComponent: [
        mainComponents.product,
        mainComponents.variant,
        mainComponents.quantity,
        createModifiedButton("Add-To-Cart", "Add To Cart"),
      ],
    },
  ];

  return components;
}
function createComponent(type, initialValues, icon, component, label, showfield = []) {
  return {
    type,
    initialValues,
    icon,
    component,
    label,
    showfield,
  };
}
