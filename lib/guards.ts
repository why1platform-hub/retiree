import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return session;
}

export async function requireRole(roles: Array<"Normal" | "Instructor" | "Admin">) {
  const session = await requireUser();
  const role = (session.user as any).role as "Normal" | "Instructor" | "Admin" | undefined;
  if (!role || !roles.includes(role)) redirect("/denied");
  return session;
}
