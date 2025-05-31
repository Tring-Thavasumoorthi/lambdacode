import { GoogleGenAI } from "@google/genai";
import { convertToGeminiFormat } from "../utils/utils.mjs";

export const getGeminiResponse = async (
  apiKey,
  model,
  chatHistory,
  prompt,
  googleSearch,
  systemPrompt
) => {
  try {
    const geminiChatHistory = await convertToGeminiFormat(chatHistory);

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });

    const toolsConfig = [];

    if (googleSearch) {
      toolsConfig.push({ googleSearch: {} });
    }

    const chat = ai.chats.create({
      model: model,
      history: geminiChatHistory,
      config: {
        systemInstruction: systemPrompt,
        tools: toolsConfig,
        temperature: 0,
      },
    });

    const response = await chat.sendMessage({
      message: prompt,
    });

    console.log("indeide res ", response);
    return {
      status: true,
      message: response,
    };
  } catch (err) {
    console.log("GEMIIIII " + err);
    return {
      status: false,
      message: `Error while calling Gemini: ${err}`,
    };
  }
};
