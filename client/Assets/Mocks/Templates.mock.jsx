import { announcement, button, cart, countdown, coupon, email, embeded, entire, shipping } from "@/Assets/Index";

export const gettemplatesList = () => [
  {
    image: announcement,
    title: "Promotion bar",
    text: "Alert customers of upcoming sales, offers, or set inventory alerts.",
    buttonName: "Select",
    type: "promotionBar",
  },
  {
    image: shipping,
    title: "Free Shipping Bar",
    text: "Increase your order value by using or Free Shipping Bar.",
    buttonName: "Select",
    type: "shippingBar",
  },
  {
    image: cart,
    title: "Add To Cart",
    text: "Conveniently add items to your cart with a single click!",
    buttonName: "Select",
    type: "cart",
    premium: true,
  },
  {
    image: email,
    title: "Contact Bar",
    text: "Select to subscribe and receive special discounts directly to your inbox",
    buttonName: "Select",
    type: "email",
    premium: true,
  },

  {
    image: embeded,
    title: "Embeded",
    text: "Highlight your special offers with an embedded bar, displayed before and after the Add to Cart button.",
    buttonName: "Select",
    type: "embeded",
    premium: true,
  },

  // {
  //   image: entire,
  //   title: "Entire Clickable Bar",
  //   text: "Create an attractive clickable bar for your website.",
  //   buttonName: "Select",
  //   type: "entire",
  // },
  // {
  //   image: button,
  //   title: "Promotional & Countdown Bar",
  //   text: "Boost conversions with the dynamic Promotional & Countdown Bar.",
  //   buttonName: "Select",
  //   type: "button",
  // },
  // {
  //   image: coupon,
  //   title: "Coupon code",
  //   text: "Unlock exclusive savings instantly with the Coupon Code Bar.",
  //   buttonName: "Select",
  //   type: "coupon",
  // },
];
