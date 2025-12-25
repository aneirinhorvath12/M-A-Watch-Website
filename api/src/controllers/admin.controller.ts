import { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { AuthedRequest } from "../middleware/auth";

const CreateSchema = z.object({
  title: z.string().min(3),
  deck: z.string().optional(),
  type: z.enum(["FINANCIAL", "LEGAL", "INTERVIEW"]),
  slug: z.string().min(3),
  content: z.any().default({}), // keep flexible for now
  heroImageId: z.string().optional(),
});

const UpdateSchema = CreateSchema.partial();

const AttachSchema = z.object({
  mediaId: z.string(),
  label: z.string().optional(),
  order: z.number().int().optional(),
});

export async function listAllReports(_req: AuthedRequest, res: Response) {
  const reports = await prisma.report.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, type: true, status: true, updatedAt: true, publishedAt: true },
  });
  res.json({ reports });
}

export async function createReport(req: AuthedRequest, res: Response) {
  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const report = await prisma.report.create({
    data: { ...parsed.data, authorId: req.user!.userId, status: "DRAFT" },
  });
  res.json({ report });
}

export async function updateReport(req: AuthedRequest, res: Response) {
  const parsed = UpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const report = await prisma.report.update({ where: { id: req.params.id }, data: parsed.data });
  res.json({ report });
}

export async function publishReport(_req: AuthedRequest, res: Response) {
  const report = await prisma.report.update({
    where: { id: _req.params.id },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
  res.json({ report });
}

export async function attachMedia(req: AuthedRequest, res: Response) {
  const parsed = AttachSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const link = await prisma.reportMedia.upsert({
    where: { reportId_mediaId: { reportId: req.params.id, mediaId: parsed.data.mediaId } },
    update: { label: parsed.data.label, order: parsed.data.order ?? 0 },
    create: { reportId: req.params.id, mediaId: parsed.data.mediaId, label: parsed.data.label, order: parsed.data.order ?? 0 },
  });

  res.json({ attachment: link });
}
