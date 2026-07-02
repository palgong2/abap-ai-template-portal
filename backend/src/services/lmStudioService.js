export async function callLmStudio(messages) {
  const baseUrl = process.env.LM_STUDIO_BASE_URL;
  const model = process.env.LM_STUDIO_MODEL;
  const apiKey = process.env.LM_STUDIO_API_KEY || "lm-studio";

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: Number(process.env.AI_TEMPERATURE || 0.2),
      max_tokens: Number(process.env.AI_MAX_TOKENS || 5000),
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `LM Studio 호출 실패: HTTP ${response.status} / ${errorText}`,
    );
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("LM Studio 응답에서 content를 찾을 수 없습니다.");
  }

  return content;
}

export async function fetchLmStudioModels() {
  const baseUrl = process.env.LM_STUDIO_BASE_URL;
  const apiKey = process.env.LM_STUDIO_API_KEY || "lm-studio";

  const response = await fetch(`${baseUrl}/models`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    return {
      ok: false,
      status: response.status,
      errorText,
      baseUrl,
    };
  }

  const data = await response.json();

  return {
    ok: true,
    baseUrl,
    data,
  };
}
