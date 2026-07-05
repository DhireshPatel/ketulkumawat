// // app/api/admin/books/route.js
// import { NextResponse } from "next/server";
// import fs from "fs";
// import path from "path";

// // अस्थायी डेटाबेस (अगर आप असली DB जैसे MongoDB का उपयोग नहीं कर रहे हैं, तो हम एक local JSON फाइल में डेटा रखेंगे)
// const DATA_FILE = path.join(process.cwd(), "data", "books.json");

// // हेल्पर फंक्शन: डेटा रीड करने के लिए
// function readData() {
//   if (!fs.existsSync(path.dirname(DATA_FILE))) {
//     fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
//   }
//   if (!fs.existsSync(DATA_FILE)) {
//     fs.writeFileSync(DATA_FILE, JSON.stringify([]));
//   }
//   return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
// }

// // हेल्पर फंक्शन: डेटा राइट करने के लिए
// function writeData(data) {
//   fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
// }

// // 1. GET Request: सभी बुक्स को दिखाने के लिए
// export async function GET() {
//   try {
//     const books = readData();
//     return NextResponse.json(books, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch books" },
//       { status: 500 },
//     );
//   }
// }

// // 2. POST Request: नया PDF और बुक अपलोड करने के लिए
// export async function POST(request) {
//   try {
//     const formData = await request.formData();

//     const title = formData.get("title");
//     const description = formData.get("description");
//     const longDescription = formData.get("longDescription");
//     const price = `₹${formData.get("price")}`;
//     const pages = parseInt(formData.get("pages"));
//     const category = formData.get("category");
//     const author = formData.get("author") || "Dr. Ketul Kumawat";
//     const language = formData.get("language") || "English";

//     const pdfFile = formData.get("pdfFile");
//     const images = formData.getAll("images");

//     // अपलोड फोल्डर पाथ तय करना (public/uploads)
//     const uploadDir = path.join(process.cwd(), "public", "uploads");
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }

//     // PDF फ़ाइल को लोकल फोल्डर में सेव करना
//     let pdfUrl = "";
//     if (pdfFile && pdfFile.name) {
//       const pdfBytes = await pdfFile.arrayBuffer();
//       const pdfBuffer = Buffer.from(pdfBytes);
//       const pdfName = `${Date.now()}-${pdfFile.name.replace(/\s+/g, "-")}`;
//       fs.writeFileSync(path.join(uploadDir, pdfName), pdfBuffer);
//       pdfUrl = `/uploads/${pdfName}`;
//     }

//     // इमेज फाइल्स को लोकल फोल्डर में सेव करना
//     const imageUrls = [];
//     for (const img of images) {
//       if (img && img.name) {
//         const imgBytes = await img.arrayBuffer();
//         const imgBuffer = Buffer.from(imgBytes);
//         const imgName = `${Date.now()}-${img.name.replace(/\s+/g, "-")}`;
//         fs.writeFileSync(path.join(uploadDir, imgName), imgBuffer);
//         imageUrls.push(`/uploads/${imgName}`);
//       }
//     }

//     // नया बुक ऑब्जेक्ट बनाना
//     const books = readData();
//     const newBook = {
//       id: Date.now(), // Unique ID
//       title,
//       description,
//       longDescription,
//       pages,
//       category,
//       price,
//       author,
//       language,
//       rating: 5,
//       pdfUrl, // यह आपके PDF डाउनलोड का लिंक बनेगा
//       images: imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"], // अगर इमेज नहीं है तो डिफ़ॉल्ट
//     };

//     books.push(newBook);
//     writeData(books);

//     return NextResponse.json(
//       { message: "Book published successfully", book: newBook },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to upload book" },
//       { status: 500 },
//     );
//   }
// }

// app/api/admin/books/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper: Buffer ko Cloudinary par upload karne ke liye
const uploadToCloudinary = (buffer, resourceType = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: resourceType, folder: "ebooks_store" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      )
      .end(buffer);
  });
};

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find().sort({ createdAt: -1 });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const pdfFile = formData.get("pdfFile");
    const images = formData.getAll("images");

    if (!pdfFile)
      return NextResponse.json(
        { error: "PDF file is required" },
        { status: 400 },
      );

    // 1. PDF Upload to Cloudinary
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const pdfUploadResult = await uploadToCloudinary(pdfBuffer, "raw"); // PDF ke liye 'raw' use hota hai

    // 2. Images Upload to Cloudinary
    const imageUrls = [];
    for (const img of images) {
      if (img && img.name) {
        const imgBuffer = Buffer.from(await img.arrayBuffer());
        const imgUploadResult = await uploadToCloudinary(imgBuffer, "image");
        imageUrls.push(imgUploadResult.secure_url);
      }
    }

    // 3. Save to MongoDB
    const newBook = new Book({
      title: formData.get("title"),
      description: formData.get("description"),
      longDescription: formData.get("longDescription"),
      price: `₹${formData.get("price")}`,
      pages: parseInt(formData.get("pages")),
      category: formData.get("category"),
      author: formData.get("author") || "Dr. Ketul Kumawat",
      language: formData.get("language") || "English",
      rating: 5,
      pdfUrl: pdfUploadResult.secure_url,
      pdfPublicId: pdfUploadResult.public_id, // Isko save rakhna delete ke liye kaam aayega
      images: imageUrls.length > 0 ? imageUrls : ["/placeholder.jpg"],
    });

    await newBook.save();
    return NextResponse.json(
      { message: "Book published live!", book: newBook },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
