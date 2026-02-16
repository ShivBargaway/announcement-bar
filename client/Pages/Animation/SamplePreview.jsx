import React, { useEffect } from "react";
import { t } from "i18next";
import "../../Utils/css/animate.min.css";
import { loadSlider, removeAnnouncement } from "../../Utils/slider.js";

export default function SamplePreview({ slideData, animationformValues }) {
  useEffect(() => {
    const announcementBar = document.getElementById("announcement-bar-with-slider");
    if (announcementBar) {
      removeAnnouncement();
    }

    const updateData = {
      announcements: [],
      ...slideData,
      ...animationformValues,
      slidePosition: "admin",
    };

    loadSlider(updateData);
  }, [animationformValues]);

  const hasAnnouncements = slideData?.annoucements?.length > 0;

  return (
    <div>
      <div className="slides">
        {!hasAnnouncements && (
          <div className="ws-block no-slide-text">
            <p>{t("common.No Preview, Add announcement Bar")}</p>
          </div>
        )}
      </div>
      {hasAnnouncements && (
        <div id="announcement-slider">
          <div id="announcement-bar-with-slider"></div>
        </div>
      )}
    </div>
  );
}
