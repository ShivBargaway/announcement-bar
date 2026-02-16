import React, { useEffect } from "react";
import { generateSlideHTML } from "../../../Utils/AppUtils.js";
import { loadSlider, removeAnnouncement } from "../../../Utils/slider.js";

export default function Preview({ values, mobile, navigationItems, selected, animationSetting }) {
  useEffect(() => {
    const announcementBar = document.getElementById("announcement-bar-with-slider");
    if (announcementBar) {
      removeAnnouncement();
    }
    if (values) {
      const modifiedValues = {
        ...values,
        htmlLayout: {
          mobile: generateSlideHTML(values, navigationItems, true),
          desktop: generateSlideHTML(values, navigationItems, false),
        },
      };
      loadSlider(modifiedValues, mobile, selected, animationSetting);
    }
  }, [values, mobile, navigationItems, selected]);
  return <div id="Notifications"></div>;
}
