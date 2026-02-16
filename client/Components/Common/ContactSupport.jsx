import React, { useCallback, useContext } from "react";
import { useCustomerly } from "react-live-chat-customerly";
import { Button } from "@shopify/polaris";
import { t } from "i18next";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ProfileContext } from "@/Context/ProfileContext";
import { adminEnvCheck, slackChannelMsg } from "@/Utils/Index";

export default function ContactSupport({ msg, buttonName, buttonProps, showSentry, sentryMessage }) {
  const { profileData } = useContext(ProfileContext);
  const { showNewMessage, open } = useCustomerly();
  const fetch = useAuthenticatedFetch();

  const openSupportChatBox = useCallback(async () => {
    if (showSentry) {
      const message = slackChannelMsg(sentryMessage, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
    }
    if (profileData && !adminEnvCheck(profileData)) msg ? showNewMessage(msg) : open();
  }, [profileData]);

  return (
    <Button onClick={openSupportChatBox} {...buttonProps}>
      {buttonName || t(`common.Contact us`)}
    </Button>
  );
}
