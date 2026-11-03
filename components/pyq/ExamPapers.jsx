"use client";

import { useMemo, useState } from "react";
import {
  PAPER_TYPES,
  PAPER_TYPE_PLURAL,
  formatBytes,
  typeLabel,
} from "../../lib/pyq/config";

function PaperRow({ p }) {
  const fmt = (d) =>
    new Date(d).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return (
    <li className="paper">
      <div className="paper-top">
        <div>
          <div className="paper-title">{p.title}</div>
          <div className="paper-tags">
            {p.session && <span className="tag">{p.session}</span>}
            {p.shift && <span className="tag">{p.shift}</span>}
            {p.subject && <span className="tag">{p.subject}</span>}
            {p.language && <span className="tag">{p.language}</span>}
          </div>
        </div>
        <div className="paper-actions">
          <a
            className="btn btn-brown btn-small"
            href={`/api/pyq/papers/${p.id}/file`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View PDF
          </a>
          <a
            className="btn btn-blue btn-small"
            href={`/api/pyq/papers/${p.id}/file?download=1`}
          >
            Download
          </a>
        </div>
      </div>
      <details>
        <summary>Paper details</summary>
        <dl>
          <dt>Year</dt>
          <dd>{p.year}</dd>
          <dt>Type</dt>
          <dd>{typeLabel(p.paper_type)}</dd>
          {p.session && (
            <>
              <dt>Session</dt>
              <dd>{p.session}</dd>
            </>
          )}
          {p.shift && (
            <>
              <dt>Shift</dt>
              <dd>{p.shift}</dd>
            </>
          )}
          {p.subject && (
            <>
              <dt>Subject</dt>
              <dd>{p.subject}</dd>
            </>
          )}
          {p.language && (
            <>
              <dt>Language</dt>
              <dd>{p.language}</dd>
            </>
          )}
          {p.file_size ? (
            <>
              <dt>File size</dt>
              <dd>{formatBytes(p.file_size)}</dd>
            </>
          ) : null}
          <dt>Updated</dt>
          <dd>{fmt(p.updated_at)}</dd>
          {p.description && (
            <>
              <dt>About</dt>
              <dd>{p.description}</dd>
            </>
          )}
        </dl>
      </details>
    </li>
  );
}

export default function ExamPapers({ papers }) {
  const [year, setYear] = useState("all");
  const [q, setQ] = useState("");

  const years = useMemo(
    () => [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a),
    [papers],
  );

  const grouped = useMemo(() => {
    const term = q.trim().toLowerCase();
    const filtered = papers.filter((p) => {
      if (year !== "all" && String(p.year) !== year) return false;
      if (!term) return true;
      return [p.title, p.session, p.shift, p.subject, p.language].some(
        (f) => f && f.toLowerCase().includes(term),
      );
    });
    const map = new Map();
    for (const p of filtered) {
      if (!map.has(p.year)) map.set(p.year, []);
      map.get(p.year).push(p);
    }
    return [...map.entries()].sort((a, b) => b[0] - a[0]);
  }, [papers, year, q]);

  if (papers.length === 0) {
    return (
      <div className="notice" style={{ marginTop: 28 }}>
        <strong>No papers published yet.</strong> Please check back soon.
      </div>
    );
  }

  return (
    <>
      <div className="search-box">
        <label htmlFor="paper-search" className="sr-only">
          Search papers
        </label>
        <input
          id="paper-search"
          type="search"
          placeholder="Search by title, session, shift or subject"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="year-nav" role="group" aria-label="Filter by year">
        <button
          type="button"
          className="year-pill"
          aria-pressed={year === "all"}
          onClick={() => setYear("all")}
        >
          All years
        </button>
        {years.map((y) => (
          <button
            key={y}
            type="button"
            className="year-pill"
            aria-pressed={year === String(y)}
            onClick={() => setYear(String(y))}
          >
            {y}
          </button>
        ))}
      </div>

      {grouped.length === 0 && (
        <div className="notice">No papers match your search.</div>
      )}

      {grouped.map(([y, list]) => (
        <section key={y} className="year-card" aria-labelledby={`year-${y}`}>
          <h2 id={`year-${y}`}>{y} Papers</h2>
          {PAPER_TYPES.map(({ value }) => {
            const items = list.filter((p) => p.paper_type === value);
            if (!items.length) return null;
            return (
              <div key={value}>
                <h3>{PAPER_TYPE_PLURAL[value]}</h3>
                <ul className="paper-list">
                  {items.map((p) => (
                    <PaperRow key={p.id} p={p} />
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      ))}
    </>
  );
}
