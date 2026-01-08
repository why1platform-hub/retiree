"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function requestBooking(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const availabilityId = String(formData.get("availabilityId") ?? "");
  const consultantId = String(formData.get("consultantId") ?? "");
  const topic = String(formData.get("topic") ?? "").trim();

  if (!availabilityId || !consultantId || !topic) return;

  await prisma.consultantBooking.create({
    data: {
      availabilityId,
      requesterId: user.id,
      consultantId,
      topic,
      status: "Requested"
    }
  });

  redirect("/my-activity");
}
