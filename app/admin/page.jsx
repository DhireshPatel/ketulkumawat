"use client";

import { useState, useEffect } from "react";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    price: "",
    pages: "",
    category: "Chemistry",
    author: "Dr. Ketul Kumawat",
    language: "English",
    rating: 5,
    pdfFile: null,
    images: [],
  });

  useEffect(() => {
    fetchAdminBooks();
  }, []);

  const fetchAdminBooks = async () => {
    const res = await fetch("/api/admin/books");
    const data = await res.json();
    setBooks(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "pdfFile") {
      setFormData({ ...formData, pdfFile: e.target.files[0] });
    } else if (e.target.name === "images") {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    }
  };

  // Form Reset Helper
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      price: "",
      pages: "",
      category: "Chemistry",
      author: "Dr. Ketul Kumawat",
      language: "English",
      rating: 5,
      pdfFile: null,
      images: [],
    });
    setIsEditing(false);
    setCurrentBookId(null);
  };

  // Upload & Edit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        if (formData.images && formData.images.length > 0) {
          formData.images.forEach((file) => data.append("images", file));
        }
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    // Edit ke liye URL sahi format mein hona chahiye
    const url = isEditing ? `/api/admin/books/${currentBookId}` : "/api/admin/books";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, { method, body: data });
      if (res.ok) {
        alert(isEditing ? "Book Updated Successfully!" : "Book Published Successfully!");
        resetForm();
        // Naye data ko fetch karke table refresh karein
        await fetchAdminBooks();
      } else {
        const errData = await res.json();
        alert(errData.error || "Something went wrong!");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Upload Failed: " + (error.message || "Failed to connect to server."));
    }
  };

  // Edit Trigger
  const startEdit = (book) => {
    setIsEditing(true);
    setCurrentBookId(book._id || book.id);
    setFormData({
      title: book.title,
      description: book.description,
      longDescription: book.longDescription || "",
      price: book.price.replace("₹", ""), // Stored clean integer/string
      pages: book.pages,
      category: book.category,
      author: book.author,
      language: book.language,
      rating: book.rating,
      pdfFile: null,
      images: [],
    });
  };

  // Delete Handler
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this PDF/Book?")) {
      const res = await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Book Deleted!");
        fetchAdminBooks();
      }
    }
  };

  return (
    <section
      className="admin-panel"
      style={{ padding: "2rem", background: "#f9f9f9" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <h2>✨ Book & PDF Admin Dashboard</h2>
        <hr style={{ margin: "1.5rem 0" }} />

        {/* ===== FORM: UPLOAD & EDIT ===== */}
        <div
          className="admin-card"
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h3>
            {isEditing
              ? "✏️ Edit E-Book Detail"
              : "📤 Upload & Publish New E-Book"}
          </h3>

          <form
            onSubmit={handleSubmit}
            style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={{ flex: 2, padding: "0.5rem", border: "1px solid gray" }}
              />
              <input
                type="text"
                name="price"
                placeholder="Price (e.g. 199)"
                value={formData.price}
                onChange={handleInputChange}
                required
                style={{ flex: 1, padding: "0.5rem", border: "1px solid gray" }}
              />
            </div>

            <input
              type="text"
              name="description"
              placeholder="Short Card Description"
              value={formData.description}
              onChange={handleInputChange}
              required
              style={{ padding: "0.5rem", border: "1px solid gray" }}
            />

            <textarea
              name="longDescription"
              placeholder="Detailed About Info (For Modal View)"
              value={formData.longDescription}
              onChange={handleInputChange}
              rows={3}
              style={{ padding: "0.5rem", border: "1px solid gray" }}
            />

            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="number"
                name="pages"
                placeholder="Total Pages"
                value={formData.pages}
                onChange={handleInputChange}
                required
                style={{ flex: 1, padding: "0.5rem", border: "1px solid gray" }}
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ flex: 1, padding: "0.5rem", border: "1px solid gray" }}
              >
                <option value="Chemistry">Chemistry</option>
                <option value="Research">Research</option>
                <option value="Scientific Writing">Scientific Writing</option>
                <option value="Patent">Patent</option>
              </select>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                  Upload PDF Document:
                </label>
                <input
                  type="file"
                  name="pdfFile"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required={!isEditing}
                  style={{ display: "block", marginTop: "0.25rem", border: "1px solid gray" }}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                  Preview Images (Max 4):
                </label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ display: "block", marginTop: "0.25rem", border: "1px solid gray" }}
                />
              </div>
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
              <button
                type="submit"
                className="btn btn-primary1"
                style={{
                  border: "none",
                  padding: "0.75rem 2rem",
                  cursor: "pointer",
                }}
              >
                {isEditing ? "Update & Save" : "Upload & Publish"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: "#ccc",
                    color: "#333",
                    border: "none",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ===== LIST VIEW: ALL UPLOADED PDFS ===== */}
        <div style={{ marginTop: "3rem" }}>
          <h3>📚 All Active E-Books ({books.length})</h3>

          <div style={{ overflowX: "auto", marginTop: "1rem" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <thead>
                <tr style={{ background: "#eee", textAlign: "left" }}>
                  <th style={{ padding: "1rem" }}>Title</th>
                  <th style={{ padding: "1rem" }}>Category</th>
                  <th style={{ padding: "1rem" }}>Pages</th>
                  <th style={{ padding: "1rem" }}>Price</th>
                  <th style={{ padding: "1rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(books) ? (
                  books.map((book) => (
                    <tr key={book._id || book.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "1rem", fontWeight: "600" }}>{book.title}</td>
                      <td style={{ padding: "1rem" }}>{book.category}</td>
                      <td style={{ padding: "1rem" }}>{book.pages} Pages</td>
                      <td style={{ padding: "1rem", color: "#2e7d32", fontWeight: "bold" }}>{book.price}</td>
                      <td style={{ padding: "1rem", display: "flex", gap: "0.5rem" }}>
                        <button onClick={() => startEdit(book)} style={{ background: "#0288d1", color: "#fff", border: "none", padding: "0.25rem 0.75rem", borderRadius: "4px", cursor: "pointer" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(book._id || book.id)} style={{ background: "#d32f2f", color: "#fff", border: "none", padding: "0.25rem 0.75rem", borderRadius: "4px", cursor: "pointer" }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: "2rem", textAlign: "center", color: "#777" }}>
                      No E-books uploaded yet or Database connecting...
                    </td>
                  </tr>
                )}
                {books.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
                      No E-books uploaded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
} 