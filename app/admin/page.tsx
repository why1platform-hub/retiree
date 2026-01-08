import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { setUserRole, publishAnnouncement, addFaq, closeInquiry } from "./server-actions";

export default async function AdminPage() {
  const session = const session = await requireRole(["Admin"]);

  const user = session.user as any;

  const [users, announcements, faqs, inquiries] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.announcement.findMany({ orderBy: { publishFrom: "desc" }, take: 10 }),
    prisma.faqItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }], take: 20 }),
    prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 20, include: { user: true } })
  ]);

  return (
    <div className="grid">
      <div className="card">
        <h1>Admin Console</h1>
        <p className="muted">Manage users, announcements, FAQs, and inquiries.</p>
      </div>

      <div className="card">
        <h2>Users & roles</h2>
        <table className="table">
          <thead><tr><th>Email</th><th>Role</th><th>Change role</th></tr></thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td><span className="badge">{u.role}</span></td>
                <td>
                  <form action={setUserRole} style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                    <input type="hidden" name="userId" value={u.id} />
                    <select className="input" name="role" defaultValue={u.role} style={{maxWidth:220}}>
                      <option value="Normal">Normal</option>
                      <option value="Instructor">Instructor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button className="btn" type="submit">Save</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="muted">
          Password reset is not implemented in this lightweight demo auth. If you want real auth, we can add NextAuth or email/password.
        </p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2>Announcements</h2>

          <form action={publishAnnouncement} style={{display:"grid", gap:10}}>
            <label htmlFor="title">Title</label>
            <input className="input" id="title" name="title" required />
            <label htmlFor="badge">Badge</label>
            <input className="input" id="badge" name="badge" placeholder="e.g., 긴급 / 안내" />
            <label htmlFor="body">Body</label>
            <textarea className="input" id="body" name="body" rows={4} required />
            <button className="btn" type="submit">Publish</button>
          </form>

          <hr />

          <table className="table">
            <thead><tr><th>Badge</th><th>Title</th></tr></thead>
            <tbody>
              {announcements.map(a => (
                <tr key={a.id}>
                  <td>{a.badge ? <span className="badge primary">{a.badge}</span> : <span className="badge">Info</span>}</td>
                  <td>{a.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>FAQ</h2>

          <form action={addFaq} style={{display:"grid", gap:10}}>
            <label htmlFor="q">Question</label>
            <input className="input" id="q" name="question" required />
            <label htmlFor="a">Answer</label>
            <textarea className="input" id="a" name="answer" rows={4} required />
            <button className="btn" type="submit">Add</button>
          </form>

          <hr />

          <div className="grid">
            {faqs.map(f => (
              <div key={f.id} className="card" style={{background:"#fff"}}>
                <strong>{f.question}</strong>
                <p style={{marginBottom:0}} className="muted">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Inquiries</h2>
        {inquiries.length === 0 ? <p className="muted">No inquiries.</p> : (
          <table className="table">
            <thead><tr><th>User</th><th>Subject</th><th>Status</th><th /></tr></thead>
            <tbody>
              {inquiries.map(i => (
                <tr key={i.id}>
                  <td>{i.user?.email ?? "Anonymous"}</td>
                  <td>
                    <strong>{i.subject}</strong><br />
                    <span className="muted">{i.message}</span>
                  </td>
                  <td><span className="badge">{i.status}</span></td>
                  <td>
                    {i.status !== "Closed" ? (
                      <form action={closeInquiry}>
                        <input type="hidden" name="inquiryId" value={i.id} />
                        <button className="btn" type="submit">Close</button>
                      </form>
                    ) : <span className="muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Instructor tools</h2>
        <p><a href="/instructor/bookings">Go to booking approvals →</a></p>
      </div>
    </div>
  );
}
