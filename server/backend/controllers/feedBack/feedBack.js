import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ApiResponse } from "../../helpers/common.js";
import { sendSlackMessage } from "../../helpers/slack.js";
import { commonFilterQuery, makePaginationQuery } from "../../helpers/utils.js";
import { deleteOne, findOne, findOneAndUpdate, findWithCount, findWithFields } from "../../model/common.js";
import { logger } from "./../../services/logger/index.js";

const s3 = new S3Client({
  endpoint: process.env.VULTR_ENDPOINT,
  region: "us-east-1", // Replace with your endpoint
  credentials: {
    accessKeyId: process.env.VULTR_ACCESSKEY, // Replace with your access key
    secretAccessKey: process.env.VULTR_SECRET_ACCESSKEY, // Replace with your secret key
  },
});

const uploadInVultr = async (data, file, retry = 0) => {
  try {
    const { duration, fileName, type, recordedUrl } = data;
    const params = {
      Bucket: process.env.VULTR_BUCKETNAME,
      Key: `SEO-Feedback-Video/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };
    const command = new PutObjectCommand(params);
    const result = await s3.send(command); // Upload video to S3
    const vultrUrl = `https://ewr1.vultrobjects.com/${process.env.VULTR_BUCKETNAME}/SEO-Feedback-Video/${fileName}`;
    return {
      assetSize: file.size,
      assetType: type,
      vultrUrl,
      ETag: result?.ETag,
      mimetype: file.mimetype,
      duration,
      fileName,
      recordedUrl,
    };
  } catch (error) {
    if (retry < 3) return await uploadInVultr(data, file, retry + 1);
    else throw error;
  }
};

const uploadVideoToServer = async (data, file, shopUrl) => {
  let vultrRes;
  try {
    vultrRes = await uploadInVultr(data, file, 0);
    if (vultrRes) {
      await findOneAndUpdate("feedBack", { shopUrl }, { $push: { feedBack: vultrRes } });
      const message = `\n\n *Video Feedback Completed: Check and Unlock 1 Premium Feature For Them*\n
        *Shop url:* ${shopUrl}\n
        *vultr Url:* ${vultrRes.vultrUrl}\n
        *Recorded Url:* ${vultrRes.recordedUrl}\n
        `;
      sendSlackMessage(message);
    }
  } catch (error) {
    logger.error("Feedback video failed to upload in vultr", {
      extras: { error, shopUrl, data, vultrRes },
    });
  }
};

export const postFeedBack = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shopUrl } = req.query;
    let findUser = await findOne("user", { shopUrl });
    if (shopUrl && findUser) {
      const { additionalData } = req?.body;
      const file = req.file;
      const data = JSON.parse(additionalData);
      uploadVideoToServer(data, file, shopUrl);
      rcResponse.data = true;
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

export const getFeedBack = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shopUrl } = req.query;
    if (shopUrl) rcResponse.data = await findOne("feedBack", { shopUrl });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

export const getAllFeedbackVideo = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { query } = req;
    const { skip, limit } = makePaginationQuery(query);
    const sort = { created: -1 };
    const searchQuery = commonFilterQuery(req.body.advanceFilter);
    rcResponse.data = (await findWithCount("feedBack", {}, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const postFeedbackDescription = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { description, shopUrl } = req.body;
    if (shopUrl) await findOneAndUpdate("feedBack", { shopUrl }, { $set: { description } });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

export const postPromoCode = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { code } = req.body;
    if (code) await findOneAndUpdate("discountCode", { code }, { $set: req.body });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

export const getPromoCodeForTable = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { query } = req;
    const { skip, limit } = makePaginationQuery(query);
    const sort = { created: -1 };
    const searchQuery = commonFilterQuery(req.body.advanceFilter);
    rcResponse.data = (await findWithCount("discountCode", {}, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const getSinglePromoCode = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const fields = ["code", "codeType", "planName", "trialDays", "upgradeManual", "value", "type"];
    const query = { code: { $in: req?.body?.code || [] } };
    rcResponse.data = await findWithFields({ collection: "discountCode", query, fields });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const deleteSinglePromoCode = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { _id } = req.params;
    if (_id) rcResponse.data = await deleteOne("discountCode", { _id });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
