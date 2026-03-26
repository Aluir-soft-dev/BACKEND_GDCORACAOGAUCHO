import fs from "node:fs";
import path from "node:path";

export function removeUploadedFile(relativePath?: string | null) {
  if (!relativePath) return;
  const normalized = relativePath.replace(/^\/uploads\//, "");
  const filePath = path.resolve(process.cwd(), "uploads", normalized);
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, () => undefined);
  }
}