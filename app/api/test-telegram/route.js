export async function GET() {
  try {
    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: "✅ Test message from Vercel",
        }),
      },
    );

    const result = await response.json();

    return Response.json(result);
  } catch (err) {
    return Response.json(
      {
        error: err.message,
      },
      { status: 500 },
    );
  }
}
