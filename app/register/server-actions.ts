"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function registerUser(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  const name = String(formData.get("name") ?? "").trim() || null;

  if (!email || password.length < 8) return;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    redirect("/login?error=EmailAlreadyExists");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      role: "Normal",
      passwordHash
    }
  });

  redirect("/login?registered=1");
}
