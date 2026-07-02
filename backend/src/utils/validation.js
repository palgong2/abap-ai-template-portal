export function validateAlvInput(body) {
  const templateType = String(body.templateType || "ALV_REPORT")
    .trim()
    .toUpperCase();
  const programName = String(body.programName || "")
    .trim()
    .toUpperCase();
  const title = String(body.title || "").trim();
  const tableName = String(body.tableName || "")
    .trim()
    .toUpperCase();
  const packageName = String(body.packageName || "$TMP")
    .trim()
    .toUpperCase();
  const fields = body.fields;
  const whereCondition = String(body.whereCondition || "").trim();
  const extraRequirements = String(body.extraRequirements || "").trim();

  if (templateType !== "ALV_REPORT") {
    throw new Error("현재 1차 MVP에서는 ALV_REPORT 템플릿만 지원합니다.");
  }

  if (!programName) {
    throw new Error("프로그램명을 입력해야 합니다.");
  }

  if (!programName.startsWith("ZR_") && !programName.startsWith("ZAI_")) {
    throw new Error("프로그램명은 ZR_ 또는 ZAI_ 로 시작해야 합니다.");
  }

  if (!title) {
    throw new Error("제목을 입력해야 합니다.");
  }

  if (!tableName) {
    throw new Error("테이블명을 입력해야 합니다.");
  }

  if (!Array.isArray(fields) || fields.length === 0) {
    throw new Error("필드 목록은 배열 형태로 최소 1개 이상 입력해야 합니다.");
  }

  const cleanFields = fields
    .map((field) =>
      String(field || "")
        .trim()
        .toUpperCase(),
    )
    .filter((field) => field.length > 0);

  if (cleanFields.length === 0) {
    throw new Error("유효한 필드명이 없습니다.");
  }

  const abapNameRegex = /^[A-Z][A-Z0-9_]*$/;

  if (!abapNameRegex.test(programName)) {
    throw new Error("프로그램명 형식이 올바르지 않습니다.");
  }

  if (!abapNameRegex.test(tableName)) {
    throw new Error("테이블명 형식이 올바르지 않습니다.");
  }

  for (const field of cleanFields) {
    if (!abapNameRegex.test(field)) {
      throw new Error(`필드명 형식이 올바르지 않습니다: ${field}`);
    }
  }

  const forbiddenWords = [
    "DELETE",
    "UPDATE",
    "INSERT",
    "MODIFY",
    "COMMIT",
    "ROLLBACK",
    "CALL TRANSACTION",
    "SUBMIT",
    "EXEC",
    "EXECUTE",
  ];

  const upperWhere = whereCondition.toUpperCase();

  for (const word of forbiddenWords) {
    if (upperWhere.includes(word)) {
      throw new Error(`WHERE 조건에 위험 키워드가 포함되어 있습니다: ${word}`);
    }
  }

  return {
    templateType,
    programName,
    title,
    packageName,
    tableName,
    fields: cleanFields,
    whereCondition,
    extraRequirements,
  };
}
