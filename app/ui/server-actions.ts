"use server";

import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";

// Note: signOut from next-auth/react is client-side.
// For server actions, we simply redirect to the NextAuth signout endpoint.
export async function logout() {
  // NextAuth signout endpoint will clear the session cookie
  redirect("/api/auth/signout");
}
