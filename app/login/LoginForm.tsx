"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginForm() {
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const error = params.get("error");
  const registered = params.get("registered");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/"
    });
    setLoading(false);
    return res;
  }

  return (
    <div className="card" style={{maxWidth:720}}>
      <h1>Login</h1>
      <p className="muted">Use your email and password.</p>

      {registered ? <p className="badge primary">Account created. Please login.</p> : null}
      {error ? <p className="badge">Login failed. Check your email/password.</p> : null}

      <form onSubmit={onSubmit} style={{display:"grid", gap:10}}>
        <label htmlFor="email">Email</label>
        <input className="input" id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />

        <label htmlFor="password">Password</label>
        <input className="input" id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />

        <button className="btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>

      <hr />
      <p className="muted">
        New here? <Link href="/register">Create an account</Link>
      </p>

      <details className="card" style={{background:"#fff"}}>
        <summary><strong>Demo accounts (seeded)</strong></summary>
        <ul>
          <li>admin@demo.com / <code>Admin1234!</code></li>
          <li>instructor@demo.com / <code>Instructor1234!</code></li>
          <li>user@demo.com / <code>User1234!</code></li>
        </ul>
      </details>
    </div>
  );
}
