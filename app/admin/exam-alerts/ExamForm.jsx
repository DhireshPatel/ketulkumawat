"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../components/exam-alerts/examAlerts.module.css";
import ExamDetailView from "../../../components/exam-alerts/ExamDetailView";
import { saveExam } from "../../../lib/examAlerts/adminClient.js";
import {
  CATEGORIES,
  PUBLICATION_STATUSES,
} from "../../../lib/examAlerts/constants";
import { slugify } from "../../../lib/examAlerts/validation";

const EMPTY = {
  title: "",
  slug: "",
  category: "",
  short_description: "",
  description: "",
  application_start: "",
  application_end: "",
  exam_date: "",
  eligibility: "",
  application_fee: "",
  application_url: "",
  official_notice_url: "",
  publication_status: "draft",
  is_featured: false,
  verified_at: "",
};

const norm = (row) => {
  const out = { ...EMPTY };
  Object.keys(EMPTY).forEach((k) => {
    if (row && row[k] !== null && row[k] !== undefined) out[k] = row[k];
  });
  return out;
};

// Defined outside the component so inputs keep focus while typing.
function Field({ name, label, children, hint, errors }) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={`f-${name}`}>
        {label}
      </label>
      {children}
      {hint ? <p className={styles.hint}>{hint}</p> : null}
      {errors[name] ? (
        <p className={styles.error} id={`e-${name}`} role="alert">
          {errors[name]}
        </p>
      ) : null}
    </div>
  );
}

export default function ExamForm({ initial }) {
  const router = useRouter();
  const id = initial?.id || null;
  const [v, setV] = useState(norm(initial));
  const [slugTouched, setSlugTouched] = useState(Boolean(id));
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState("");
  const [preview, setPreview] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (key, value) => setV((s) => ({ ...s, [key]: value }));
  const onTitle = (value) =>
    setV((s) => ({
      ...s,
      title: value,
      slug: slugTouched ? s.slug : slugify(value),
    }));

  const submit = (publication_status) => {
    setBanner("");
    startTransition(async () => {
      const res = await saveExam(id, { ...v, publication_status });
      if (res.ok) {
        router.push("/admin/exam-alerts");
        router.refresh();
      } else {
        setErrors(res.errors || {});
        setBanner(res.message || "Could not save.");
      }
    });
  };

  const common = (name) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": errors[name] ? "true" : undefined,
    "aria-describedby": errors[name] ? `e-${name}` : undefined,
  });

  if (preview) {
    return (
      <div>
        <div className={styles.adminBar}>
          <strong>Preview (not saved)</strong>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => setPreview(false)}
          >
            Back to editing
          </button>
        </div>
        <div className={styles.previewBox}>
          <ExamDetailView exam={v} today={undefined} />
        </div>
      </div>
    );
  }

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        submit(v.publication_status);
      }}
      noValidate
    >
      {banner ? (
        <div
          className={`${styles.formBanner} ${styles.formBannerError}`}
          role="alert"
        >
          {banner}
        </div>
      ) : null}

      <Field errors={errors} name="title" label="Exam title *">
        <input
          className={styles.input}
          {...common("title")}
          value={v.title}
          maxLength={200}
          onChange={(e) => onTitle(e.target.value)}
          required
        />
      </Field>

      <Field
        errors={errors}
        name="slug"
        label="URL slug"
        hint={`Page address: /exam-alerts/${v.slug || "…"}`}
      >
        <input
          className={styles.input}
          {...common("slug")}
          value={v.slug}
          maxLength={120}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
        />
      </Field>

      <Field errors={errors} name="category" label="Exam category *">
        <select
          className={styles.select}
          {...common("category")}
          value={v.category}
          onChange={(e) => set("category", e.target.value)}
          required
        >
          <option value="">Select a category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field errors={errors} name="short_description" label="Short description">
        <textarea
          className={styles.textarea}
          {...common("short_description")}
          value={v.short_description}
          maxLength={500}
          style={{ minHeight: 70 }}
          onChange={(e) => set("short_description", e.target.value)}
        />
      </Field>

      <Field errors={errors} name="description" label="Full description">
        <textarea
          className={styles.textarea}
          {...common("description")}
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className={styles.row3}>
        <Field
          errors={errors}
          name="application_start"
          label="Application start date"
        >
          <input
            className={styles.input}
            type="date"
            {...common("application_start")}
            value={v.application_start}
            onChange={(e) => set("application_start", e.target.value)}
          />
        </Field>
        <Field
          errors={errors}
          name="application_end"
          label="Application last date"
        >
          <input
            className={styles.input}
            type="date"
            {...common("application_end")}
            value={v.application_end}
            onChange={(e) => set("application_end", e.target.value)}
          />
        </Field>
        <Field errors={errors} name="exam_date" label="Exam date">
          <input
            className={styles.input}
            type="date"
            {...common("exam_date")}
            value={v.exam_date}
            onChange={(e) => set("exam_date", e.target.value)}
          />
        </Field>
      </div>

      <Field errors={errors} name="eligibility" label="Eligibility criteria">
        <textarea
          className={styles.textarea}
          {...common("eligibility")}
          value={v.eligibility}
          onChange={(e) => set("eligibility", e.target.value)}
        />
      </Field>

      <Field
        errors={errors}
        name="application_fee"
        label="Application fee information"
      >
        <input
          className={styles.input}
          {...common("application_fee")}
          value={v.application_fee}
          maxLength={1000}
          onChange={(e) => set("application_fee", e.target.value)}
        />
      </Field>

      <Field
        errors={errors}
        name="application_url"
        label="Official application URL (required to publish)"
        hint="Must be an https:// link to the official exam portal or application page."
      >
        <input
          className={styles.input}
          type="url"
          inputMode="url"
          {...common("application_url")}
          value={v.application_url}
          onChange={(e) => set("application_url", e.target.value)}
        />
      </Field>

      <Field
        errors={errors}
        name="official_notice_url"
        label="Official notification URL"
      >
        <input
          className={styles.input}
          type="url"
          inputMode="url"
          {...common("official_notice_url")}
          value={v.official_notice_url}
          onChange={(e) => set("official_notice_url", e.target.value)}
        />
      </Field>

      <div className={styles.row2}>
        <Field
          errors={errors}
          name="publication_status"
          label="Publication status"
        >
          <select
            className={styles.select}
            {...common("publication_status")}
            value={v.publication_status}
            onChange={(e) => set("publication_status", e.target.value)}
          >
            {PUBLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s[0].toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </Field>
        <Field
          errors={errors}
          name="verified_at"
          label="Last verified date (required to publish)"
          hint="The day you confirmed links and dates against the official notice."
        >
          <input
            className={styles.input}
            type="date"
            {...common("verified_at")}
            value={v.verified_at}
            onChange={(e) => set("verified_at", e.target.value)}
          />
        </Field>
      </div>

      <div className={styles.checkRow}>
        <input
          id="f-is_featured"
          type="checkbox"
          checked={v.is_featured}
          onChange={(e) => set("is_featured", e.target.checked)}
        />
        <label htmlFor="f-is_featured">Feature on homepage</label>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => setPreview(true)}
          disabled={pending}
        >
          Preview
        </button>
        <button
          type="button"
          className={styles.btnGhost}
          onClick={() => submit("draft")}
          disabled={pending}
        >
          Save draft
        </button>
        <button
          type="button"
          className={styles.btn}
          onClick={() => submit("published")}
          disabled={pending}
        >
          {pending ? "Saving…" : "Publish"}
        </button>
        <button type="submit" className={styles.btnGhost} disabled={pending}>
          Save with selected status
        </button>
      </div>
    </form>
  );
}
