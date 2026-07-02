import { useEffect, useState } from "react";
import {
  checkBackendHealth,
  generateAlvReport,
  loadGenerationHistory,
} from "./api/abapApi";
import TemplateForm from "./components/TemplateForm";
import MockPreviewTable from "./components/MockPreviewTable";
import AiNoteBox from "./components/AiNoteBox";
import CodePreview from "./components/CodePreview";
import HistoryList from "./components/HistoryList";

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
    checkBackendHealth()
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

      const result = await generateAlvReport(requestBody);

      if (!result.success) {
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

  async function handleLoadHistory() {
    try {
      const result = await loadGenerationHistory();

      if (!result.success) {
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

      <TemplateForm
        formData={formData}
        loading={loading}
        onChange={handleChange}
        onGenerate={handleGenerate}
      />

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

      <MockPreviewTable mockPreview={mockPreview} />

      <AiNoteBox aiNote={aiNote} />

      <CodePreview
        generatedCode={generatedCode}
        programName={formData.programName}
      />

      <HistoryList
        historyList={historyList}
        selectedHistoryId={selectedHistoryId}
        onLoadHistory={handleLoadHistory}
        onSelectHistory={handleSelectHistory}
      />
    </div>
  );
}

export default App;
