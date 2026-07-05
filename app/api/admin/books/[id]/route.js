// app/api/admin/books/[id]/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "books.json");

function readData() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 1. DELETE Request
export async function DELETE(request, { params }) {
  try {
    // Next.js dynamic routing mein params ko fetch karna
    const { id } = await params;
    let books = readData();

    const bookToDelete = books.find((b) => String(b.id) === String(id));

    if (!bookToDelete) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Local storage se file delete karna (optional)
    if (bookToDelete.pdfUrl) {
      const pdfPath = path.join(process.cwd(), "public", bookToDelete.pdfUrl);
      if (fs.existsSync(pdfPath)) {
        try {
          fs.unlinkSync(pdfPath);
        } catch (e) {
          console.log(e);
        }
      }
    }

    // Filter out the deleted book
    books = books.filter((b) => String(b.id) !== String(id));
    writeData(books);

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// 2. PUT Request (Edit)
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    let books = readData();

    const index = books.findIndex((b) => String(b.id) === String(id));

    if (index === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Naye data ko update karna
    books[index] = {
      ...books[index],
      title: formData.get("title") || books[index].title,
      description: formData.get("description") || books[index].description,
      longDescription:
        formData.get("longDescription") || books[index].longDescription,
      price: formData.get("price")
        ? `₹${formData.get("price")}`
        : books[index].price,
      pages: formData.get("pages")
        ? parseInt(formData.get("pages"))
        : books[index].pages,
      category: formData.get("category") || books[index].category,
    };

    writeData(books);
    return NextResponse.json(
      { message: "Book updated successfully", book: books[index] },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
