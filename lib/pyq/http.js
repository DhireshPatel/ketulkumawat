import { NextResponse } from "next/server";

export const json = (body, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function readJson(request) {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? body
      : null;
  } catch {
    return null;
  }
}

// Postgres error codes -> friendly HTTP responses
export function dbError(error, fallback = "Database error.") {
  if (error?.code === "23505")
    return json(
      {
        error: "A record with the same unique value already exists.",
        code: "duplicate",
      },
      409,
    );
  if (error?.code === "23503")
    return json(
      {
        error: "This record is still referenced by other data.",
        code: "in_use",
      },
      409,
    );
  if (error?.code === "23514")
    return json(
      { error: "A value is outside the allowed range.", code: "check" },
      400,
    );
  console.error("[pyq] db error:", error?.code, error?.message);
  return json({ error: fallback }, 500);
}

export function validationError(errors) {
  return json({ error: "Please fix the highlighted fields.", errors }, 400);
}
