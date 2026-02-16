import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuthenticatedFetch } from "@/Api/Axios";
import { logger } from "@/Services/Logger/Index";
import {
  getLocalStorageItem,
  getSessionStorageItem,
  isAdmin,
  parseJSONData,
  setLocalStorageItem,
  setSessionStorageItem,
  slackChannelMsg,
} from "../Utils/Index";

export const ProfileContext = createContext();

export const ProfileContextProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(undefined);
  const [appStatus, setAppStatus] = useState(undefined);
  const [isProfileLoadding, setIsProfileLoadding] = useState(false);
  const [dismissProperty, setDismissProperty] = useState();
  const [videoLinks, setVideoLinks] = useState(undefined);
  const fetch = useAuthenticatedFetch();
  let location = useLocation();
  const fetchProfileData = async () => {
    try {
      setIsProfileLoadding(true);
      const res = await fetch.get("profile");
      if (res?.data) {
        logger.identifyUser({
          id: res?.data._id,
          email: res?.data.email || "email",
          shopUrl: res?.shopUrl,
        });
        logger.identifyUserScope(res?.data);
      }
      setIsProfileLoadding(false);
      setProfileData(res?.data || undefined);
      let lastLoginArray = res?.data?.lastLoginArray || [];
      const sessionFound = getSessionStorageItem("wsLastLogin");
      const hasPlus2Hours = new Date(sessionFound)?.getTime() + 5 * 60 * 60 * 1000 < new Date()?.getTime();
      const pushLastLogin = (!sessionFound || hasPlus2Hours || lastLoginArray?.length < 1) && !isAdmin();
      if (pushLastLogin) {
        lastLoginArray?.push({ date: Date.now() });
        if (lastLoginArray?.length > 10) {
          lastLoginArray = lastLoginArray?.slice(lastLoginArray?.length - 10, lastLoginArray?.length);
        }
        const updatedData = await fetch.put("/user/update", JSON.stringify({ lastLoginArray }));
        setSessionStorageItem("wsLastLogin", new Date());

        // const compareObj = lastLoginArray?.[lastLoginArray?.length - 2];
        // const lastAssociateUser = updatedData?.data?.lastLoginArray?.at(-1);
        // const isSendNotification =
        //   new Date(compareObj?.date)?.getTime() + 5 * 60 * 60 * 1000 < new Date()?.getTime();

        // if (isSendNotification || lastAssociateUser?.userInfo?.email !== compareObj?.userInfo?.email) {
        // const msgTopic = ":white_check_mark:  [User Login In SEO App]";
        // const message = slackChannelMsg(msgTopic, res?.data);
        // if (message) {
        //   await fetch.post(`/slack-channel-message`, { message, channelType: "userLogin" }, false);
        // }
        // }
      }
    } catch (err) {
      setIsProfileLoadding(false);
      const authErr = err?.response?.status === 403 && err?.response?.data?.message === "Don't Refresh";
      if (!authErr) {
        setProfileData({ error: true });
      }
    }
  };

  const getAppBlockStatus = useCallback(
    async (isSyncButtonClick) => {
      if (location?.pathname === "/" || isSyncButtonClick) {
        const response = await fetch.get("app-block-status");
        if (response?.data?.webrexSeoEmbed) {
          setAppStatus({
            ...(profileData?.privateMetafield && JSON.parse(profileData?.privateMetafield?.value)),
            webrexSeoEmbed: true,
          });
        } else {
          setAppStatus(response.data);
        }
      }
    },
    [location.pathname, profileData]
  );

  const getDismissProperty = useCallback(async () => {
    const response = parseJSONData(getLocalStorageItem("dismissProperty"));
    setDismissProperty(response || {});
  }, []);

  const getAllVideoLink = useCallback(async () => {
    const res = await fetch.get("admin/getAllVideoLink");
    res?.data?.length > 0 && setVideoLinks(res?.data);
  }, []);

  const updateDismissProperty = (e) => {
    setLocalStorageItem("dismissProperty", JSON.stringify(e));
    setDismissProperty(e);
  };

  useEffect(() => {
    if (appStatus?.webrexSeoEmbed) {
      setAppStatus({
        ...(profileData?.privateMetafield && JSON.parse(profileData?.privateMetafield?.value)),
        webrexSeoEmbed: true,
      });
    }
  }, [profileData]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    profileData && !appStatus && getAppBlockStatus();
  }, [profileData, location.pathname, appStatus]);

  useEffect(() => {
    getDismissProperty();
    getAllVideoLink();
  }, []);

  const updateProfileData = (e) => {
    setProfileData(e);
  };

  const updateFeatureStatus = async (e) => {
    const response = await fetch.post("/user/featureStatus", e);
  };

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        isProfileLoadding,
        updateProfileData,
        fetchProfileData,
        getAppBlockStatus,
        appStatus,
        updateFeatureStatus,
        updateDismissProperty,
        dismissProperty,
        videoLinks,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
