export default function TerminatedScreen() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "#111",
        color: "#fff",
      }}
    >
      <h1>🚫 Test Closed</h1>
      <p>You have exceeded the maximum allowed violations.</p>
      <p>Please contact the administrator.</p>
    </div>
  );
}