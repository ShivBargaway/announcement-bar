import OpenAI from "openai";
import clientProvider from "../../../../utils/clientProvider.js";
import { fetchFileInfoQuery } from "../../graphql/imageOptimizerQuery.js";
import { ApiResponse } from "../../helpers/common.js";

export const getSingleAIRes = async (body) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    return await openai.chat.completions.create({
      model: body.model,
      messages: [
        { role: "user", content: body?.userPrompt },
        { role: "system", content: body.systemPrompt },
      ],
      n: 1,
    });
  } catch (err) {
    throw err;
  }
};

const aiPayLoadForCustomizeUpdate = async (body) => {
  try {
    const { AiInstruction, selectedData } = body;
    const userMessages = `Selected Data: "${selectedData}"`;
    const systemPrompt = `Update the Selected Data based on user's instruction: ${AiInstruction}.`;

    const payload = {
      model: "gpt-4-1106-preview",
      systemPrompt: systemPrompt,
      userPrompt: userMessages,
    };

    return payload;
  } catch (error) {
    throw error;
  }
};

export const createCustomizeAi = async (req, res, next) => {
  try {
    let rcResponse = new ApiResponse();
    const payload = await aiPayLoadForCustomizeUpdate(req?.body);

    const aiRes = await getSingleAIRes(payload);
    const content = aiRes?.data?.choices?.[0]?.message.content;

    const jsonString = content.trim().replace(/\n\s*\+\s*/g, "");
    rcResponse.data = { value: `${jsonString}` };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};

const fetchFileByFilename = async (graphqlClient, graphqlQuery, limit, searchQuery) => {
  try {
    const response = await graphqlClient.client.query({
      data: {
        query: graphqlQuery,
        variables: {
          first: parseInt(limit),
          query: searchQuery,
          sortKey: "RELEVANCE",
        },
      },
    });
    return response?.body?.data?.files.edges.map((edge) => edge.node);
  } catch (error) {
    throw error;
  }
};

export const getShopifyImage = async (req, res, next) => {
  try {
    const rcResponse = new ApiResponse();
    const { shop } = req.shopify;
    const graphqlClient = await clientProvider.offline.graphqlClient({ shop });
    const { body } = req;
    const limit = 250;

    let searchQuery = `media_type:image AND NOT (used_in:theme  OR filename:OPTIMIZE_BACKUP_PRODUCT_* )`;
    if (body?.advanceFilter?.[0]?.value) {
      searchQuery = `filename:${body.advanceFilter[0].value} AND ${searchQuery}`;
    }

    // Fetch file data based on the search query
    const fileData = await fetchFileByFilename(graphqlClient, fetchFileInfoQuery, limit, searchQuery);
    const fileDataWithoutNullImage = fileData.filter((item) => item.image !== null);

    rcResponse.data = { rows: fileDataWithoutNullImage || [], count: fileDataWithoutNullImage?.length || 0 };
    return res.status(rcResponse.code).send(rcResponse);
  } catch (error) {
    next(error);
  }
};
