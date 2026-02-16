import React, { useContext, useEffect } from "react";
import { useCustomerly } from "react-live-chat-customerly";
import { ProfileContext } from "@/Context/ProfileContext";
import { adminEnvCheck } from "@/Utils/Index";

const CustomerlyWrapper = ({ profileData }) => {
  const { load, update } = useCustomerly();

  const setHeightWidth = (msg) => {
    const iframe = document.querySelector(".cly-ms__sc-1w7m24j-0 iframe");
    if (!iframe) return false;

    const innerDoc = iframe?.contentWindow?.document;
    const targetEl = innerDoc?.querySelector(".cly-ms__sc-4dz2cr-1");

    if (!targetEl) return false;

    const { offsetHeight: height, offsetWidth: width } = targetEl;

    if (height >= 0 && width >= 0 && (!msg || height !== 20)) {
      iframe.setAttribute("height", height);
      iframe.setAttribute("width", width);
      return true;
    }
    return false;
  };

  useEffect(() => {
    const converDateToUnixTimestamp = (date) => {
      let convertDate = Math.floor(new Date(date).getTime() / 1000);
      return convertDate;
    };
    const planAttemptTime = profileData?.planAttemptTime
      ? { planattempttime: converDateToUnixTimestamp(profileData?.planAttemptTime) }
      : {};

    const features = profileData.featureStatus;
    let feedback = {};
    if (Array.isArray(profileData?.feedback)) {
      feedback = {
        feature1: profileData?.feedback?.[0]?.id || "",
        feature2: profileData?.feedback?.[1]?.id || "",
        feature3: profileData?.feedback?.[2]?.id || "",
      };
    }
    const initialData = {
      country_code: profileData?.country_code,
      country_name: profileData?.country_name,
      created: converDateToUnixTimestamp(profileData?.created),
      created_at: converDateToUnixTimestamp(profileData?.created_at),
      domain: profileData?.domain,
      lastlogin: converDateToUnixTimestamp(profileData?.lastLogin),
      phone: profileData?.phone || "",
      plan_display_name: profileData?.plan_display_name,
      plan_name: profileData?.plan_name,
      recurringplanid: profileData?.recurringPlanId,
      recurringplanname: profileData?.recurringPlanName,
      recurringplantype: profileData?.recurringPlanType,
      shopid: profileData?.shopUrl?.split(".myshopify.com")[0],
      status: "installed",
      storeid: profileData?.storeId,
      shopurl: profileData?.shopUrl,
      trial_days: profileData?.trial_days,
      trial_start: converDateToUnixTimestamp(profileData?.trial_start),
      uninstall_at: "",
      brokenlinks: features?.brokenLinks,
      brokenlinkautomation: features?.brokenLinkAutomation,
      imageautomation: features?.imageAutomation,
      metatagautomation: features?.metaTagAutomation,
      gsc_connnect: features?.gsc_connnect,
      productenable: features?.product,
      // google_page_speed_enabled: features?.google_page_speed,
      productcount: profileData?.productCount,
      ...planAttemptTime,
      ...feedback,
    };
    load({
      user_id: profileData?._id,
      email: profileData?.associated_user?.email || profileData?.email,
      name: profileData?.storeName,
      singleConversation: true,
      attributes: {
        ...initialData,
      },
    });
    updateCustomerly(profileData, initialData);
  }, [profileData]);

  useEffect(() => {
    const interval = setInterval(() => {
      const isSet = setHeightWidth();
      if (isSet) {
        clearInterval(interval);

        const iframe = document.querySelector(".cly-ms__sc-1w7m24j-0 iframe");
        if (!iframe) return;
        const observer = new MutationObserver(() => {
          setHeightWidth();
        });
        const innerDoc = iframe?.contentWindow?.document;
        const targetEl = innerDoc?.querySelector(".cly-ms__sc-4dz2cr-1");

        if (targetEl) {
          observer.observe(targetEl, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true,
          });
        }
        return () => {
          observer.disconnect();
        };
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateCustomerly = (profileData, initialData) => {
    update({
      email: profileData?.email,
      user_id: profileData?._id,
      name: profileData?.storeName,
      singleConversation: true,
      attributes: {
        ...initialData,
      },
    });
  };

  // useEffect(() => {
  //   load({});
  // }, []);

  return <React.Fragment></React.Fragment>;
};

const CustomerlyUpdate = () => {
  const { profileData, isProfileLoadding } = useContext(ProfileContext);
  useEffect(() => {
    if (isProfileLoadding || !profileData) {
      return;
    }

    if (!profileData || profileData?.error) {
      return;
    }
  }, [profileData, isProfileLoadding]);

  // return <>{profileData && !adminEnvCheck(profileData) && <CustomerlyWrapper profileData={profileData} />}</>;
  return <>{profileData && <CustomerlyWrapper profileData={profileData} />}</>;
};

export default CustomerlyUpdate;
