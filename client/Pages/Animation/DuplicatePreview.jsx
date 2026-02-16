import React, { useEffect, useRef } from "react";
import { generateSlideHTML } from "../../Utils/AppUtils.js";
import { generateHtmlForslide } from "../../Utils/slider.js";

export default function DuplicatePreview(props) {
  const { values, mobile, navigationItems } = props;
  const myDivRef = useRef(null);

  useEffect(() => {
    let modifiedValues = { ...values };
    const desktopElement = generateSlideHTML(modifiedValues, navigationItems, false);
    modifiedValues.htmlLayout = {
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
      <div ref={myDivRef}></div>
    </>
  );
}
