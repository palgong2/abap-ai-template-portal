import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const [backendStatus, setBackendStatus] = useState("확인 중...");
  const [formData, setFormData] = useState({
    templateType: "ALV_REPORT",
    programName: "ZR_AI_MAT_ALV",
    title: "Material Master ALV Report",
    packageName: "$TMP",
    tableName: "MARA",
    fieldsText: "MATNR, MTART, MEINS, ERSDA",
    whereCondition: "MTART = 'FERT'",
    extraRequirements:
      "Show message when no data exists and optimize ALV columns.",
  });

  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [mockPreview, setMockPreview] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [aiNote, setAiNote] = useState("");
  const [historyList, setHistoryList] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/health")
      .then((response) => response.json())
      .then(() => {
        setBackendStatus("연결 성공");
      })
      .catch((error) => {
        setBackendStatus(`연결 실패: ${error.message}`);
      });
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleGenerate() {
    try {
      setLoading(true);
      setErrorMessage("");
      setGeneratedCode("");
      setMockPreview([]);

      const fields = formData.fieldsText
        .split(",")
        .map((field) => field.trim())
        .filter((field) => field.length > 0);

      const requestBody = {
        templateType: formData.templateType,
        programName: formData.programName,
        title: formData.title,
        packageName: formData.packageName,
        tableName: formData.tableName,
        fields,
        whereCondition: formData.whereCondition,
        extraRequirements: formData.extraRequirements,
      };

      const response = await fetch("http://localhost:4000/api/generate/alv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.message || "코드 생성 실패");
      }

      setGeneratedCode(result.data.code);
      setMockPreview(result.data.mockPreview || []);
      setAiNote(result.data.aiNote || "");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
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
    const fileName = `${formData.programName || "generated_abap"}.abap`;

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

  async function handleLoadHistory() {
    try {
      const response = await fetch("http://localhost:4000/api/history");
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "이력 조회 실패");
      }

      setHistoryList(result.data || []);
    } catch (error) {
      alert("이력 조회 실패: " + error.message);
    }
  }

  function handleSelectHistory(item) {
    setSelectedHistoryId(item.id);

    setGeneratedCode(item.code || "");
    setMockPreview(item.mockPreview || []);
    setAiNote(item.aiNote || "");

    setFormData({
      templateType: item.templateType || "ALV_REPORT",
      programName: item.programName || "",
      title: item.title || "",
      packageName: item.packageName || "$TMP",
      tableName: item.tableName || "",
      fieldsText: item.fields ? item.fields.join(", ") : "",
      whereCondition: item.whereCondition || "",
      extraRequirements: item.extraRequirements || "",
    });
  }

  return (
    <div style={{ padding: "32px", fontFamily: "Arial, sans-serif" }}>
      <h1>AI 기반 ABAP 템플릿 생성 포털</h1>

      <p>
        <strong>Backend Status:</strong> {backendStatus}
      </p>

      <hr />

      <h2>ALV Report 템플릿 생성</h2>

      <div style={{ display: "grid", gap: "12px", maxWidth: "720px" }}>
        <label>
          템플릿 종류
          <select
            name="templateType"
            value={formData.templateType}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="ALV_REPORT">ALV Report</option>
            <option value="CDS_VIEW" disabled>
              CDS View - 추후 지원
            </option>
            <option value="CLASS" disabled>
              Class - 추후 지원
            </option>
            <option value="SIMPLE_REPORT" disabled>
              Simple Report - 추후 지원
            </option>
          </select>
        </label>

        <label>
          프로그램명
          <input
            name="programName"
            value={formData.programName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          제목
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          패키지명
          <input
            name="packageName"
            value={formData.packageName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          테이블명
          <input
            name="tableName"
            value={formData.tableName}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          필드 목록
          <input
            name="fieldsText"
            value={formData.fieldsText}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          WHERE 조건
          <input
            name="whereCondition"
            value={formData.whereCondition}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <label>
          추가 요구사항
          <textarea
            name="extraRequirements"
            value={formData.extraRequirements}
            onChange={handleChange}
            rows={4}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            padding: "12px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "생성 중..." : "ALV Report 코드 생성"}
        </button>
      </div>

      {errorMessage && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            backgroundColor: "#ffe5e5",
            border: "1px solid #ff9999",
          }}
        >
          <strong>오류:</strong> {errorMessage}
        </div>
      )}

      {mockPreview.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <h2>Mock ALV 미리보기</h2>

          <table
            border="1"
            cellPadding="8"
            style={{ borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                {Object.keys(mockPreview[0]).map((field) => (
                  <th key={field}>{field}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockPreview.map((row, index) => (
                <tr key={index}>
                  {Object.keys(row).map((field) => (
                    <td key={field}>{row[field]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {aiNote && (
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
      )}

      {generatedCode && (
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
      )}

      <div style={{ marginTop: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>생성 이력</h2>

          <button
            onClick={handleLoadHistory}
            style={{
              padding: "8px 12px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            이력 불러오기
          </button>
        </div>

        {historyList.length === 0 ? (
          <p>아직 불러온 생성 이력이 없습니다.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {historyList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectHistory(item)}
                style={{
                  border:
                    selectedHistoryId === item.id
                      ? "2px solid #2563eb"
                      : "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor:
                    selectedHistoryId === item.id ? "#eff6ff" : "#fafafa",
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <strong>{item.programName}</strong>
                <div>템플릿: {item.templateType}</div>
                <div>패키지: {item.packageName || "$TMP"}</div>
                <div>테이블: {item.tableName}</div>
                <div>필드: {item.fields?.join(", ")}</div>
                <div>생성일: {item.createdAt}</div>
                {selectedHistoryId === item.id && (
                  <div
                    style={{
                      marginTop: "8px",
                      color: "#2563eb",
                      fontWeight: "bold",
                    }}
                  >
                    현재 선택된 이력입니다.
                  </div>
                )}
                <div
                  style={{ marginTop: "8px", fontSize: "13px", color: "#666" }}
                >
                  클릭하면 해당 코드와 Mock Preview를 다시 불러옵니다.
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
