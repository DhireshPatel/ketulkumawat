import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      projectType,
      service,
      budget,
      deadline,
      description,
    } = body;

    if (!name || !phone) {
      return NextResponse.json(
        {
          error: "Required fields missing.",
        },
        {
          status: 400,
        },
      );
    }

    //-----------------------------------
    // Save to Supabase
    //-----------------------------------

    const { data, error } = await supabaseAdmin
      .from("hire_requests")
      .insert([
        {
          name,
          email,
          phone,
          project_type: projectType,
          service,
          budget,
          deadline,
          description,
          telegram_sent: false,
        },
      ])
      .select();

    if (error) {
      console.log(error);

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 500,
        },
      );
    }

    //-----------------------------------
    // Telegram Message
    //-----------------------------------

    const telegramMessage = `
📩 New Hire Me Request

👤 Name: ${name}

📧 Email: ${email || "Not Provided"}

📞 Phone: ${phone}

📁 Project Type: ${projectType}

🛠 Service:
${service}

💰 Budget:
${budget}

📅 Deadline:
${deadline}

📝 Description:
${description}
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

    //-----------------------------------
    // Update telegram_sent
    //-----------------------------------

    if (telegramResponse.ok) {
      await supabaseAdmin
        .from("hire_requests")
        .update({
          telegram_sent: true,
        })
        .eq("id", data[0].id);
    }

    return NextResponse.json({
      success: true,
      hireRequest: data[0],
    });
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
