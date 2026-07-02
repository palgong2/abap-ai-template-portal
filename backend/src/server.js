import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import alvRoutes from "./routes/alvRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import lmStudioRoutes from "./routes/lmStudioRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ABAP AI Template Portal Backend is running",
    port: PORT,
    lmStudioBaseUrl: process.env.LM_STUDIO_BASE_URL,
    lmStudioModel: process.env.LM_STUDIO_MODEL,
  });
});

app.use("/api/lmstudio", lmStudioRoutes);
app.use("/api", alvRoutes);
app.use("/api/history", historyRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || error.status || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
