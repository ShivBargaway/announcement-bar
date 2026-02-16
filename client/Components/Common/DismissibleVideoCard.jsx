import React, { useCallback, useContext, useEffect, useState } from "react";
import { useCustomerly } from "react-live-chat-customerly";
import {
  ActionList,
  BlockStack,
  Button,
  Card,
  InlineGrid,
  Modal,
  Popover,
  Text,
  VideoThumbnail,
} from "@shopify/polaris";
import { MenuHorizontalIcon, NotificationFilledIcon, QuestionCircleIcon, XIcon } from "@shopify/polaris-icons";
import { ProfileContext } from "@/Context/ProfileContext";
import { adminEnvCheck } from "@/Utils/Index";

export default function DismissibleVideoCard({
  skipRemove,
  reminderTime = 3,
  aditionalActions = [],
  instruction,
  videoCardName,
  hideSupport = false,
  hideReminder = false,
}) {
  const { thumbnailHeight, thumbnailWidth, video, title, description, time } = instruction || {};
  const { updateDismissProperty, dismissProperty, profileData } = useContext(ProfileContext);
  const { sendNewMessage } = useCustomerly();
  const [popoverActive, setPopoverActive] = useState(false);
  const [showCard, setShowCard] = useState(skipRemove ? true : false);
  const [videoModal, setVideoModal] = useState(false);
  const [videoModalTitle, setVideoModalTitle] = useState("");
  const [videoModalLink, setVideoModalLink] = useState("");

  const handleCardAction = useCallback(
    (dismiss) => {
      if (videoCardName) {
        const updateValue = {
          ...dismissProperty,
          videoCard: { ...dismissProperty?.videoCard, [videoCardName]: { lastReminder: new Date(), dismiss } },
        };
        updateDismissProperty(updateValue);
        setShowCard(false);
      }
    },
    [videoCardName, dismissProperty]
  );

  useEffect(() => {
    const getItem = dismissProperty?.videoCard?.[videoCardName];
    const hasDismissCard = getItem?.dismiss;
    const lastReminder = new Date(getItem?.lastReminder);
    lastReminder.setDate(lastReminder.getDate() + reminderTime);
    const isCardVisible = !hasDismissCard && Date.now() > new Date(lastReminder).getTime();
    if (!videoCardName || !getItem || isCardVisible || skipRemove) setShowCard(true);
    else setShowCard(false);
  }, [videoCardName, dismissProperty]);

  const openSupportChatBox = useCallback(() => {
    if (profileData && !adminEnvCheck(profileData)) {
      sendNewMessage();
    }
  }, [profileData]);

  useEffect(() => {
    setPopoverActive(false);
  }, [videoCardName]);

  if (!showCard) return <></>;

  return (
    <Card padding={0}>
      <InlineGrid columns={{ xs: "0fr 2fr" }}>
        <div style={{ width: thumbnailWidth || "180px", height: thumbnailHeight || "110px" }}>
          <VideoThumbnail
            videoLength={60 * (time || 1)}
            thumbnailUrl={video.thumbnail}
            onClick={() => {
              if (video?.link?.length > 0) {
                setVideoModalLink(video.link);
                setVideoModal(true);
                setVideoModalTitle(title);
              }
            }}
          />
          <style dangerouslySetInnerHTML={{ __html: `.Polaris-VideoThumbnail__Timestamp{ margin: 5px}` }} />
        </div>
        <div style={{ padding: "17px" }}>
          <InlineGrid columns={{ xs: "1fr 0fr" }} gap={200}>
            <BlockStack gap={200}>
              <Text fontWeight="bold" variant="headingMd">
                {title}
              </Text>
              <Text as="p">{description}</Text>
            </BlockStack>
            <Popover
              active={popoverActive}
              activator={
                skipRemove ? (
                  <></>
                ) : (
                  <Button
                    icon={MenuHorizontalIcon}
                    variant="tertiary"
                    onClick={() => setPopoverActive(!popoverActive)}
                  />
                )
              }
              autofocusTarget="first-node"
              onClose={() => setPopoverActive(false)}
            >
              <Popover.Pane>
                <ActionList
                  actionRole="menuitem"
                  items={[
                    {
                      content: "Dismiss",
                      destructive: true,
                      icon: XIcon,
                      onAction: () => handleCardAction(true),
                    },
                    !hideReminder && {
                      content: "Remind me later",
                      icon: NotificationFilledIcon,
                      onAction: () => handleCardAction(false),
                    },
                    !hideSupport && {
                      content: "Contact Our Support",
                      icon: QuestionCircleIcon,
                      onAction: openSupportChatBox,
                    },
                    ...aditionalActions,
                  ]}
                />
              </Popover.Pane>
            </Popover>
          </InlineGrid>
        </div>
      </InlineGrid>
      <Modal
        title={videoModalTitle}
        open={videoModal}
        size="large"
        onClose={() => {
          setVideoModal(false);
          setVideoModalLink("");
        }}
      >
        <Modal.Section>
          <iframe
            src={videoModalLink}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            autoPlay="1"
            style={{ height: "540px", width: "100%", display: "inline-block", verticalAlign: "middle" }}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </Modal.Section>
      </Modal>
    </Card>
  );
}
