// models/Book.js
import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    longDescription: String,
    price: String,
    pages: Number,
    category: String,
    author: { type: String, default: "Dr. Ketul Kumawat" },
    language: { type: String, default: "English" },
    rating: { type: Number, default: 5 },
    pdfUrl: String, // Cloudinary PDF Link
    pdfPublicId: String, // Cloudinary से PDF डिलीट करने के लिए ID
    images: [String], // Cloudinary Images Links array
  },
  { timestamps: true },
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
