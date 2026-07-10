import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();

    const { name, email, area, service, message } = data;

    const telegramMessage = `
🎓 <b>NEW RESEARCH CONSULTATION</b>

👤 <b>Name:</b> ${name}

📧 <b>Email:</b> ${email}

🔬 <b>Research Area:</b> ${area}

📚 <b>Service:</b> ${service}

💬 <b>Message:</b>
${message}
`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: "HTML",
      }),
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      },
    );
  }
}
