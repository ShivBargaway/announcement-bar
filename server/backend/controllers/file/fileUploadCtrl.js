import fs from "fs";
import { ApiResponse } from "../../helpers/common.js";

const fileCreateMutation = `
mutation fileCreate($files: [FileCreateInput!]!) {
  fileCreate(files: $files) {
    files {
      id
      alt
      createdAt
      fileErrors{
        details
        message
      }
    }
    userErrors {
      field
      message
    }
  }
}`;

const filesQuery = `
query ($id: ID!) {
  node(id: $id) {
    ... on MediaImage {
      image {
        id
        url
        altText
        height
        width
      }
    }
  }
}`;

const makeGraphqlRequest = async (graphqlClient, query) => {
  try {
    const response = await graphqlClient.query(query);
    return response;
  } catch (err) {
    throw err;
  }
};

const fetchImageById = async (graphqlClient, id) => {
  try {
    const response = await makeGraphqlRequest(graphqlClient, {
      data: {
        query: filesQuery,
        variables: {
          id: id,
        },
      },
    });
    const image = response.body?.data?.node?.image;

    if (!image) {
      await sleep(500);
      return fetchImageById(graphqlClient, id);
    }

    return image;
  } catch (err) {
    throw err;
  }
};

const imageFileCreate = async (graphqlClient, fileCreateVariables) => {
  try {
    const response = await makeGraphqlRequest(graphqlClient, {
      data: {
        query: fileCreateMutation,
        variables: fileCreateVariables,
      },
    });

    const id = response?.body?.data?.fileCreate?.files[0].id;
    await sleep(1000);
    return await fetchImageById(graphqlClient, id);
  } catch (error) {
    throw error;
  }
};

const postFileToShopify = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shop, graphqlClient } = req.shopify;
    const files = req.files;

    let promises = [];

    files.forEach((file, index) => {
      const fileCreateVariables = {
        files: [],
      };

      let fileData = {};
      if (process.env.ENV !== "dev") {
        fileData = {
          originalSource: `${process.env.SHOPIFY_APP_URL}/uploads/${file.filename}`,
          filename: file.filename,
          alt: file.filename,
        };
      } else {
        fileData = {
          originalSource: `https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg`,
          filename: `what_is_image_Processing-${index}.jpg`,
          alt: `what_is_image_Processing-${index}.jpg`,
        };
      }

      fileCreateVariables.files.push(fileData);
      promises.push(imageFileCreate(graphqlClient, fileCreateVariables));
    });
    await Promise.all(promises)
      .then((values) => {
        //remove file from local once uploaded to shopify
        //TODO: sanjay - need to make alt dynamic and replaced by file name when uploading to shopify
        removeLocalFile(files);
        rcResponse.data = values;
      })
      .catch((error) => {
        throw error;
      });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const removeLocalFile = async (files) => {
  try {
    //TODO: sanjay - change this path if required
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      fs.unlink(`./server/backend/uploads/${file.filename}`, (err) => {
        if (err) {
          throw err;
        }
      });
    }
  } catch (error) {
    throw error;
  }
};

const removeFileFromShopify = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { graphqlClient } = req.shopify;
    const { id } = req.body;

    const fileDeleteMutation = `
      mutation fileDelete($fileIds: [ID!]!) {
        fileDelete(fileIds: $fileIds) {
          deletedFileIds
          userErrors {
            field
            message
          }
        }
      }
    `;

    const fileDeleteVariables = {
      fileIds: [id],
    };

    const response = await graphqlClient.query({
      data: {
        query: fileDeleteMutation,
        variables: {
          id: fileDeleteVariables,
        },
      },
    });

    rcResponse.data = response.body.data.fileDelete;
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

async function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export { postFileToShopify, removeFileFromShopify };
