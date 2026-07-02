import { callLmStudio } from "./lmStudioService.js";

function buildAiNoteMessages(input) {
  return [
    {
      role: "system",
      content:
        "You are a SAP ABAP portfolio assistant. Explain generated ABAP template code in Korean. Do not generate code.",
    },
    {
      role: "user",
      content: `
다음 ALV Report 템플릿 생성 결과를 포트폴리오 설명용으로 짧게 설명해줘.

프로그램명: ${input.programName}
제목: ${input.title}
테이블명: ${input.tableName}
필드 목록: ${input.fields.join(", ")}
WHERE 조건: ${input.whereCondition || "없음"}
추가 요구사항: ${input.extraRequirements || "없음"}

설명 조건:
1. 한국어로 작성
2. 3~5문장 정도
3. "AI가 전체 코드를 자유 생성했다"는 표현 금지
4. "서버 템플릿 기반 생성 + AI 보조 설명" 구조가 드러나게 작성
5. 면접 포트폴리오에서 설명하기 좋은 문장으로 작성
`.trim(),
    },
  ];
}

export async function createAiNote(input) {
  try {
    const messages = buildAiNoteMessages(input);
    const note = await callLmStudio(messages);

    return note.trim();
  } catch (error) {
    return "AI 보조 설명 생성에 실패했지만, 서버 템플릿 기반 ABAP 코드는 정상 생성되었습니다.";
  }
}
