import { ApiResponse } from "../../helpers/common.js";
import { findOne, findOneAndUpdate } from "../../model/common.js";

export const postDataForUninstallToInstallApp = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shopUrl, monthlyCode, yearlyCode } = req.body;
    let findDeletedUser = await findOne("deletedUser", { shopUrl });
    if (findDeletedUser) {
      const initialDiscountInfo = { monthlyCode, yearlyCode };
      const emailInfo = { isComeFromEmail: true, emailClickedDate: new Date() };
      await findOneAndUpdate("deletedUser", { shopUrl }, { $set: { initialDiscountInfo, emailInfo } });
    }

    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};
