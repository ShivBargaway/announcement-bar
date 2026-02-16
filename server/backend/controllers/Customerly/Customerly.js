// Cron job for customarly
import request from "request-promise";
import { logger } from "./../../services/logger/index.js";

const converDateToUnixTimestamp = (date) => {
  let convertDate = Math.floor(new Date(date).getTime() / 1000);
  return convertDate;
};

const syncCustomerlyData = async (users) => {
  try {
    let field = {
      users: users,
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
    request(options, function (error, response) {
      if (error) throw new Error(error);
      const res = JSON.parse(response?.body);
      if (res?.data.not_added?.length > 0) {
        logger.error("Review cron error : custormerly update error ", {
          extras: {
            not_added: res?.data.not_added,
          },
        });
      }
    });
  } catch (err) {
    logger.error(err, { extras: { users: users } });
    return true;
  }
};
async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}
const batchSize = 50;

const customerlyCronJob = async (index, allUsers) => {
  let startIndex = index;
  try {
    //uncomment this before push to github
    if (process.env.CUSTOMERLY_ACCESS_TOKEN && process.env.ENV !== "dev") {
      // if (process.env.CUSTOMERLY_ACCESS_TOKEN) {

      const users = allUsers.map((user) => ({
        email: user?.email,
        user_id: user._id,
        name: user?.shopUrl,
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
          status: "installed",
          storeid: user?.storeId,
          storename: user?.storeName,
          trial_days: user?.trial_days,
          trial_start: converDateToUnixTimestamp(user?.trial_start),
          uninstall_at: "",
          is_review_posted: true,
        },
      }));

      while (startIndex < users.length) {
        const batchEnd = startIndex + batchSize > users.length ? users.length : startIndex + batchSize;
        const batch = users.slice(startIndex, batchEnd);
        await syncCustomerlyData(batch);
        await sleep(5000);

        startIndex += batchSize;
      }
    }
    return true;
  } catch (err) {
    startIndex += batchSize;
    customerlyCronJob(startIndex, allUsers);
  }
};

// customerlyCronJob(0, []);

export { customerlyCronJob };
