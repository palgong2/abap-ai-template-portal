export default function AiNoteBox({ aiNote }) {
  if (!aiNote) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: "32px",
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f8fafc",
        textAlign: "left",
      }}
    >
      <h2>AI 보조 설명</h2>
      <p style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{aiNote}</p>
    </div>
  );
}
