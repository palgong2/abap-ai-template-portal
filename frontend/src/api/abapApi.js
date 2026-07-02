const API_BASE_URL = "http://localhost:4000";

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || "요청 실패");
  }

  return data;
}

export async function checkBackendHealth() {
  const data = await requestJson("/api/health");
  return data;
}

export async function generateAlvReport(requestBody) {
  return requestJson("/api/generate/alv", {
    method: "POST",
    body: JSON.stringify(requestBody),
  });
}

export async function loadGenerationHistory() {
  return requestJson("/api/history");
}

export { API_BASE_URL };
