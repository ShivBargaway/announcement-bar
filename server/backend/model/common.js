// module.exports.brokenLinks = require('../schema/brokenLinks');
import mongoose from "mongoose";
import activePlan from "../schema/activePlan.js";
import animation from "../schema/animation.js";
import annoucement from "../schema/annoucement.js";
import contact from "../schema/contacts.js";
import deletedUser from "../schema/deletedUser.js";
import discountCode from "../schema/discountcode.js";
import preview from "../schema/preview.js";
import user from "../schema/users.js";
import admin from "./../schema/admin.js";
import allVideoLink from "./../schema/allVideoLink.js";
import dismissProperty from "./../schema/dismissProperty.js";
import feedBack from "./../schema/feedBack.js";
import onboarding from "./../schema/onboarding.js";
import webVital from "./../schema/webVital.js";

const models = {
  user,
  deletedUser,
  activePlan,
  admin,
  annoucement,
  animation,
  onboarding,
  contact,
  preview,
  webVital,
  dismissProperty,
  allVideoLink,
  feedBack,
  discountCode,
};

const findOne = async (collection, query, property, sort) => {
  try {
    return await models[collection].findOne(query, property).sort(sort).lean().exec();
  } catch (err) {
    throw err;
  }
};

const create = async (collection, data) => {
  try {
    return await new models[collection](data).save();
  } catch (err) {
    throw err;
  }
};

const find = async (collection, query, sort, limit, skip) => {
  try {
    return await models[collection].find(query).sort(sort).limit(limit).skip(skip);
  } catch (err) {
    throw err;
  }
};
const distinct = async (collection, field, query = {}) => {
  try {
    return await models[collection].distinct(field, query);
  } catch (err) {
    throw err;
  }
};

const findWithFields = async (obj) => {
  try {
    const { collection, query, sort, limit, skip, fields } = obj;
    return await models[collection].find(query).sort(sort).limit(limit).skip(skip).select(fields).lean();
  } catch (err) {
    throw err;
  }
};

const findOneAndUpdate = async (collection, query, data, fields) => {
  try {
    return await models[collection]
      .findOneAndUpdate(query, data, {
        fields,
        setDefaultsOnInsert: true,
        new: true,
        upsert: true,
      })
      .lean()
      .exec();
  } catch (err) {
    throw err;
  }
};

const findWithCount = async (collection, userQuery, query, skip, limit, sort) => {
  try {
    return await models[collection].aggregate(
      [
        {
          $match: {
            $and: [{ ...userQuery, ...query }],
          },
        },
        { $sort: sort },
        {
          $facet: {
            products: [{ $skip: skip }, { $limit: limit }],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $project: {
            rows: "$products",
            count: { $arrayElemAt: ["$count.count", 0] },
          },
        },
      ],
      { allowDiskUse: true }
    );
  } catch (err) {
    throw err;
  }
};

const findWithinFields = async (collection, userQuery, query, skip, limit, sort, unwind) => {
  try {
    return await models[collection].aggregate(
      [
        {
          $match: {
            $and: [{ ...userQuery }],
          },
        },
        { $unwind: unwind },
        { $match: { ...query } },
        { $sort: sort },
        {
          $facet: {
            products: [{ $skip: skip }, { $limit: limit }],
            count: [
              {
                $count: "count",
              },
            ],
          },
        },
        {
          $project: {
            rows: "$products",
            count: { $arrayElemAt: ["$count.count", 0] },
          },
        },
      ],
      { allowDiskUse: true }
    );
  } catch (err) {
    throw err;
  }
};

const deleteMany = async (collection, query) => {
  try {
    return await models[collection].deleteMany(query);
  } catch (err) {
    throw err;
  }
};

const deleteOne = async (collection, query) => {
  try {
    return await models[collection].deleteOne(query).lean().exec();
  } catch (err) {
    throw err;
  }
};

const bulkWrite = async (collection, data) => {
  try {
    return await models[collection].bulkWrite(data);
  } catch (err) {
    throw err;
  }
};

const update = async (collection, query, data) => {
  try {
    return await models[collection].update(query, data, { multi: true }).lean().exec();
  } catch (err) {
    throw err;
  }
};

const count = async (collection, query) => {
  try {
    return await models[collection].find(query).count();
  } catch (err) {
    throw err;
  }
};

const insertMany = async (collection, data) => {
  try {
    return await models[collection].insertMany(data);
  } catch (err) {
    throw err;
  }
};

const updateMany = async (collection, filter, update) => {
  try {
    return await models[collection].updateMany(filter, update);
  } catch (err) {
    throw err;
  }
};

const findCronjobData = async (collection, query, sort, limit, skip) => {
  try {
    return await models[collection].find(query).sort(sort).limit(limit).skip(skip).lean();
  } catch (err) {
    throw err;
  }
};

// Function to get all collection names
const getAllCollectionNames = () => {
  const connection = mongoose.connection;
  const collections = connection.collections;
  return Object.keys(collections);
};

const getDirectDataFromDb = async ({
  collectionName,
  query = {},
  limit,
  skip = 0,
  fields = {},
  searchType,
  distinctField,
  sort = {},
}) => {
  try {
    let documents = [];
    if (mongoose.connection.readyState) {
      const collection = mongoose.connection.db.collection(collectionName);

      if (searchType === "find") {
        const cursor = collection.find(query).sort(sort).skip(parseInt(skip)).project(fields);
        if (limit && !isNaN(limit)) cursor.limit(parseInt(limit));
        documents = await cursor.toArray();
      } else if (searchType === "count") {
        documents = await collection.countDocuments(query);
      } else if (searchType === "distinct") {
        documents = await collection.distinct(distinctField, query);
      }
    }
    return documents;
  } catch (error) {
    throw error;
  }
};

export {
  findOne,
  create,
  find,
  findWithFields,
  findWithinFields,
  findOneAndUpdate,
  findWithCount,
  deleteMany,
  deleteOne,
  bulkWrite,
  update,
  updateMany,
  count,
  distinct,
  insertMany,
  findCronjobData,
  getAllCollectionNames,
  getDirectDataFromDb,
};
