// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// export async function POST(req) {
//   try {
//     const { message, history } = await req.json();

//     const response = await ai.models.generateContent({
//       //   model: "gemini-2.5-flash",
//       // model: "gemini-2.5-flash-lite",
//       // model: "gemini-2.0-flash",
//       // model: "gemini-2.0-flash-lite",
//       model: "gemini-3.6-flash",
//       contents: message,
//     });

//     return Response.json({
//       reply: response.text,
//     });
//   } catch (error) {
//     console.error(error);

//     return Response.json(
//       {
//         reply: "Something went wrong.",
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// new (for last chat history)

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history } = await req.json();
    console.log("History Length:", history.length);
    console.log(history);

    // Frontend history -> Gemini history
    const geminiHistory = (history || []).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",
      history: geminiHistory,
    });

    const response = await chat.sendMessage({
      message,
    });

    return Response.json({
      reply: response.text,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        reply: "Something went wrong.",
      },
      {
        status: 500,
      },
    );
  }
}
