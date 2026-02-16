import readlineSync from "readline-sync";
import { closeLiveConnection } from "../../../config/dbConnection.js";
import { ApiResponse } from "../../helpers/common.js";
import { crawlData } from "../Reviews/Reviews.js";

// import { updateDeleteUserTableField } from "./devCronCtrl.js";
import { dataMigration } from "./devAppCronCtrl.js";

const runLiveCrojJob = async (req, res) => {
  let rcResponse = new ApiResponse();

  try {
    const conform = readlineSync.question("Are You sure want to run cron job (yes/no)? ");
    if (conform === "yes") {
      // rcResponse.data = await dataMigration(0);
      // rcResponse.data = await updateAnimationToAnnouncements();
    }

    closeLiveConnection();
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    console.log("error is ----", error);
  }
};

export { runLiveCrojJob };
