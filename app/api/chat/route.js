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
import { SYSTEM_PROMPT } from "@/lib/systemPrompt";
import { PROMPTS } from "@/lib/prompts";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req) {
  try {
    const { message, history } = await req.json();

    let finalMessage = message;

    const lower = message.toLowerCase().trim();

    if (lower.startsWith("mcq ")) {
      const topic = message.substring(4);
      finalMessage = PROMPTS.MCQ(topic);
    } else if (lower.startsWith("summary ")) {
      const topic = message.substring(8);
      finalMessage = PROMPTS.SUMMARY(topic);
    } else if (lower.startsWith("revision ")) {
      const topic = message.substring(9);
      finalMessage = PROMPTS.REVISION(topic);
    } else if (lower.startsWith("formula ")) {
      const topic = message.substring(8);
      finalMessage = PROMPTS.FORMULA(topic);
    }

    // console.log("History Length:", history.length);
    // console.log(history);

    // Frontend history -> Gemini history
    const geminiHistory = (history || []).map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    // const chat = ai.chats.create({
    //   model: "gemini-3.6-flash",
    //   history: geminiHistory,
    // }); // we replace this for making ai to professor ketul ai.

    const chat = ai.chats.create({
      model: "gemini-3.6-flash",

      config: {
        systemInstruction: SYSTEM_PROMPT,
      },

      history: geminiHistory,
    });

    const response = await chat.sendMessage({
      message: finalMessage,
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
