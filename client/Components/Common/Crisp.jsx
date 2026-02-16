import React, { useContext, useEffect } from "react";
import { Crisp } from "crisp-sdk-web";
import { ProfileContext } from "@/Context/ProfileContext";

const CrispChat = () => {
  // TODO: Need to add user information and need to check website id
  // TODO: moving this to service
  const { profileData, isProfileLoadding } = useContext(ProfileContext);

  useEffect(() => {
    if (isProfileLoadding || !profileData) {
      return;
    }

    if (!profileData || profileData?.error) {
      Crisp.configure(process.env.CRISP_WEBSITE_ID);
      return;
    }

    const initialData = {
      shopUrl: profileData.shopUrl,
      plan: profileData.recurringPlanName,
      recurringPlanType: profileData.recurringPlanType,
      country_name: profileData.country_name,
      password_enabled: profileData.password_enabled,
      phone: profileData.phone,
      shopify_plan_name: profileData.plan_name,
      shop_owner: profileData.shop_owner,
      storeName: profileData.storeName,
    };

    const filtereData = Object.keys(initialData).reduce((result, key) => {
      if (initialData[key] !== null && initialData[key] !== undefined) {
        result[key] = initialData[key];
      }
      return result;
    }, {});

    Crisp.configure(process.env.CRISP_WEBSITE_ID);
    process.env.HIDE_CRISP_LOGO && Crisp.chat.hide(); // hide chatBox
    profileData?.email && Crisp.user.setEmail(profileData.email);
    profileData.phone?.length > 0 && Crisp.user.setPhone(profileData.phone?.replace(/\D/g, ""));
    profileData?.storeName && Crisp.user.setNickname(profileData.storeName);

    let planSegmentText = profileData.recurringPlanType.toLowerCase() == "paid" ? "New_Paid" : "New_Free";
    Crisp.session.setSegments([planSegmentText, profileData.plan_display_name, profileData.country_name], true);

    const date = new Date(profileData.created);
    Crisp.session.setData({
      ...filtereData,
      createdOn: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    });
  }, [profileData, isProfileLoadding]);

  return <React.Fragment></React.Fragment>;
};

export default CrispChat;
