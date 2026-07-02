import { Router } from "express";
import { validateAlvInput } from "../utils/validation.js";
import { buildSafeAlvReportCode } from "../templates/alvTemplate.js";
import { createMockPreview } from "../utils/mockPreview.js";
import { createAiNote } from "../services/aiNoteService.js";
import { saveHistoryItem } from "../services/historyService.js";

const router = Router();

router.post("/generate/alv", async (req, res) => {
  try {
    const input = validateAlvInput(req.body);

    const code = buildSafeAlvReportCode(input);
    const mockPreview = createMockPreview(input.fields);
    const aiNote = await createAiNote(input);

    const savedItem = await saveHistoryItem({
      templateType: input.templateType,
      generationMode: "SERVER_TEMPLATE",
      programName: input.programName,
      title: input.title,
      packageName: input.packageName,
      tableName: input.tableName,
      fields: input.fields,
      whereCondition: input.whereCondition,
      extraRequirements: input.extraRequirements,
      code,
      mockPreview,
      aiNote,
    });

    res.json({
      success: true,
      message: "ALV Report 템플릿 코드 생성 및 이력 저장 성공",
      data: savedItem,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "ALV Report 코드 생성 실패",
      error: error.message,
    });
  }
});

export default router;
