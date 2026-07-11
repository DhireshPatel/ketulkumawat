export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token) {
    return Response.json({
      success: false,
      error: "TOKEN NOT FOUND",
    });
  }

  if (!chatId) {
    return Response.json({
      success: false,
      error: "CHAT ID NOT FOUND",
    });
  }

  const response = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ Hello from Vercel",
      }),
    },
  );

  const result = await response.json();

  return Response.json(result);
}
