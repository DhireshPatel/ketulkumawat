export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="exam-grid" style={{ marginTop: 120 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" />
        ))}
      </div>
    </div>
  );
}
