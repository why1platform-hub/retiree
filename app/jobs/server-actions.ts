"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function applyJob(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const jobId = String(formData.get("jobId") ?? "");
  if (!jobId) return;

  await prisma.jobApplication.upsert({
    where: { jobId_userId: { jobId, userId: user.id } },
    update: {},
    create: { jobId, userId: user.id, status: "Submitted" }
  });

  redirect("/my-activity");
}
