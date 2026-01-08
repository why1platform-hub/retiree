"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function addAnswer(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const questionId = String(formData.get("questionId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!questionId || !body) return;

  await prisma.answer.create({
    data: { questionId, userId: user.id, body }
  });

  await prisma.question.update({
    where: { id: questionId },
    data: { updatedAt: new Date() }
  });

  redirect(`/qa/${questionId}`);
}
