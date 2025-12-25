import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function listPublished(_req: Request, res: Response) {
  const reports = await prisma.report.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: { id: true, slug: true, title: true, deck: true, type: true, publishedAt: true, heroImageId: true },
  });
  res.json({ reports });
}

export async function getPublishedBySlug(req: Request, res: Response) {
  const report = await prisma.report.findUnique({
    where: { slug: req.params.slug },
    include: { attachments: { include: { media: true }, orderBy: { order: "asc" } }, heroImage: true },
  });
  if (!report || report.status !== "PUBLISHED") return res.status(404).json({ error: "Not found" });
  res.json({ report });
}
