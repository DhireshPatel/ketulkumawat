"use client";

import { useMemo, useState } from "react";
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
                  className="exam-card"
                  style={{ height: "100%" }}
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
                  <span className="exam-count">
                    {exam.paperCount}{" "}
                    {exam.paperCount === 1 ? "paper" : "papers"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
