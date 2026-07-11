export async function GET() {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;

  return Response.json({
    tokenExists: !!token,
    tokenPreview: token ? `${token.slice(0, 10)}...${token.slice(-5)}` : null,
    chat,
  });
}
