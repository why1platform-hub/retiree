import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LogoutButton } from "./ui/logout-button";

export const metadata = {
  title: "RetireeLMS",
  description: "Retiree support platform: programs, consulting, learning, jobs, and support."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user as any | undefined;

  return (
    <html lang="en">
      <body>
        <header className="topbar" role="banner">
          <div className="container topbar-inner">
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <Link className="brand" href="/">RetireeLMS</Link>
              <nav className="nav" aria-label="Primary">
                <Link href="/programs">Programs</Link>
                <Link href="/my-activity">My Activity</Link>
                <Link href="/jobs">Jobs</Link>
                <Link href="/learning">Learning</Link>
                <Link href="/support">Support</Link>
                <Link href="/community">Discussion</Link>
                <Link href="/qa">Q&amp;A</Link>
                <Link href="/profile">My Profile</Link>
                <Link href="/instructor/bookings">Instructor</Link>
                <Link href="/admin">Admin</Link>
              </nav>
            </div>

            <div style={{display:"flex", alignItems:"center", gap:10}}>
              {user ? (
                <>
                  <span className="badge primary" aria-label="Current user">
                    {user.email} • {user.role}
                  </span>
                  <LogoutButton />
                </>
              ) : (
                <Link className="btn" href="/login">Login</Link>
              )}
            </div>
          </div>
        </header>

        <main className="container" role="main">
          {children}
        </main>

        <footer className="container" role="contentinfo">
          <p className="muted">© {new Date().getFullYear()} RetireeLMS</p>
        </footer>
      </body>
    </html>
  );
}
