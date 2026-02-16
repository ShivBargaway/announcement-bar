import {
  createAppMetafieldsQuery,
  currentAppQuery,
  deleteAppMetafieldsQuery,
  getAppMetafieldsQuery,
} from "../graphql/metaFieldQuery.js";
import { findOneAndUpdate } from "./../model/common.js";

const postData = async (graphqlClient, shop, body, key) => {
  try {
    await postPrivateMetaFields(
      shop,
      graphqlClient,
      {
        namespace: "app_status",
        key: key,
        type: "json_string",
        value: JSON.stringify(body),
      },
      key
    );
  } catch (err) {
    throw err;
  }
};

const postPrivateMetaFields = async (shop, graphqlClient, fields, key) => {
  try {
    const response = await graphqlClient.query({
      data: {
        query: currentAppQuery,
      },
    });

    const appId = response?.body?.data?.currentAppInstallation?.id;

    if (appId) {
      fields["ownerId"] = appId;
      const createMetafield = await graphqlClient.query({
        data: {
          query: createAppMetafieldsQuery,
          variables: {
            metafieldsSetInput: [fields],
          },
        },
      });

      if (createMetafield.body.data.metafieldsSet) {
        let privateMetafield = {
          [`${key}Metafield`]: createMetafield.body.data.metafieldsSet.metafields[0],
        };

        const updatedUser = await findOneAndUpdate("user", { shopUrl: shop }, privateMetafield, {
          accessToken: 0,
        });
        if (updatedUser) {
          return updatedUser;
        } else {
          return createMetafield?.body?.data?.metafieldsSet || { message: "No data found", status: false };
        }
      }
    } else {
      return { message: "App not installed", status: false };
    }
  } catch (err) {
    throw err;
  }
};

const getMetafield = async (graphqlClient, key) => {
  try {
    let result = await getPrivateMetaFields(graphqlClient, {
      namespace: "app_status",
      key: key,
    });
    return result;
  } catch (err) {
    throw err;
  }
};

const getPrivateMetaFields = async (graphqlClient, fields) => {
  try {
    const response = await graphqlClient.query({
      data: {
        query: currentAppQuery,
      },
    });

    const appId = response?.body?.data?.currentAppInstallation?.id;
    let metafields = "";
    if (appId) {
      const getMetafield = await graphqlClient.query({
        data: {
          query: getAppMetafieldsQuery(fields),
        },
      });
      metafields = getMetafield?.body?.data?.currentAppInstallation?.metafield?.value
        ? JSON.parse(getMetafield?.body?.data?.currentAppInstallation?.metafield?.value)
        : null;
    }
    return metafields;
  } catch (err) {
    throw err;
  }
};

const deletePrivateMetaFields = async (graphqlClient, shop, id) => {
  try {
    if (id && id.length > 0) {
      const deleteMetafield = await graphqlClient.query({
        data: {
          query: deleteAppMetafieldsQuery(id),
        },
      });
      if (deleteMetafield.body.data.metafieldDelete) {
        await findOneAndUpdate(
          "user",
          { shopUrl: shop },
          { $unset: { annoucementMetafield: "" } }, // Use $unset to remove the field
          { accessToken: 0 }
        );
      }
    }
  } catch (err) {
    throw err;
  }
};

export { postData, getMetafield, deletePrivateMetaFields, postPrivateMetaFields };
