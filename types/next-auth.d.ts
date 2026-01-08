import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      role?: "Normal" | "Instructor" | "Admin";
      email?: string | null;
      name?: string | null;
    };
  }
}
