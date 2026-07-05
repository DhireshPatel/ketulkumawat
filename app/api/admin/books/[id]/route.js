import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Book from "@/models/Book";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const book = await Book.findById(id);
    if (!book)
      return NextResponse.json({ error: "Book not found" }, { status: 404 });

    // Cloudinary se PDF delete karna
    if (book.pdfPublicId) {
      await cloudinary.uploader.destroy(book.pdfPublicId, {
        resource_type: "raw",
      });
    }

    // Database se delete karna
    await Book.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Deleted from cloud successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await request.formData();

    const updateData = {
      title: formData.get("title"),
      description: formData.get("description"),
      longDescription: formData.get("longDescription"),
      category: formData.get("category"),
    };

    if (formData.get("price")) updateData.price = `₹${formData.get("price")}`;
    if (formData.get("pages"))
      updateData.pages = parseInt(formData.get("pages"));

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Updated successfully", book: updatedBook },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
