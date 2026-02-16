import React, { useEffect, useRef } from "react";
import { generateSlideHTML } from "../../../Utils/AppUtils.js";
import { generateHtmlForslide } from "../../../Utils/slider.js";

export default function Preview(props) {
  const { values, mobile, navigationItems } = props;
  const myDivRef = useRef(null);

  useEffect(() => {
    let modifiedValues = { ...values };
    // modifiedValues["htmlLayout"] = generateSlideHTML(modifiedValues, navigationItems, mobile);
    const mobileElement = generateSlideHTML(modifiedValues, navigationItems, true);
    const desktopElement = generateSlideHTML(modifiedValues, navigationItems, false);
    modifiedValues.htmlLayout = {
      mobile: mobileElement,
      desktop: desktopElement,
    };

    if (myDivRef.current && modifiedValues) {
      myDivRef.current.innerHTML = "";
      myDivRef.current.appendChild(generateHtmlForslide(modifiedValues, 0, [], true, mobile));
    }
  }, [values, mobile, navigationItems]);

  return (
    <>
      <div id="Notifications"></div>
      <div id="announcement-slider-add">
        <div id="announcement-bar-with-slider">
          <div ref={myDivRef}></div>
        </div>
      </div>
    </>
  );
}
