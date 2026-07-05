// app/api/admin/books/[id]/route.js
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "books.json");

function readData() {
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 1. DELETE Request: बुक और उसकी फाइल्स डिलीट करने के लिए
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    let books = readData();
    const bookToDelete = books.find((b) => b.id === parseInt(id));

    if (!bookToDelete) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // (ऑप्शनल) सर्वर से फाइलें भी डिलीट करना चाहते हैं तो:
    if (bookToDelete.pdfUrl) {
      const pdfPath = path.join(process.cwd(), "public", bookToDelete.pdfUrl);
      if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    }

    // लिस्ट से हटाकर सेव करें
    books = books.filter((b) => b.id !== parseInt(id));
    writeData(books);

    return NextResponse.json(
      { message: "Book deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// 2. PUT Request: बुक डिटेल्स अपडेट करने के लिए
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const formData = await request.formData();
    let books = readData();
    const index = books.findIndex((b) => b.id === parseInt(id));

    if (index === -1) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // पुराने डेटा में नए डेटा को मर्ज करें
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
      { message: "Book updated successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
