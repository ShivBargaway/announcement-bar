import clientProvider from "../../../../utils/clientProvider.js";
import { bulkWrite, find, findOne, findWithFields, updateMany } from "../../model/common.js";
import { logger } from "../../services/logger/index.js";
import { postData } from "../PrivateMetaField.js";

const getAnnouncement = (anncouement, isUserFree) => {
  try {
    const res = anncouement.map((e) => (e.slideEnabled === true ? e : null)).filter(Boolean);
    return isUserFree ? res[0] : res;
  } catch (error) {
    throw error;
  }
};

// const migrateUser = (anncouement, graphqlClient, user) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let result;
//       // if (animation) {
//       //   await postData(graphqlClient.client, user.shopUrl, animation, "animation");
//       // }
//       if (anncouement) {
//         result = getAnnouncement(anncouement, user.recurringPlanType === "Free");
//         await postData(graphqlClient.client, user.shopUrl, result, "anncouement");
//       }
//       resolve("User data updated successfully");
//     } catch (err) {
//       if (
//         err?.response?.code != 401 &&
//         err?.response?.statusText != "Unauthorized" &&
//         err?.response?.code != 404 &&
//         err?.response?.statusText != "Not Found" &&
//         err?.response?.code != 403 &&
//         err?.response?.statusText != "Unavailable Shop" &&
//         err?.response?.code != 402 &&
//         err?.response?.statusText != "Payment Required"
//       ) {
//         logger.identifyUser({ username: user.shopUrl });
//         logger.error("Error in migrateUser cronjob", {
//           extras: err,
//         });
//       }
//       reject(err);
//       return true;
//     }
//   });
// };
// const batchSize = 100;
// // cron job for metafield
// const dataMigration = async (index) => {
//   let startIndex = index;
//   try {
//     logger.error("cron job started .....");
//     // let animations = await find("animation", {});
//     let annoucements = await find("annoucement", {});

//     // const animationsLookup = animations.reduce((acc, animation) => {
//     //   acc[animation.shopUrl] = animation;
//     //   return acc;
//     // }, {});

//     const annoucementsLookup = annoucements.reduce((acc, anncouement) => {
//       if (!acc[anncouement.shopUrl]) {
//         acc[anncouement.shopUrl] = [anncouement];
//       } else {
//         acc[anncouement.shopUrl].push(anncouement);
//       }
//       return acc;
//     }, {});

//     let users = await find("user", {}, { created: -1 });

//     while (startIndex < users.length) {
//       const batch = users.slice(startIndex, startIndex + batchSize);
//       const promises = batch.map(async (user, i) => {
//         console.log("shopUrl :=>", user.shopUrl);
//         console.log("(", startIndex + i + 1, "/", users.length, ")");
//         const graphqlClient = await clientProvider?.offline?.graphqlClient({
//           shop: user.shopUrl,
//         });
//         // let animation = animationsLookup[user.shopUrl];
//         let anncouement = annoucementsLookup[user.shopUrl];
//         return migrateUser(anncouement, graphqlClient, user);
//       });

//       await Promise.all(promises)
//         .then(() => {
//           startIndex += batchSize;
//         })
//         .catch((error) => {
//           startIndex += batchSize;
//         });
//     }

//     logger.error("cron job finish .....");
//   } catch (err) {
//     logger.error("Error in metafield cronjob", {
//       extras: err,
//     });
//   }
// };

const migrateUser = (graphqlClient, shopUrl, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (user) {
        await postData(graphqlClient.client, shopUrl, user, "abUser");
      }
      resolve("User data updated successfully");
    } catch (err) {
      if (
        err?.response?.code != 401 &&
        err?.response?.statusText != "Unauthorized" &&
        err?.response?.code != 404 &&
        err?.response?.statusText != "Not Found" &&
        err?.response?.code != 403 &&
        err?.response?.statusText != "Unavailable Shop" &&
        err?.response?.code != 402 &&
        err?.response?.statusText != "Payment Required"
      ) {
        logger.identifyUser({ username: shopUrl });
        logger.error("Error in migrateUser cronjob", {
          extras: err,
        });
      }
      reject(err);
      return true;
    }
  });
};
const batchSize = 100;
// cron job for metafield
const dataMigration = async (index) => {
  let startIndex = index;
  try {
    const dataBaseValue = {
      collection: "user",
      query: {},
      sort: { created: -1 },
      fields: ["recurringPlanName", "recurringPlanType", "recurringPlanId", "shopUrl"],
    };
    logger.error("cron job started .....");
    const users = await findWithFields(dataBaseValue);
    while (startIndex < users.length) {
      const batch = users.slice(startIndex, startIndex + batchSize);
      const promises = batch.map(async (user, i) => {
        console.log("shopUrl :=>", user.shopUrl);
        console.log("(", startIndex + i + 1, "/", users.length, ")");
        const graphqlClient = await clientProvider?.offline?.graphqlClient({
          shop: user.shopUrl,
        });
        const { recurringPlanName, recurringPlanType, recurringPlanId } = user;
        const data = { recurringPlanName, recurringPlanType, recurringPlanId };
        return migrateUser(graphqlClient, user.shopUrl, data);
      });

      await Promise.all(promises)
        .then(() => {
          startIndex += batchSize;
        })
        .catch((error) => {
          startIndex += batchSize;
        });
    }

    logger.error("cron job finish .....");
  } catch (err) {
    logger.error("Error in metafield cronjob", {
      extras: err,
    });
  }
};

// dataMigration(0);
export { dataMigration };
