import animation from "../schema/animation.js";

const findAllSlide = async (collection, query) => {
  try {
    return await animation.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "annoucements",
          let: { animationId: { $toObjectId: "$_id" } },
          pipeline: [
            { $match: { $expr: { $eq: ["$animationId", "$$animationId"] } } },
            {
              $sort: { index: 1 },
            },
          ],
          as: "annoucements",
        },
      },
    ]);
  } catch (err) {
    throw err;
  }
};

const findWithSlide = async (query, type) => {
  try {
    return await animation.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "annoucements",
          let: { userObjId: { $toObjectId: "$_id" } },
          pipeline: [
            type == "Free"
              ? {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$animationId", "$$userObjId"] }, { $eq: ["$slideEnabled", true] }],
                    },
                  },
                }
              : {
                  $match: {
                    $expr: {
                      $and: [{ $eq: ["$animationId", "$$userObjId"] }, { $eq: ["$slideEnabled", true] }],
                    },
                  },
                },
            {
              $sort: { index: 1 },
            },
          ],
          as: "annoucements",
        },
      },
      {
        $addFields: {
          annoucements:
            type == "Free"
              ? {
                  $cond: [
                    { $eq: [{ $size: "$annoucements" }, 0] },
                    { $literal: [] },
                    [{ $arrayElemAt: ["$annoucements", 0] }],
                  ],
                }
              : "$annoucements",
        },
      },
    ]);
  } catch (err) {
    throw err;
  }
};

export { findAllSlide, findWithSlide };
