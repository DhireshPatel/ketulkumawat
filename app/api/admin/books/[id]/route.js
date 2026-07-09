// import { NextResponse } from "next/server";
// // import Book from "@/models/Book";
// // import { v2 as cloudinary } from "cloudinary";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function DELETE(request, { params }) {
//   try {
//     await connectDB();
//     const { id } = await params;

//     const book = await Book.findById(id);
//     if (!book)
//       return NextResponse.json({ error: "Book not found" }, { status: 404 });

//     // Cloudinary se PDF delete karna
//     if (book.pdfPublicId) {
//       await cloudinary.uploader.destroy(book.pdfPublicId, {
//         resource_type: "raw",
//       });
//     }

//     // Database se delete karna
//     await Book.findByIdAndDelete(id);

//     return NextResponse.json(
//       { message: "Deleted from cloud successfully" },
//       { status: 200 },
//     );
//   } catch (error) {
//     return NextResponse.json({ error: "Delete failed" }, { status: 500 });
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     await connectDB();
//     const { id } = await params;
//     const formData = await request.formData();

//     const updateData = {
//       title: formData.get("title"),
//       description: formData.get("description"),
//       longDescription: formData.get("longDescription"),
//       category: formData.get("category"),
//     };

//     if (formData.get("price")) updateData.price = `₹${formData.get("price")}`;
//     if (formData.get("pages"))
//       updateData.pages = parseInt(formData.get("pages"));

//     const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
//       new: true,
//     });

//     return NextResponse.json(
//       { message: "Updated successfully", book: updatedBook },
//       { status: 200 },
//     );
//   } catch (error) {
//     return NextResponse.json({ error: "Update failed" }, { status: 500 });
//   }
// }

// new

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { deleteImage, deletePdf, getImagePathFromUrl } from "@/lib/storage";
import { uploadImage, uploadPdf } from "@/lib/storage";

// ======================= DELETE =======================

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // 1. Get Book
    const { data: book, error: fetchError } = await supabaseAdmin
      .from("ebooks")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // ================= Delete PDF =================

    if (book.pdf_path) {
      await deletePdf(book.pdf_path);
    }

    // ================= Delete Images =================

    if (book.images && book.images.length > 0) {
      for (const url of book.images) {
        const imagePath = getImagePathFromUrl(url);

        if (imagePath) {
          await deleteImage(imagePath);
        }
      }
    }

    // ================= Delete Row =================

    const { error: deleteError } = await supabaseAdmin
      .from("ebooks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      message: "Book deleted successfully",
    });
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

// ======================= PUT =======================

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from("ebooks")
      .update({
        title: body.title,
        short_description: body.description,
        long_description: body.longDescription,
        // price: Number(body.price),
        price: body.type === "free" ? 0 : Number(body.price),
        pages: Number(body.pages),
        category: body.category,
        author: body.author,
        language: body.language,
        rating: Number(body.rating),
        pdf_path: body.pdfPath,
        images: body.imageUrls,
        updated_at: new Date().toISOString(),
        type: body.type,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: "Book Updated Successfully",
      book: data,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
