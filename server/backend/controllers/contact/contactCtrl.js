import clientProvider from "../../../../utils/clientProvider.js";
import { ApiResponse } from "../../helpers/common.js";
import { commonFilterQuery } from "../../helpers/utils.js";
import { find, findOneAndUpdate } from "../../model/common.js";

const addEmailContacts = async (req, res, next) => {
  let rcResponse = new ApiResponse();
  let { body } = req;
  try {
    body["campaignId"] = body.id;

    const graphqlClient = await clientProvider.offline.graphqlClient({ shop: body.shopUrl });

    const existingCustomers = await graphqlClient.client.query({
      data: {
        query: `
        query FindCustomer($email: String!) {
          customers(first: 1, query: $email) {
            edges {
              node {
                id
                email
                tags
              }
            }
          }
        }
        `,
        variables: {
          email: body.email,
        },
      },
    });
    const customerNode = existingCustomers.body.data.customers.edges[0];
    if (customerNode) {
      body["customerId"] = customerNode.node.id;
      const shopifyresponse = await graphqlClient.client.query({
        data: {
          query: `mutation customerUpdate($input: CustomerInput!) {
              customerUpdate(input: $input) {
                userErrors {
                  field
                  message
                }
                  customer {
                    id
                    email
                    tags
                    
                  }
              }
            }
            `,
          variables: {
            input: {
              id: customerNode.node.id,
              email: body.email,
              tags: body.tags,
            },
          },
        },
      });
    } else {
      const shopifyresponse = await graphqlClient.client.query({
        data: {
          query: `mutation customerCreate($input: CustomerInput!) {
              customerCreate(input: $input) {
                userErrors {
                  field
                  message
                }
                  customer {
                    id
                    email
                    tags
                    emailMarketingConsent {
                      marketingState
                      marketingOptInLevel
                    }
                  }
              }
            }
            `,
          variables: {
            input: {
              email: body.email,
              tags: body.tags,
              emailMarketingConsent: {
                marketingState: "SUBSCRIBED",
                marketingOptInLevel: "SINGLE_OPT_IN",
              },
            },
          },
        },
      });
    }
    rcResponse.data = await findOneAndUpdate("contact", { email: body.email }, body);
    if (rcResponse.data) await findOneAndUpdate("annoucement", { _id: body.id }, { $inc: { submits: 1 } });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const getEmailContacts = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    const searchQuery = commonFilterQuery(req.body.advanceFilter);
    let result = await find("contact", {
      shopUrl: shop,
      ...searchQuery,
    });
    rcResponse.data = { rows: result };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const addClickData = async (req, res, next) => {
  try {
    let { body } = req;
    let rcResponse = new ApiResponse();
    await findOneAndUpdate("annoucement", { _id: body._id }, { $inc: { clicks: 1 } });
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

const addViewSlideData = async (req, res, next) => {
  try {
    let { body } = req;
    let rcResponse = new ApiResponse();
    if (Array.isArray(body)) {
      for (const id of body) {
        await findOneAndUpdate("annoucement", { _id: id }, { $inc: { views: 1 } });
      }
    } else {
      return res.status(400).send({ message: "Body must be an array of IDs" });
    }
    return res.status(rcResponse.code).send(rcResponse);
  } catch (err) {
    next(err);
  }
};

export { addEmailContacts, getEmailContacts, addClickData, addViewSlideData };
