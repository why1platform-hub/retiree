"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function enrollCourse(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const courseId = String(formData.get("courseId") ?? "");
  if (!courseId) return;

  await prisma.courseEnrollment.upsert({
    where: { courseId_userId: { courseId, userId: user.id } },
    update: {},
    create: { courseId, userId: user.id, progressPercent: 0 }
  });

  redirect("/my-activity");
}
