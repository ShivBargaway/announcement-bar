/*
FileName : common.js
Date : 2nd Aug 2018
Description : This file consist of functions that can be used through the application
*/

/**
 * a function to handle responses as then one we use in middleware is not flexible enough
 * @param {object} respObj
 * @param {Int} code
 * @param {String} message
 * @param {Boolean} success
 * @param {Object} data
 */
const SetResponse = (respObj, code = 200, message = "OK", success = true, data = {}) => {
  respObj.code = code;
  respObj.success = success;
  respObj.message = message;
  respObj.data = data;
  return respObj;
};

const SetError = (errObj, code = 500, message = "ISE", type = "custom") => {
  errObj.code = code;
  errObj.message = message;
  errObj.type = type;
  return errObj;
};

/**
 * UserRoles
 * returns the assigned numbers according to user's roles
 * @returns {number} number assigned to user role
 */
function UserRoles() {
  this.admin = 1;
  this.owner = 2;
}

const Plans = {
  basic: {
    minProduct: 0,
    maxProduct: 500,
  },
};

/**
 * ApiResponse
 * constructs response object
 * @returns {object} response object
 */
function ApiResponse() {
  this.success = true;
  this.message = "OK";
  this.code = 200;
  this.data = {};
}

export { SetResponse, UserRoles, ApiResponse, SetError, Plans };
