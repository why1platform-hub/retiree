"use server";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function approveBooking(formData: FormData) {
  const session = await requireRole(["Instructor", "Admin"]);
  const user = session.user as any;
  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) return;

  await prisma.consultantBooking.update({
    where: { id: bookingId, consultantId: user.id },
    data: { status: "Approved", decisionAt: new Date(), decisionBy: user.id }
  });

  redirect("/instructor/bookings");
}

export async function rejectBooking(formData: FormData) {
  const session = await requireRole(["Instructor", "Admin"]);
  const user = session.user as any;
  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) return;

  await prisma.consultantBooking.update({
    where: { id: bookingId, consultantId: user.id },
    data: { status: "Rejected", decisionAt: new Date(), decisionBy: user.id }
  });

  redirect("/instructor/bookings");
}
