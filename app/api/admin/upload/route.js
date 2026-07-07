// import { NextResponse } from "next/server";
// import { uploadPdf, uploadImage } from "@/lib/storage-server";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     let pdfPath = "";
//     const imageUrls = [];

//     // ---------- PDF ----------

//     const pdf = formData.get("pdf");

//     if (pdf) {
//       const pdfBuffer = Buffer.from(await pdf.arrayBuffer());

//       pdfPath = await uploadPdf(pdfBuffer, `pdfs/${Date.now()}-${pdf.name}`);
//     }

//     // ---------- Images ----------

//     const images = formData.getAll("images");

//     for (const image of images) {
//       const imageBuffer = Buffer.from(await image.arrayBuffer());

//       const url = await uploadImage(
//         imageBuffer,
//         `images/${Date.now()}-${image.name}`,
//       );

//       imageUrls.push(url);
//     }

//     return NextResponse.json({
//       success: true,
//       pdfPath,
//       imageUrls,
//     });
//   } catch (err) {
//     console.error(err);

//     return NextResponse.json(
//       {
//         error: err.message,
//       },
//       {
//         status: 500,
//       },
//     );
//   }
// }

// BY GEMI (only for pdf upload)
// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// // Server-side Admin client initialize karein (using service_role key)
// const supabaseAdmin = createClient(
//   process.env.SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY, // 👈 Ensure kariye ki ye .env.local mein ho bina NEXT_PUBLIC_ ke
// );

// export async function POST(request) {
//   try {
//     const { fileName } = await request.json();

//     if (!fileName) {
//       return NextResponse.json(
//         { error: "File name is required" },
//         { status: 400 },
//       );
//     }

//     // 1. Unique file name aur path generate karein
//     const uniqueFileName = `${Date.now()}-${fileName}`;
//     const filePath = `pdfs/${uniqueFileName}`;

//     // 2. Supabase Storage se Signed Upload URL generate karein (Valid for 10 mins)
//     const { data, error } = await supabaseAdmin.storage
//       .from("your-bucket-name") // 👈 Apne Supabase bucket ka naam yahan likhein
//       .createSignedUploadUrl(filePath, {
//         expiresIn: 600, // 10 minutes timeout slow networks ke liye
//       });

//     if (error) {
//       console.error("Supabase signed URL error:", error);
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     // 3. Frontend ko upload URL aur final db path return karein
//     return NextResponse.json({
//       uploadUrl: data.signedUrl,
//       dbPath: filePath,
//     });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }

// by GEMI (for pdf and images)
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Admin client init (Server side only)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export async function POST(request) {
  try {
    // Check karein ki request JSON hai ya FormData
    const contentType = request.headers.get("content-type") || "";

    // --- CASE A: Frontend PDF ke liye Signed URL maang raha hai ---
    if (contentType.includes("application/json")) {
      const { fileName } = await request.json();

      const uniqueFileName = `${Date.now()}-${fileName}`;
      const filePath = `pdfs/${uniqueFileName}`;

      const { data, error } = await supabaseAdmin.storage
        .from("your-bucket-name") // 👈 Apne bucket ka naam likhein
        .createSignedUploadUrl(filePath, { expiresIn: 600 });

      if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({ uploadUrl: data.signedUrl, dbPath: filePath });
    }

    // --- CASE B: Frontend Images upload kar raha hai (Aapka existing image logic) ---
    // Jo aapka pehle ka code images upload karne ke liye tha, wo yahan niche rahega:
    const formData = await request.formData();
    const images = formData.getAll("images");
    const imageUrls = [];

    for (const image of images) {
      const imageName = `images/${Date.now()}-${image.name}`;

      // Aapka existing image upload code (using uploadImage ya direct supabaseAdmin)
      const { data, error } = await supabaseAdmin.storage
        .from("your-bucket-name") // 👈 Apne bucket ka naam likhein
        .upload(imageName, image, { contentType: image.type });

      if (!error) {
        const { data: publicUrlData } = supabaseAdmin.storage
          .from("your-bucket-name")
          .getPublicUrl(imageName);
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
