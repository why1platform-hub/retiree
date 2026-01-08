"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function setUserRole(formData: FormData) {
  await requireRole(["Admin"]);
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  if (!userId || !role) return;

  if (!["Normal", "Instructor", "Admin"].includes(role)) return;

  await prisma.user.update({ where: { id: userId }, data: { role: role as any } });
  redirect("/admin");
}

export async function publishAnnouncement(formData: FormData) {
  await requireRole(["Admin"]);
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim() || null;

  if (!title || !body) return;

  await prisma.announcement.create({
    data: { title, body, badge, isPublished: true, publishFrom: new Date() }
  });

  redirect("/support");
}

export async function addFaq(formData: FormData) {
  await requireRole(["Admin"]);
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  if (!question || !answer) return;

  await prisma.faqItem.create({
    data: { question, answer, isPublished: true, sortOrder: 0 }
  });

  redirect("/support");
}

export async function closeInquiry(formData: FormData) {
  await requireRole(["Admin"]);
  const inquiryId = String(formData.get("inquiryId") ?? "");
  if (!inquiryId) return;

  await prisma.inquiry.update({ where: { id: inquiryId }, data: { status: "Closed" } });
  redirect("/admin");
}
