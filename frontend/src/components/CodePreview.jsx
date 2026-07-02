import Editor from "@monaco-editor/react";

export default function CodePreview({ generatedCode, programName }) {
  if (!generatedCode) {
    return null;
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(generatedCode);
      alert("ABAP 코드가 클립보드에 복사되었습니다.");
    } catch (error) {
      alert("복사 실패: " + error.message);
    }
  }

  function handleDownloadCode() {
    const fileName = `${programName || "generated_abap"}.abap`;

    const blob = new Blob([generatedCode], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ marginTop: "32px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>생성된 ABAP 코드</h2>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleCopyCode}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            코드 복사
          </button>

          <button
            onClick={handleDownloadCode}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            다운로드
          </button>
        </div>
      </div>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "8px",
          overflow: "hidden",
          textAlign: "left",
        }}
      >
        <Editor
          height="600px"
          defaultLanguage="abap"
          value={generatedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
            fontSize: 14,
            lineHeight: 22,
            wordWrap: "off",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
