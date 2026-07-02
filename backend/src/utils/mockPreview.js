export function createMockPreview(fields) {
  const rows = [];

  for (let i = 0; i < 5; i += 1) {
    const row = {};

    for (const field of fields) {
      if (field === "MATNR") {
        row[field] = `MAT-${String(i + 1).padStart(4, "0")}`;
      } else if (field === "WERKS") {
        row[field] = i % 2 === 0 ? "1000" : "2000";
      } else if (field === "MTART") {
        row[field] = i % 2 === 0 ? "FERT" : "HALB";
      } else if (field === "MEINS") {
        row[field] = "EA";
      } else if (field === "ERSDA" || field === "ERDAT") {
        row[field] = `2026-07-${String(i + 1).padStart(2, "0")}`;
      } else {
        row[field] = `${field}_${i + 1}`;
      }
    }

    rows.push(row);
  }

  return rows;
}
