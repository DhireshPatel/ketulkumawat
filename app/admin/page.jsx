"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
// import { uploadImage, uploadPdf } from "@/lib/storage-client";

export default function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBookId, setCurrentBookId] = useState(null);
  const router = useRouter();

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
    checkSession();
  }, []);

  const checkSession = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/admin/login");
      return;
    }

    fetchAdminBooks();
  };

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
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => {
  //     if (key === "images") {
  //       if (formData.images && formData.images.length > 0) {
  //         formData.images.forEach((file) => data.append("images", file));
  //       }
  //     } else if (formData[key] !== null && formData[key] !== undefined) {
  //       data.append(key, formData[key]);
  //     }
  //   });

  //   // Edit ke liye URL sahi format mein hona chahiye
  //   const url = isEditing
  //     ? `/api/admin/books/${currentBookId}`
  //     : "/api/admin/books";
  //   const method = isEditing ? "PUT" : "POST";

  //   try {
  //     const res = await fetch(url, { method, body: data });
  //     if (res.ok) {
  //       alert(
  //         isEditing
  //           ? "Book Updated Successfully!"
  //           : "Book Published Successfully!",
  //       );
  //       resetForm();
  //       // Naye data ko fetch karke table refresh karein
  //       await fetchAdminBooks();
  //     } else {
  //       const errData = await res.json();
  //       alert(errData.error || "Something went wrong!");
  //     }
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //     alert(
  //       "Upload Failed: " + (error.message || "Failed to connect to server."),
  //     );
  //   }
  // };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const {
  //     data: { session },
  //   } = await supabase.auth.getSession();

  //   console.log("SESSION:", session);

  //   if (!session) {
  //     alert("No active session found");
  //     return;
  //   }

  //   try {
  //     // ---------- Upload PDF ----------

  //     // let pdfPath = "";

  //     // if (formData.pdfFile) {
  //     //   const pdfName = `pdfs/${Date.now()}-${formData.pdfFile.name}`;
  //     //   pdfPath = await uploadPdf(formData.pdfFile, pdfName);
  //     // }

  //     // // ---------- Upload Images ----------

  //     // const imageUrls = [];

  //     // for (const image of formData.images) {
  //     //   const imageName = `images/${Date.now()}-${image.name}`;

  //     //   const imageUrl = await uploadImage(image, imageName);

  //     //   imageUrls.push(imageUrl);
  //     // }

  //     const uploadData = new FormData();

  //     if (formData.pdfFile) {
  //       uploadData.append("pdf", formData.pdfFile);
  //     }

  //     formData.images.forEach((img) => {
  //       uploadData.append("images", img);
  //     });

  //     const uploadRes = await fetch("/api/admin/upload", {
  //       method: "POST",
  //       body: uploadData,
  //     });

  //     const uploadResult = await uploadRes.json();

  //     if (!uploadRes.ok) {
  //       throw new Error(uploadResult.error);
  //     }

  //     const pdfPath = uploadResult.pdfPath;
  //     const imageUrls = uploadResult.imageUrls;

  //     // ---------- Save Database ----------

  //     const url = isEditing
  //       ? `/api/admin/books/${currentBookId}`
  //       : "/api/admin/books";

  //     const method = isEditing ? "PUT" : "POST";

  //     const res = await fetch(url, {
  //       method,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title: formData.title,
  //         description: formData.description,
  //         longDescription: formData.longDescription,
  //         price: formData.price,
  //         pages: formData.pages,
  //         category: formData.category,
  //         author: formData.author,
  //         language: formData.language,
  //         rating: formData.rating,
  //         pdfPath,
  //         imageUrls,
  //       }),
  //     });

  //     const result = await res.json();

  //     if (!res.ok) {
  //       throw new Error(result.error);
  //     }

  //     alert(
  //       isEditing
  //         ? "Book Updated Successfully!"
  //         : "Book Published Successfully!",
  //     );

  //     resetForm();

  //     fetchAdminBooks();
  //   } catch (error) {
  //     console.error(error);

  //     alert(error.message);
  //   }
  // };

  // by GEMI.

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("No active session found. Please login again.");
      return;
    }

    try {
      let pdfPath = "";
      let imageUrls = [];

      // =========================================================
      // 1. CHRONICLE UPLOAD: PDF FILE (Bypass Vercel via Signed URL)
      // =========================================================
      if (formData.pdfFile) {
        // Backend se Signed URL maangein
        const tokenResponse = await fetch("/api/admin/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: formData.pdfFile.name,
            fileType: "pdf",
          }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenResponse.ok)
          throw new Error(tokenData.error || "Failed to get PDF upload URL");

        const { uploadUrl, dbPath } = tokenData;

        // Direct browser se Supabase Storage mein PUT request bhejain (No Vercel Size Limit!)
        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: formData.pdfFile,
          headers: { "Content-Type": formData.pdfFile.type },
        });

        if (!uploadResponse.ok)
          throw new Error("Supabase Storage mein PDF upload fail ho gaya!");

        // Final public URL construct karein
        const supabaseProjectUrl = "https://your-project-id.supabase.co"; // 👈 Apni exact Supabase project URL dalein
        pdfPath = `${supabaseProjectUrl}/storage/v1/object/public/your-bucket-name/${dbPath}`;
      }

      // =========================================================
      // 2. CHRONICLE UPLOAD: IMAGES (Optional backend logic or standard fallback)
      // =========================================================
      // Agar aapki images choti hain (<4MB), toh aap puraane API logic par sirf images bhej sakte hain,
      // Lekin safest tarika hai ki unhe abhi ke liye aapki existing API par uploadData ke roop mein pass karein.
      if (formData.images.length > 0) {
        const uploadData = new FormData();
        formData.images.forEach((img) => {
          uploadData.append("images", img);
        });

        // Yeh API sirf images save karegi backend par (Kyunki humne PDF direct bhej diya)
        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData, // Isme ab heavy PDF nahi hai, sirf images hain!
        });

        const uploadResult = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadResult.error || "Images upload failed");
        imageUrls = uploadResult.imageUrls || [];
      }

      // =========================================================
      // 3. FINAL DATABASE SAVE (MongoDB / Postgres Node Endpoint)
      // =========================================================
      const url = isEditing
        ? `/api/admin/books/${currentBookId}`
        : "/api/admin/books";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          longDescription: formData.longDescription,
          price: formData.price,
          pages: formData.pages,
          category: formData.category,
          author: formData.author,
          language: formData.language,
          rating: formData.rating,
          pdfPath: pdfPath || undefined, // Naya path ya puraana agar edit chal raha hai
          imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      alert(
        isEditing
          ? "Book Updated Successfully!"
          : "Book Published Successfully! 🎉",
      );
      resetForm();
      fetchAdminBooks();
    } catch (error) {
      console.error("Upload error details:", error);
      alert("Error: " + error.message);
    }
  };

  // Edit Trigger
  const startEdit = (book) => {
    setIsEditing(true);
    setCurrentBookId(book._id || book.id);
    setFormData({
      // title: book.title,
      // description: book.description,
      // longDescription: book.longDescription || "",
      // price: book.price.replace("₹", ""), // Stored clean integer/string
      // pages: book.pages,
      // category: book.category,
      // author: book.author,
      // language: book.language,
      // rating: book.rating,
      // pdfFile: null,
      // images: [],
      title: book.title,
      description: book.short_description,
      longDescription: book.long_description || "",
      price: String(book.price),
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
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.replace("/admin/login");
          }}
        >
          Logout
        </button>
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
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    border: "1px solid gray",
                  }}
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
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    border: "1px solid gray",
                  }}
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
                    <tr
                      key={book._id || book.id}
                      style={{ borderBottom: "1px solid #ddd" }}
                    >
                      <td style={{ padding: "1rem", fontWeight: "600" }}>
                        {book.title}
                      </td>
                      <td style={{ padding: "1rem" }}>{book.category}</td>
                      <td style={{ padding: "1rem" }}>{book.pages} Pages</td>
                      <td
                        style={{
                          padding: "1rem",
                          color: "#2e7d32",
                          fontWeight: "bold",
                        }}
                      >
                        {book.price}
                      </td>
                      <td
                        style={{
                          padding: "1rem",
                          display: "flex",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() => startEdit(book)}
                          style={{
                            background: "#0288d1",
                            color: "#fff",
                            border: "none",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(book._id || book.id)}
                          style={{
                            background: "#d32f2f",
                            color: "#fff",
                            border: "none",
                            padding: "0.25rem 0.75rem",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        color: "#777",
                      }}
                    >
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
