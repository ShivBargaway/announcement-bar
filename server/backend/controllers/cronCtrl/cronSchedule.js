import cron from "node-cron";
import { logger } from "../../services/logger/index.js";
import { crawlData } from "../Reviews/Reviews.js";
import { createBackup } from "../backup/backupCtrl.js";
import { recurringPlanCronJob } from "../pricing/pricingCtrl.js";

const runCronJob = async (fn, type) => {
  const startTime = new Date().getTime();
  try {
    const response = await fn;
    const endTime = new Date().getTime();
    const timeTaken = endTime - startTime;
    logger.error(`Cron job ${type} took ${timeTaken}ms to run`, { extras: { response } });
  } catch (error) {
    const endTime = new Date().getTime();
    const timeTaken = endTime - startTime;
    logger.error(`Error in ${type} Cron job, took ${timeTaken}ms to run`, { extras: { error } });
    return true;
  }
};

// if (process.env.ENV === "prod") {
//   cron.schedule(
//     "0 10 * * 1-5",
//     () => {
//       runCronJob( (), "createBackup");
//     },
//     { scheduled: true, timezone: "Asia/Kolkata" }
//   );
// }

cron.schedule(
  "0 12 * * *",
  () => {
    runCronJob(crawlData(), "crawlData");
  },
  {
    scheduled: true,
    timezone: "Asia/Kolkata",
  }
);

cron.schedule(
  "0 15 * * *",
  () => {
    runCronJob(recurringPlanCronJob(), "recurringPlanCronJob");
  },
  { scheduled: true, timezone: "Asia/Kolkata" }
);
