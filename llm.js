const OpenAI = require("openai");
require("dotenv").config();

async function generateContract(prompt) {
    console.log("generate")
  try {
    const client = new OpenAI({
      baseURL: "https://router.huggingface.co/v1",
      apiKey: process.env.HF_TOKEN,
    });

    let chatCompletion;

    try {
      chatCompletion = await client.chat.completions.create({
        model: "meta-llama/Llama-3.2-3B-Instruct",
        messages: [
          { role: "user", content: prompt }, 
        ],
        max_tokens: 2048,
        temperature: 0.3,
      });
    } catch (apiError) {

      return {
        success: false,
        error:
          "The AI service is temporarily unavailable. Please try again later.",
        details: apiError.response?.data || apiError.message,
      };
    }

    const message = chatCompletion?.choices?.[0]?.message?.content;

    return {
      success: true,
      content: message,
    };
  } catch (err) {
    console.error("LLM Fatal Error:", err);

    return {
      success: false,
      error: "Something went wrong while generating the contract.",
      details: err.message,
    };
  }
}

module.exports = generateContract;
