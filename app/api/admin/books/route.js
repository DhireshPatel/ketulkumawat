// // app/api/admin/books/route.js
// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";
// // import Book from "@/models/Book";
// // import { v2 as cloudinary } from "cloudinary";

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // });

// // Helper: Buffer ko Cloudinary par upload karne ke liye
// // const uploadToCloudinary = (buffer, resourceType = "auto") => {
// //   return new Promise((resolve, reject) => {
// //     cloudinary.uploader
// //       .upload_stream(
// //         { resource_type: resourceType, folder: "ebooks_store" },
// //         (error, result) => {
// //           if (error) reject(error);
// //           else resolve(result);
// //         },
// //       )
// //       .end(buffer);
// //   });
// // };

// export async function GET() {
//   try {
//     const { data, error } = await supabase
//       .from("ebooks")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) throw error;

//     return NextResponse.json(data);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }

// export async function POST(request) {
//   try {
//     await connectDB();
//     const formData = await request.formData();

//     const pdfFile = formData.get("pdfFile");
//     const images = formData.getAll("images");

//     if (!pdfFile)
//       return NextResponse.json(
//         { error: "PDF file is required" },
//         { status: 400 },
//       );

//     // 1. PDF Upload to Cloudinary
//     const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
//     const pdfUploadResult = await uploadToCloudinary(pdfBuffer, "raw"); // PDF ke liye 'raw' use hota hai

//     // 2. Images Upload to Cloudinary
//     const imageUrls = [];
//     for (const img of images) {
//       if (img && img.name) {
//         const imgBuffer = Buffer.from(await img.arrayBuffer());
//         const imgUploadResult = await uploadToCloudinary(imgBuffer, "image");
//         imageUrls.push(imgUploadResult.secure_url);
//       }
//     }

//     // 3. Save to MongoDB
//     const newBook = new Book({
//       title: formData.get("title"),
//       description: formData.get("description"),
//       longDescription: formData.get("longDescription"),
//       price: `₹${formData.get("price")}`,
//       pages: parseInt(formData.get("pages")),
//       category: formData.get("category"),
//       author: formData.get("author") || "Dr. Ketul Kumawat",
//       language: formData.get("language") || "English",
//       rating: 5,
//       pdfUrl: pdfUploadResult.secure_url,
//       pdfPublicId: pdfUploadResult.public_id, // Isko save rakhna delete ke liye kaam aayega
//       images: imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"],
//     });

//     await newBook.save();
//     return NextResponse.json(
//       { message: "Book published live!", book: newBook },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Cloud Upload Error:", error);
//     return NextResponse.json(
//       { error: `Upload failed: ${error.message}` },
//       { status: 500 },
//     );
//   }
// }

// post req ke time diya gaya complete new code

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { uploadImage, uploadPdf } from "@/lib/storage";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("ebooks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();

    const pdfFile = formData.get("pdfFile");
    const imageFiles = formData.getAll("images");

    if (!pdfFile) {
      return NextResponse.json({ error: "PDF is required" }, { status: 400 });
    }

    // ---------- Upload PDF ----------

    const pdfName = `pdfs/${Date.now()}-${pdfFile.name}`;

    const pdfPath = await uploadPdf(pdfFile, pdfName);

    // ---------- Upload Images ----------

    const imageUrls = [];

    for (const image of imageFiles) {
      if (!image || !image.name) continue;

      const imageName = `images/${Date.now()}-${image.name}`;

      const publicUrl = await uploadImage(image, imageName);

      imageUrls.push(publicUrl);
    }

    // ---------- Save Database ----------

    const { data, error } = await supabaseAdmin
      .from("ebooks")
      .insert([
        {
          title: formData.get("title"),
          short_description: formData.get("description"),
          long_description: formData.get("longDescription"),
          price: Number(formData.get("price")),
          pages: Number(formData.get("pages")),
          category: formData.get("category"),
          author: formData.get("author"),
          language: formData.get("language"),
          rating: Number(formData.get("rating")),
          pdf_path: pdfPath,
          images: imageUrls,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Book Uploaded Successfully",
        book: data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
