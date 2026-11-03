"use client";

export default function PyqError({ reset }) {
  return (
    <div className="notice error" role="alert">
      <strong>Something went wrong.</strong> We could not load this page.{" "}
      <button
        type="button"
        className="btn btn-brown btn-small"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}
