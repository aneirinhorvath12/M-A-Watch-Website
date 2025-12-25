import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../lib/prisma";

const uploadDir = process.env.UPLOAD_DIR || "./uploads";
const publicBase = process.env.PUBLIC_BASE_URL || "http://localhost:4000";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
});

export const uploadSingle = upload.single("file");

export async function createMediaFromUpload(req: Request, res: Response) {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const ext = path.extname(req.file.originalname).toLowerCase();
  const mime = req.file.mimetype;

  const isImage = mime.startsWith("image/");
  const kind = isImage ? "IMAGE" : "DOCUMENT";

  const docType =
    !isImage && ext === ".xlsx" ? "XLSX" :
    !isImage && ext === ".pdf"  ? "PDF"  :
    !isImage ? "OTHER" : undefined;

  const url = `${publicBase}/uploads/${req.file.filename}`;

  const media = await prisma.media.create({
    data: {
      kind,
      url,
      mimeType: mime,
      fileName: req.file.originalname,
      sizeBytes: req.file.size,
      docType: docType as any,
    },
  });

  res.json({ media });
}
