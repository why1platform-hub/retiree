"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function askQuestion(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  if (!title || !body) return;

  const q = await prisma.question.create({
    data: { title, body, userId: user.id }
  });

  redirect(`/qa/${q.id}`);
}
