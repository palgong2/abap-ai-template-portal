export default function HistoryList({
  historyList,
  selectedHistoryId,
  onLoadHistory,
  onSelectHistory,
}) {
  return (
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
          onClick={onLoadHistory}
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
              onClick={() => onSelectHistory(item)}
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
  );
}
