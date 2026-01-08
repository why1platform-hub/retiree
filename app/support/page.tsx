import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { submitInquiry } from "./server-actions";

export default async function SupportPage() {
  await requireUser();

  const [announcements, faqs] = await Promise.all([
    prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishFrom: "desc" },
      take: 10
    }),
    prisma.faqItem.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 50
    })
  ]);

  return (
    <div className="grid">
      <div className="card">
        <h1>Support</h1>
        <p className="muted">공지사항, FAQ, 1:1 문의</p>

        <h2>Announcements</h2>
        <table className="table" aria-label="Announcements">
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

        <hr />

        <h2>FAQ</h2>
        {faqs.length === 0 ? <p className="muted">No FAQs.</p> : (
          <div className="grid" aria-label="FAQ items">
            {faqs.map(f => (
              <details key={f.id} className="card" style={{background:"#fff"}}>
                <summary><strong>{f.question}</strong></summary>
                <p style={{marginBottom:0}}>{f.answer}</p>
              </details>
            ))}
          </div>
        )}
      </div>

      <aside className="card">
        <h2>1:1 Inquiry</h2>
        <p className="muted">Send a question to the admin team.</p>

        <form action={submitInquiry} style={{display:"grid", gap:10}}>
          <label htmlFor="subject">Subject</label>
          <input className="input" id="subject" name="subject" required />
          <label htmlFor="message">Message</label>
          <textarea className="input" id="message" name="message" rows={6} required />
          <button className="btn" type="submit">Submit</button>
        </form>
      </aside>
    </div>
  );
}
