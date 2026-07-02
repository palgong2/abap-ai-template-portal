import { Router } from "express";
import {
  callLmStudio,
  fetchLmStudioModels,
} from "../services/lmStudioService.js";

const router = Router();

router.get("/models", async (req, res) => {
  try {
    const result = await fetchLmStudioModels();

    if (!result.ok) {
      return res.status(result.status).json({
        success: false,
        message: "LM Studio 모델 목록 조회 실패",
        detail: result.errorText,
      });
    }

    res.json({
      success: true,
      baseUrl: result.baseUrl,
      data: result.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "LM Studio 연결 중 서버 오류 발생",
      error: error.message,
    });
  }
});

router.get("/test-chat", async (req, res) => {
  try {
    const messages = [
      {
        role: "system",
        content: "You are a helpful SAP ABAP assistant.",
      },
      {
        role: "user",
        content:
          "ABAP 개발 포털 연결 테스트입니다. 한국어로 짧게 성공이라고 답변해줘.",
      },
    ];

    const answer = await callLmStudio(messages);

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "LM Studio 채팅 테스트 중 오류 발생",
      error: error.message,
    });
  }
});

export default router;
