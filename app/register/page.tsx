import Link from "next/link";
import { registerUser } from "./server-actions";

export default function RegisterPage() {
  return (
    <div className="card" style={{maxWidth:720}}>
      <h1>Create account</h1>
      <p className="muted">Email + password sign-up. Your role defaults to <strong>Normal</strong>.</p>

      <form action={registerUser} style={{display:"grid", gap:10}}>
        <label htmlFor="name">Name</label>
        <input className="input" id="name" name="name" placeholder="Your name" />

        <label htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" required />

        <label htmlFor="password">Password</label>
        <input className="input" id="password" name="password" type="password" minLength={8} required />

        <button className="btn" type="submit">Create account</button>
      </form>

      <hr />
      <p className="muted">
        Already have an account? <Link href="/login">Login</Link>
      </p>
    </div>
  );
}
