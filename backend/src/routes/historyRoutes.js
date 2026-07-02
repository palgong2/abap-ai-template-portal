import { Router } from "express";
import { readHistory } from "../services/historyService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const history = await readHistory();

    res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "생성 이력 조회 실패",
      error: error.message,
    });
  }
});

export default router;
