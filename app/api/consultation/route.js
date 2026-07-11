import { supabase } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();

    const { name, email, phone, area, service, message } = body;

    const { error } = await supabase.from("consultations").insert([
      {
        full_name: name,
        email,
        phone,
        research_area: area,
        service,
        message,
      },
    ]);

    if (error) {
      console.error(error);
      return Response.json({ success: false }, { status: 500 });
    }

    const telegramMessage = `
🆕 New Consultation

👤 Name: ${name}
📧 Email: ${email}
📞 Phone: ${phone}
🔬 Research Area: ${area}
🛠 Service: ${service}

💬 Message:
${message}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: telegramMessage,
        }),
      },
    );

    const telegramResult = await telegramResponse.json();
    console.log("Telegram Response:", telegramResult);

    return Response.json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false }, { status: 500 });
  }
}
