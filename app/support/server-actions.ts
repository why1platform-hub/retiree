"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function submitInquiry(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  if (!subject || !message) return;

  await prisma.inquiry.create({
    data: { userId: user.id, subject, message, status: "Open" }
  });

  redirect("/support");
}
