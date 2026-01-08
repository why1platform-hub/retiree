"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function applyProgram(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const programId = String(formData.get("programId") ?? "");
  if (!programId) return;

  await prisma.programApplication.upsert({
    where: { programId_userId: { programId, userId: user.id } },
    update: {},
    create: { programId, userId: user.id, status: "Submitted" }
  });

  redirect("/my-activity");
}
