import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, ButtonGroup } from "@shopify/polaris";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { ProfileContext } from "@/Context/ProfileContext";
import { slackChannelMsg } from "@/Utils/Index";

export default function Meeting(props) {
  const { page, button } = props;
  const { profileData } = useContext(ProfileContext);
  const fetch = useAuthenticatedFetch();

  const loadInitialMeeting = useCallback(async () => {
    const module = await import("@appointlet/appointlet.js");
    const Appointlet = module.default || module; // Check if default export is needed
    const first_name = profileData?.storeName || "";
    const email = profileData?.email || "";
    const appointlet = new Appointlet(`${page}?first_name=${first_name}&email=${email}&last_name=%20`);
    if (document?.getElementById("place-to-put-the-scheduling-page")) {
      appointlet.inlineEmbed(document?.getElementById("place-to-put-the-scheduling-page"));
    }
  }, [profileData]);

  useEffect(() => {
    if (!button) loadInitialMeeting();
  }, [profileData]);

  const openMeeting = useCallback(async () => {
    if (props?.showSentry) {
      const title = props?.pageName
        ? `Schedule Meeting Button Click from ${props?.pageName}`
        : `Schedule Meeting Button Click`;

      const message = slackChannelMsg(title, profileData);
      if (message) await fetch.post(`/slack-channel-message`, { message }, false);
    }
    const module = await import("@appointlet/appointlet.js");
    const Appointlet = module.default || module; // Check if default export is needed
    const first_name = profileData?.storeName || "";
    const email = profileData?.email || "";
    const appointlet = new Appointlet(`${page}?first_name=${first_name}&email=${email}&last_name=%20`);
    appointlet.openModal();
  }, [page, profileData]);

  if (button) {
    return (
      <Button onClick={openMeeting} {...props}>
        {button}
      </Button>
    );
  }

  return <div id="place-to-put-the-scheduling-page"></div>;
}
