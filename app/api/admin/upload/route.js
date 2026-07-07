import { NextResponse } from "next/server";
import { uploadPdf, uploadImage } from "@/lib/storage-server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    let pdfPath = "";
    const imageUrls = [];

    // ---------- PDF ----------

    const pdf = formData.get("pdf");

    if (pdf) {
      const pdfBuffer = Buffer.from(await pdf.arrayBuffer());

      pdfPath = await uploadPdf(pdfBuffer, `pdfs/${Date.now()}-${pdf.name}`);
    }

    // ---------- Images ----------

    const images = formData.getAll("images");

    for (const image of images) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());

      const url = await uploadImage(
        imageBuffer,
        `images/${Date.now()}-${image.name}`,
      );

      imageUrls.push(url);
    }

    return NextResponse.json({
      success: true,
      pdfPath,
      imageUrls,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      },
    );
  }
}

// import { NextResponse } from "next/server";

// export async function GET() {
//   return NextResponse.json({
//     success: true,
//     message: "GET Upload API Working",
//   });
// }

// export async function POST() {
//   return NextResponse.json({
//     success: true,
//     message: "POST Upload API Working",
//   });
// }
