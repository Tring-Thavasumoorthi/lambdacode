import OpenAI from "openai";
const getChatgptResponse = async (
  apiKey,
  model,
  chatHistory,
  prompt,
  webSearch,
  systemPrompt
) => {
  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    let inputPrompt = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...chatHistory,
      {
        role: "user",
        content: prompt,
      },
    ];

    console.log("--------", inputPrompt);

    let tools = [];

    if (webSearch) {
      tools.push({ type: "web_search_preview" });
    }

    const response = await openai.responses.create({
      model: model,
      tools: tools,
      input: inputPrompt,
      temperature: 0,
    });

    console.log("CHATGPT", response.output_text);
    console.log("+++++ cha", response);
    return {
      status: true,
      message: response,
    };
  } catch (err) {
    console.log("Chatgpt " + err);
    return {
      status: false,
      message: `Error while calling Chatgpt: ${err}`,
    };
  }
};

export default getChatgptResponse;
