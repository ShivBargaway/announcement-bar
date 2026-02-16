import request from "request-promise";
import { adminEnvCheck, sleep } from "../../helpers/utils.js";
import { logger } from "../../services/logger/index.js";

const converDateToUnixTimestamp = (date) => {
  let convertDate = Math.floor(new Date(date).getTime() / 1000);
  return convertDate;
};

const updateInCustomerly = async (user) => {
  try {
    let field = {
      users: [
        {
          email: user?.associated_user?.email || user?.email,
          user_id: user._id,
          name: user?.storeName,
          attributes: {
            country_code: user?.country_code,
            country_name: user?.country_name,
            created: converDateToUnixTimestamp(user?.created),
            created_at: converDateToUnixTimestamp(user?.created_at),
            domain: user?.domain,
            lastlogin: converDateToUnixTimestamp(user?.lastLogin),
            phone: user?.phone || "",
            plan_display_name: user?.plan_display_name,
            plan_name: user?.plan_name,
            recurringplanid: user?.recurringPlanId,
            recurringplanname: user?.recurringPlanName,
            recurringplantype: user?.recurringPlanType,
            shopid: user?.shopUrl.split(".myshopify.com")[0],
            status: user?.uninstalled === true ? "uninstalled" : "installed",
            storeid: user?.storeId,
            storename: user?.storeName,
            shopurl: user?.shopUrl,
            trial_days: user?.trial_days,
            trial_start: converDateToUnixTimestamp(user?.trial_start),
            uninstall_at: user?.uninstalled_at ? converDateToUnixTimestamp(user?.uninstalled_at) : "",
          },
        },
      ],
    };

    var options = {
      method: "POST",
      url: "https://api.customerly.io/v1/users",
      headers: {
        Authorization: `Bearer ${process.env.CUSTOMERLY_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(field),
    };
    await request(options);
  } catch (err) {
    logger.error("Error in update customerly function in backend", { extras: err });
  }
};

export const thirdPartyIntegration = (user) => {
  try {
    if (!adminEnvCheck(user) && process.env.CUSTOMERLY_ACCESS_TOKEN) updateInCustomerly(user);
    return true;
  } catch (error) {
    return true;
  }
};

export const deleteUserInCustomerly = async (userEmail) => {
  try {
    if (userEmail && !adminEnvCheck({ email: userEmail }) && process.env.CUSTOMERLY_ACCESS_TOKEN) {
      var options = {
        method: "DELETE",
        url: `https://api.customerly.io/v1/users?email=${userEmail}`,
        headers: {
          Authorization: `Bearer ${process.env.CUSTOMERLY_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      };
      return await request(options);
    }
  } catch (error) {
    logger.error("Error in Delete User in customerly", { extras: error });
    return true;
  }
};

export const createCustomerlyMsg = async (msgContent, userEmail) => {
  try {
    await sleep(5000);

    const body = {
      from: { type: "admin", id: "41657" },
      to: { type: "user", email: userEmail },
      content: msgContent,
    };

    var options = {
      method: "POST",
      url: "https://api.customerly.io/v1/messages",
      headers: {
        Authorization: `Bearer ${process.env.CUSTOMERLY_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    };

    await request(options, function (error, response) {
      if (error) throw new Error(error);
    });
  } catch (error) {
    logger.error("Error in customerly automation", { extras: error, userEmail, msgContent });
    return true;
  }
};
