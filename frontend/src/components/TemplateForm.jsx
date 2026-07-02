export default function TemplateForm({
  formData,
  loading,
  onChange,
  onGenerate,
}) {
  return (
    <div style={{ display: "grid", gap: "12px", maxWidth: "720px" }}>
      <label>
        템플릿 종류
        <select
          name="templateType"
          value={formData.templateType}
          onChange={onChange}
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
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        제목
        <input
          name="title"
          value={formData.title}
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        패키지명
        <input
          name="packageName"
          value={formData.packageName}
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        테이블명
        <input
          name="tableName"
          value={formData.tableName}
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        필드 목록
        <input
          name="fieldsText"
          value={formData.fieldsText}
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        WHERE 조건
        <input
          name="whereCondition"
          value={formData.whereCondition}
          onChange={onChange}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <label>
        추가 요구사항
        <textarea
          name="extraRequirements"
          value={formData.extraRequirements}
          onChange={onChange}
          rows={4}
          style={{ width: "100%", padding: "8px", marginTop: "4px" }}
        />
      </label>

      <button
        onClick={onGenerate}
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
  );
}
