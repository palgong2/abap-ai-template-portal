export default function MockPreviewTable({ mockPreview }) {
  if (!mockPreview || mockPreview.length === 0) {
    return null;
  }

  return (
    <div style={{ marginTop: "32px" }}>
      <h2>Mock ALV 미리보기</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
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
  );
}
