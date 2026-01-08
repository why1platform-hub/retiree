"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function addPost(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  if (!threadId || !body) return;

  const thread = await prisma.discussionThread.findUnique({ where: { id: threadId } });
  if (!thread || thread.locked) redirect(`/community/${threadId}`);

  await prisma.discussionPost.create({
    data: { threadId, userId: user.id, body }
  });

  // Update updatedAt on thread
  await prisma.discussionThread.update({
    where: { id: threadId },
    data: { updatedAt: new Date() }
  });

  redirect(`/community/${threadId}`);
}
