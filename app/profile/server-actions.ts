"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const session = await requireUser();
  const user = session.user as any;
  const headline = String(formData.get("headline") ?? "");
  const bio = String(formData.get("bio") ?? "");
  const location = String(formData.get("location") ?? "");

  await prisma.userProfile.upsert({
    where: { userId: user.id },
    update: { headline, bio, location },
    create: { userId: user.id, headline, bio, location }
  });

  redirect("/profile");
}
