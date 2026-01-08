"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function createThread(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;

  const thread = await prisma.discussionThread.create({
    data: { title, userId: user.id }
  });

  redirect(`/community/${thread.id}`);
}
