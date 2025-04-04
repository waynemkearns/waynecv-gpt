const fetch = require('node-fetch');

exports.handler = async (event) => {
  console.log("Function triggered. Key present:", !!process.env.OPENAI_API_KEY);
  try {
    const { prompt } = JSON.parse(event.body);
    console.log("Prompt received:", prompt);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250
      })
    });

    const data = await response.json();
    console.log("Raw OpenAI API response:", JSON.stringify(data));

    if (!data.choices || !data.choices[0]) {
      console.error("Unexpected OpenAI response format:", JSON.stringify(data));
      return {
        statusCode: 500,
        body: JSON.stringify({ response: "Unexpected API response format." })
      };
    }

    const message = data.choices[0].message.content || "No response from AI";

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ response: message })
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ response: "Error processing your request." })
    };
  }
};