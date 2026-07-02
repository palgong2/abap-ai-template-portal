import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const HISTORY_FILE_PATH = new URL("../../data/history.json", import.meta.url);

async function readHistory() {
  try {
    const fileContent = await fs.readFile(HISTORY_FILE_PATH, "utf-8");

    if (!fileContent.trim()) {
      return [];
    }

    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
}

async function saveHistoryItem(item) {
  const history = await readHistory();

  const savedItem = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ...item,
  };

  history.unshift(savedItem);

  await fs.writeFile(
    HISTORY_FILE_PATH,
    JSON.stringify(history, null, 2),
    "utf-8",
  );

  return savedItem;
}

export { HISTORY_FILE_PATH, readHistory, saveHistoryItem };
