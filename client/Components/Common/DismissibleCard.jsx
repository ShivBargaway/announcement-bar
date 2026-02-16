import React, { useCallback, useContext, useEffect, useState } from "react";
import { useCustomerly } from "react-live-chat-customerly";
import { ActionList, BlockStack, Button, Card, InlineGrid, Popover } from "@shopify/polaris";
import { MenuHorizontalIcon, NotificationFilledIcon, QuestionCircleIcon, XIcon } from "@shopify/polaris-icons";
import { ProfileContext } from "@/Context/ProfileContext";
import { adminEnvCheck } from "../../Utils/Index";

export default function DismissibleCard({
  cardTitle,
  cardName,
  cardContent,
  skipRemove,
  reminderTime = 3,
  aditionalActions = [],
  gap = 200,
  hideSupport = false,
  hideReminder = false,
  setParentCardStatus,
}) {
  const { updateDismissProperty, dismissProperty, profileData } = useContext(ProfileContext);
  const { sendNewMessage } = useCustomerly();
  const [popoverActive, setPopoverActive] = useState(false);
  const [showCard, setShowCard] = useState(skipRemove ? true : false);

  const handleCardAction = useCallback(
    (dismiss) => {
      if (cardName) {
        const updateValue = {
          ...dismissProperty,
          card: { ...dismissProperty?.card, [cardName]: { lastReminder: new Date(), dismiss } },
        };
        updateDismissProperty(updateValue);
        setShowCard(false);
      }
    },
    [dismissProperty, cardName]
  );

  const openSupportChatBox = useCallback(() => {
    if (profileData && !adminEnvCheck(profileData)) {
      sendNewMessage();
    }
  }, [profileData]);

  useEffect(() => {
    const getItem = dismissProperty?.card?.[cardName];
    const hasDismissCard = getItem?.dismiss;
    const lastReminder = new Date(getItem?.lastReminder);
    lastReminder.setDate(lastReminder.getDate() + reminderTime);
    const isCardVisible = !hasDismissCard && Date.now() > new Date(lastReminder).getTime();
    if (!cardName || !getItem || isCardVisible || skipRemove) {
      setShowCard(true);
      setParentCardStatus && setParentCardStatus(true);
    } else {
      setShowCard(false);
      setParentCardStatus && setParentCardStatus(false);
    }
  }, [cardName, dismissProperty]);

  if (!showCard) return <></>;

  return (
    <Card>
      <BlockStack gap={gap}>
        <InlineGrid columns={cardTitle ? "1fr 0fr" : 1} gap={200}>
          {cardTitle}
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
            preferredAlignment="left"
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
        {cardContent}
      </BlockStack>
    </Card>
  );
}
