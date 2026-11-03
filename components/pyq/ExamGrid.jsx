"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { THUMBS_BUCKET } from "../../lib/pyq/config";

function logoUrl(path) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return path && base
    ? `${base}/storage/v1/object/public/${THUMBS_BUCKET}/${path}`
    : null;
}

export default function ExamGrid({ exams }) {
  const [q, setQ] = useState("");

  const [opening, setOpening] = useState(null); // jis exam ko khol rahe hain uska slug

  // Safety: agar page 15 sec mein na khule (net band etc.) to "Opening…" hata do
  useEffect(() => {
    if (!opening) return undefined;
    const t = setTimeout(() => setOpening(null), 15000);
    return () => clearTimeout(t);
  }, [opening]);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term
      ? exams.filter((e) => e.name.toLowerCase().includes(term))
      : exams;
  }, [q, exams]);

  return (
    <>
      <div className="search-box">
        <label htmlFor="exam-search" className="sr-only">
          Search exams
        </label>
        <input
          id="exam-search"
          type="search"
          placeholder="Search exams, e.g. CSIR NET"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      {exams.length === 0 ? (
        <div className="notice">
          <strong>No exams available yet.</strong> Please check back soon.
        </div>
      ) : list.length === 0 ? (
        <div className="notice">
          No exam matches “<strong>{q}</strong>”.
        </div>
      ) : (
        <ul className="exam-grid">
          {list.map((exam) => {
            const img = logoUrl(exam.thumbnail_path);
            return (
              <li key={exam.id}>
                <Link
                  href={`/pyq/${exam.slug}`}
                  className={`exam-card${opening === exam.slug ? " is-opening" : ""}`}
                  style={{ height: "100%" }}
                  aria-busy={opening === exam.slug}
                  onClick={(e) => {
                    if (opening) {
                      e.preventDefault();
                      return;
                    } // loading ke time baar-baar click ignore
                    setOpening(exam.slug);
                  }}
                >
                  <span className="exam-logo" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {img ? (
                      <img src={img} alt="" loading="lazy" />
                    ) : (
                      exam.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <h2>{exam.name}</h2>
                  {exam.description && <p>{exam.description}</p>}
                  {opening === exam.slug ? (
                    <span className="opening-note" role="status">
                      <span className="spinner" aria-hidden="true" /> Opening{" "}
                      {exam.name}…
                    </span>
                  ) : (
                    <span className="exam-count">
                      {exam.paperCount}{" "}
                      {exam.paperCount === 1 ? "paper" : "papers"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
