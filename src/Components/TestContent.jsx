export default function TestContent({
  violations,
  maxViolations,
  warning,
}) {
  return (
    <div style={{ padding: "20px" }}>
      <h2>Secure Assessment</h2>
      <p>
        Violations: {violations} / {maxViolations}
      </p>

      {warning && (
        <div style={{ color: "red", fontWeight: "bold" }}>
          {warning}
        </div>
      )}

      <p>Question: What is React?</p>
      <textarea rows="4" cols="50" />

      <br />
      <br />
      <button>Submit Test</button>
    </div>
  );
}