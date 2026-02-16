import { bulkWrite, count, find, findCronjobData, updateMany } from "../../model/common.js";
import { logger } from "./../../services/logger/index.js";

const toModifyPlanData = async () => {
  try {
    console.log("cron job started .....");

    let updatePlan = [];

    const plans = await find("activePlan", {}); // adjust the find method if needed

    for (let i = 0; i < plans.length; i++) {
      let plan = plans[i];
      console.log("(", i + 1, "/", plans.length, ")");
      if (plan.planName !== "Free" && !plan.billingInterval) {
        updatePlan.push({
          updateOne: {
            filter: { shopUrl: plan.shopUrl },
            update: {
              $set: {
                billingInterval: plan?.intervalLable ? plan?.intervalLable : "Month",
              },
            },
          },
        });
      }
    }
    if (updatePlan.length > 0) {
      await bulkWrite("activePlan", updatePlan);
      console.log("cron job finish .....");
      return updatePlan.length;
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.log(error, "errrrr in cronjob .......");
  }
};

const updateUserTable = async () => {
  try {
    console.log("cron job started .....");
    const users = await find("user", {});
    const updateUsers = [];
    for (const user of users) {
      updateUsers.push({
        updateOne: {
          filter: { shopUrl: user.shopUrl },
          update: {
            $set: {
              appLanguage: user.language,
            },
          },
        },
      });
    }
    if (updateUsers.length > 0) {
      await bulkWrite("user", updateUsers);
      console.log("Updated users with appLanguage .....");
      console.log("cron job finish .....");
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.log(error);
  }
};

const addYearlyPlanStartDate = async () => {
  try {
    console.log("cron job started .....");

    let updatePlan = [];
    let users = await find("user", {});
    const plans = await find("activePlan", {}); // adjust the find method if needed

    const usersLookup = users.reduce((acc, setting) => {
      acc[setting.shopUrl] = setting;
      return acc;
    }, {});

    for (let i = 0; i < plans.length; i++) {
      let plan = plans[i];
      let user = usersLookup[plan.shopUrl];
      console.log("(", i + 1, "/", plans.length, ")");
      if (plan.id != "Free") {
        updatePlan.push({
          updateOne: {
            filter: { shopUrl: plan.shopUrl },
            update: {
              $set: {
                currentYearStartDate:
                  plan?.billingInterval && plan.billingInterval === "Year"
                    ? currentYearStartDate(plan, user)
                    : !plan?.billingInterval && plan.intervalLable === "Year"
                    ? currentYearStartDate(plan, user)
                    : null,
                nextYearStartDate:
                  plan?.billingInterval && plan.billingInterval === "Year"
                    ? nextYearStartDate(plan, user)
                    : !plan?.billingInterval && plan.intervalLable === "Year"
                    ? nextYearStartDate(plan, user)
                    : null,
                currentMonthStartDate:
                  plan?.billingInterval && plan.billingInterval === "Month"
                    ? currentMonthStartDate(plan, user)
                    : !plan?.billingInterval && plan.intervalLable === "Month"
                    ? currentMonthStartDate(plan, user)
                    : null,
                nextMonthStartDate:
                  plan?.billingInterval && plan.billingInterval === "Month"
                    ? nextMonthStartDate(plan, user)
                    : !plan?.billingInterval && plan.intervalLable === "Month"
                    ? nextMonthStartDate(plan, user)
                    : null,
              },
            },
          },
        });
      }
    }
    if (updatePlan.length > 0) {
      await bulkWrite("activePlan", updatePlan);
      console.log("cron job finish .....");
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.log(error, "errrrr in cronjob .......");
  }
};

const currentYearStartDate = (plan, user) => {
  let currentYearStartDate = new Date(plan.activated_on);
  let todayDate = new Date();
  let timeDifference = todayDate - currentYearStartDate;
  let daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysDifference >= 365) {
    let remainingDays = daysDifference % 365;
    currentYearStartDate = new Date(todayDate);
    currentYearStartDate.setDate(todayDate.getDate() - remainingDays);
  }
  if (user?.trial_days) {
    let trialEndDate = new Date(currentYearStartDate);
    trialEndDate.setDate(currentYearStartDate.getDate() + user.trial_days);
    return trialEndDate;
  }
  return currentYearStartDate;
};

const nextYearStartDate = (plan, user) => {
  let currentYearDate = currentYearStartDate(plan, user); // Replace with your desired start date

  return new Date(currentYearDate.getFullYear() + 1, currentYearDate.getMonth(), currentYearDate.getDate());
};

const currentMonthStartDate = (plan, user) => {
  const day = new Date(plan.activated_on).getDate();
  const todayDate = new Date();
  const currentMonthStartDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), day);
  if (currentMonthStartDate > todayDate) {
    currentMonthStartDate.setMonth(currentMonthStartDate.getMonth() - 1);
  }
  if (user?.trial_days) {
    let trialEndDate = new Date(currentMonthStartDate);
    trialEndDate.setDate(currentMonthStartDate.getDate() + user.trial_days);
    return trialEndDate;
  }

  return currentMonthStartDate;
};

const nextMonthStartDate = (plan, user) => {
  let currentMonthDate = currentMonthStartDate(plan, user);
  // Add 1 month
  currentMonthDate.setMonth(currentMonthDate.getMonth() + 1);

  return currentMonthDate;
};

const updateDeleteUserTableField = async () => {
  try {
    console.log("cron job started .....");
    const updateUser = [];

    const users = await find("deletedUser", {});
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      console.log("(", i + 1, "/", users.length, ")");
      if (!user.deleted) {
        updateUser.push({
          updateOne: {
            filter: { shopUrl: user.shopUrl },
            update: {
              $set: {
                deleted: user?.updated ? user.updated : new Date(),
              },
            },
          },
        });
      }
    }

    if (updateUser.length > 0) {
      await bulkWrite("deletedUser", updateUser);
      console.log("cron job finish .....");
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    logger.error(error, {
      extras: { type: "Error in cronjob....." },
    });
    return true;
  }
};

const addMonthlyBillingPrice = async () => {
  try {
    console.log("cron job started .....");

    let updatePlan = [];

    const plans = await find("activePlan", {}); // adjust the find method if needed
    const users = await find("user", {});

    const usersLookup = users.reduce((acc, user) => {
      acc[user.shopUrl] = user;
      return acc;
    }, {});

    for (let i = 0; i < plans.length; i++) {
      let plan = plans[i];
      let user = usersLookup[plan.shopUrl];
      let planPrice;
      console.log("(", i + 1, "/", plans.length, ")");
      if (user && plan.id != "Free") {
        if (
          (plan.billingInterval === "Month" && plan.intervalLable === "Month") ||
          (plan.billingInterval === "Year" && plan.intervalLable === "Year")
        ) {
          planPrice = plan?.originalPrice ? plan.originalPrice : plan.planPrice;
        } else if (plan.billingInterval === "Year" && plan.intervalLable === "Month") {
          if (user.plan_name === "basic") {
            planPrice = 7.99;
          } else {
            planPrice = 11.99;
          }
        }

        updatePlan.push({
          updateOne: {
            filter: { shopUrl: plan.shopUrl },
            update: {
              $set: {
                planPrice: planPrice ? planPrice : plan.planPrice,
              },
            },
          },
        });
      }
    }
    if (updatePlan.length > 0) {
      await bulkWrite("activePlan", updatePlan);
      console.log("cron job finish .....");
      return updatePlan.length;
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.log(error, "errrrr in cronjob .......");
  }
};

const renameUserLanguage = async () => {
  try {
    console.log("cron job started .....");
    const users = await find("user", {});
    const updateUsers = [];
    for (const user of users) {
      updateUsers.push({
        updateOne: {
          filter: { shopUrl: user.shopUrl },
          update: {
            $rename: {
              language: "userLanguage",
            },
          },
        },
      });
    }
    if (updateUsers.length > 0) {
      await bulkWrite("user", updateUsers);
      console.log("Updated users with appLanguage .....");
      console.log("cron job finish .....");
      return updateUsers.length;
    } else {
      console.log("No updates needed.");
    }
  } catch (error) {
    console.log(error);
  }
};

const batchOperation = (batchData) => {
  try {
    const updatedArray = [];
    batchData?.map(async (data, index) => {
      updatedArray.push({
        updateOne: {
          filter: { shopUrl: data?.shopUrl }, // add filter here
          update: { $set: {} }, //add your set object here...
        },
      });
    });
    return updatedArray;
  } catch (error) {
    throw error;
  }
};

const bulkDataUpdateBatchwise = async () => {
  let finalInsertCount = { matchedCount: 0, modifiedCount: 0, insertedCount: 0 };

  try {
    console.log(`cron job started .....`);
    const batch = 5000;
    const query = {}; // add your find query here

    const totalData = await count("metaTags", query);
    console.log(`total data count is..... ${totalData}`);

    for (let j = 0; j < totalData / batch; j++) {
      const batchData = await findCronjobData("metaTags", query, {}, batch);
      const updatedArray = batchOperation(batchData);
      if (updatedArray.length > 0) {
        const updateRes = await bulkWrite("metaTags", updatedArray);
        finalInsertCount.insertedCount += updateRes.insertedCount;
        finalInsertCount.matchedCount += updateRes.matchedCount;
        finalInsertCount.modifiedCount += updateRes.modifiedCount;
      }
    }
    console.log(`cron job Finished ...`, { finalInsertCount });
  } catch (error) {
    console.log(`Error in cronjob..`, { finalInsertCount, error });
    return true;
  }
};

export {
  updateUserTable,
  addYearlyPlanStartDate,
  updateDeleteUserTableField,
  addMonthlyBillingPrice,
  toModifyPlanData,
  renameUserLanguage,
  bulkDataUpdateBatchwise,
};
