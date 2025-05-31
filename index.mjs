import { readJson } from "./src/s3/readJsonFromS3.mjs";
import { updateJson } from "./src/s3/updateJsonInS3.mjs";
import { getGeminiResponse } from "./src/gemini/geminiSdk.mjs";
import getChatgptResponse from "./src/chatgpt/chatgptSdk.mjs"

export const handler = async (event) => {
  if (Object.keys(event).length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Please Provide the Parameters" }),
    };
  }

  const headers = event?.headers || {};
  const body = event?.body || {};
  const apiKey = headers['x-api-key'] || headers['X-API-KEY'];
  const provider = body?.provider;
  const model = body?.model;
  const systemPrompt = body?.systemPrompt || "";
  const prompt = body?.prompt || "";
  const webSearch = body?.webSearch || false;
  const isConversation = body?.isConversation || false;
  const bucketName = body?.bucketName;
  const key = body?.key;

  let chatHistory = [];
  let contentText = "";

  if (!provider) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameter: provider" }),
    };
  }

  if (!model) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameter: model" }),
    };
  }

  if (!apiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameter: apiKey" }),
    };
  }

  if (!prompt) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing parameter: prompt" }),
    };
  }

  if (isConversation) {

    console.log("bucketname:", bucketName);
    console.log("key:", key);

    const readS3 = await readJson(bucketName, key);

    if (!readS3?.status) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: readS3?.message }),
      };
    }

    chatHistory = readS3?.message || [];
    console.log("readS3", chatHistory);

  }


  try {
    let response;
    switch (provider) {
      case "gemini":
        response = await getGeminiResponse(apiKey, model, chatHistory, prompt, webSearch, systemPrompt);
        contentText = response?.message?.text
        break;
      case "chatgpt":
        response = await getChatgptResponse(apiKey, model, chatHistory, prompt, webSearch, systemPrompt);
        contentText = response?.message?.output_text
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid Provider" }),
        };
    };
    if (!response?.status) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: response?.message }),
      };
    }

    console.log("RES TEXT ++++", response.text);

    if (isConversation) {
      const newData = [
        { role: "user", content: prompt },
        { role: "assistant", content: contentText }
      ]
      console.log("newData", newData);

      const uploadContextToS3 = await updateJson(bucketName, key, chatHistory, newData);
      console.log("uploadContextToS3", uploadContextToS3);

      if (!uploadContextToS3?.status) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: readS3?.message }),
        };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ response: response?.message }),
    };
  } catch (error) {
    console.log("Thavasumoorthi")
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
