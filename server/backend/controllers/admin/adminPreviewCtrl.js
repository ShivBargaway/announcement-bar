import { ApiResponse } from "../../helpers/common.js";
import { commonFilterQuery, makePaginationQuery } from "../../helpers/utils.js";
import { create, deleteOne, find, findOne, findWithCount } from "../../model/common.js";

const getPreview = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { query, body } = req;
    const sort = { created: -1 };
    const { skip, limit } = makePaginationQuery(query);
    const searchQuery = commonFilterQuery(body.advanceFilter);
    rcResponse.data = (await findWithCount("preview", {}, searchQuery, skip, limit, sort))[0];
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getAnnouncementsPreview = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    rcResponse.data = await find("preview", {});
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getPreviewAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  const { params } = req;
  try {
    let result = await find("preview", { _id: params.id }, { created: 1 }, { _id: 0 });
    if (result[0]) {
      rcResponse.data = result[0];
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};
const duplicateSlide = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body } = req;
  try {
    let copy = [];
    copy = body;
    rcResponse.data = await create("preview", copy);
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const deleteAdminAnnoucement = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { params } = req;

  try {
    rcResponse.data = await deleteOne("preview", {
      _id: params.id,
    });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export { getPreview, getAnnouncementsPreview, getPreviewAnnoucement, duplicateSlide, deleteAdminAnnoucement };
