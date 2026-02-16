import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BlockStack, Icon, InlineStack, Link, Text } from "@shopify/polaris";
import { LayoutBlockIcon, PlayCircleIcon, QuestionCircleIcon, XIcon } from "@shopify/polaris-icons";
import { CommonIcon } from "./CommonIcon";

const VideoPopup = ({ linkData, buttonName }) => {
  const [isModalOpen, setIsModalOpen] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  let location = useLocation();

  const closeModal = () => {
    setIsFullScreen(false);
    setIsModalOpen({});
  };

  useEffect(() => {
    let lastScrollY = window.scrollY; // Track the last scroll position

    const updateModalPosition = () => {
      const button = document.getElementById(`${buttonName}videoLink`);
      if (button) {
        const rect = button.getBoundingClientRect();

        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        const newTop = rect.top - scrollDelta;
        setModalPosition((prev) => ({
          top: newTop,
          left: prev?.left || rect.left + 35 + window.scrollX, // Keep left fixed
        }));
        lastScrollY = currentScrollY;
      }
    };

    updateModalPosition();
    window.addEventListener("scroll", updateModalPosition);
    return () => {
      window.removeEventListener("scroll", updateModalPosition);
    };
  }, [buttonName]);

  const handleClickOutside = useCallback(() => {
    setIsModalOpen({ [`${buttonName}videoLink`]: !isModalOpen[`${buttonName}videoLink`] });
    const modalElements = document.getElementsByClassName("modal-overlay");
    Array.from(modalElements).forEach((element) => {
      if (element.id && element.id !== buttonName) element.style.display = "none";
    });
  }, [isModalOpen]);

  useEffect(() => closeModal(), [location, buttonName]);

  if (!linkData) return;

  return (
    <div className="VideoPopup">
      {!linkData?.link && linkData?.articleLink ? (
        linkData?.designType === "withoutButton" ? (
          <div onClick={() => window.open(linkData?.articleLink, "_blank")} id={`${buttonName}videoLink`}>
            <Icon source={QuestionCircleIcon} tone="info" />
          </div>
        ) : (
          <Link id={`${buttonName}videoLink`} url={linkData?.articleLink} target="_blank">
            <CommonIcon data={{ icon: QuestionCircleIcon, color: "info" }} size="25" />
          </Link>
        )
      ) : (
        linkData?.link &&
        (linkData?.designType === "withoutButton" ? (
          <div onClick={handleClickOutside} id={`${buttonName}videoLink`}>
            <Icon source={PlayCircleIcon} tone="info" />
          </div>
        ) : (
          <Link id={`${buttonName}videoLink`} onClick={handleClickOutside}>
            <CommonIcon data={{ icon: PlayCircleIcon, color: "info" }} size="25" />
          </Link>
        ))
      )}
      {isModalOpen[`${buttonName}videoLink`] && (
        <div
          className={`modal-overlay ${isFullScreen ? "fullscreen" : ""}`}
          onClick={closeModal}
          id={buttonName}
          style={
            isFullScreen
              ? { top: 0, right: 0, left: 0, bottom: 0 }
              : { top: `${modalPosition.top}px`, left: `${modalPosition.left}px` }
          }
        >
          <div
            className={`modal-content ${isFullScreen ? "fullscreen" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <InlineStack align="end">
              <div onClick={() => setIsFullScreen(!isFullScreen)}>
                <Icon source={LayoutBlockIcon} tone="subdued" />
              </div>
              <div onClick={closeModal}>
                <Icon source={XIcon} tone="subdued" />
              </div>
            </InlineStack>
            <iframe
              src={linkData?.link}
              title="Loom Video"
              frameBorder="0"
              style={{
                height: isFullScreen ? "100%" : "",
                width: isFullScreen ? "100%" : "",
                display: "inline-block",
                verticalAlign: "middle",
                marginTop: "5px",
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
            {!isFullScreen && (linkData?.videoTitle || linkData?.videoDescription || linkData?.articleLink) && (
              <div className="video-title" style={{ maxWidth: isFullScreen ? "100%" : "300px" }}>
                <BlockStack gap={100}>
                  <Text />
                  <Text />

                  {linkData?.videoTitle && (
                    <Text tone="text-inverse" fontWeight="semibold" variant="headingLg">
                      {linkData?.videoTitle}
                    </Text>
                  )}
                  {linkData?.videoDescription && (
                    <Text tone="text-inverse-secondary" fontWeight="regular" variant="bodyMd">
                      {linkData?.videoDescription}
                    </Text>
                  )}
                  {linkData?.articleLink && (
                    <Link url={linkData?.articleLink} target="_blank">
                      <Text fontWeight="regular" variant="bodyMd">
                        Read more
                      </Text>
                    </Link>
                  )}
                </BlockStack>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPopup;
