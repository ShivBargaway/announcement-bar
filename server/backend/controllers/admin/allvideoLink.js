import { ApiResponse } from "../../helpers/common.js";
import { commonFilterQuery, makePaginationQuery } from "../../helpers/utils.js";
import { create, deleteOne, findOneAndUpdate, findWithCount, findWithFields } from "../../model/common.js";

export const getAllVideoLinkForTable = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { query } = req;
    const { skip, limit } = makePaginationQuery(query);
    const sort = { created: -1 };
    const searchQuery = commonFilterQuery(req.body.advanceFilter);
    rcResponse.data = (await findWithCount("allVideoLink", {}, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const getAllVideoLink = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    rcResponse.data = await findWithFields({
      collection: "allVideoLink",
      query: {},
      fields: ["selector", "linkValue"],
    });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const postSingleVideoLink = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { _id } = req.body;
    if (_id) rcResponse.data = await findOneAndUpdate("allVideoLink", { _id: _id }, req.body);
    else rcResponse.data = await create("allVideoLink", req.body);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export const deleteSingleVideoLink = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { _id } = req.params;
    if (_id) rcResponse.data = await deleteOne("allVideoLink", { _id });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
