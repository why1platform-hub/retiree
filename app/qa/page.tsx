import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { askQuestion } from "./server-actions";

export default async function QaPage() {
  await requireUser();

  const questions = await prisma.question.findMany({
    include: { user: true, _count: { select: { answers: true } } },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  return (
    <div className="grid">
      <div className="card">
        <h1>Q&amp;A</h1>
        <p className="muted">Ask questions and get answers from the community and instructors.</p>

        <form action={askQuestion} style={{display:"grid", gap:10, maxWidth:720}}>
          <label htmlFor="title">Question</label>
          <input className="input" id="title" name="title" placeholder="Title" required />
          <label htmlFor="body">Details</label>
          <textarea className="input" id="body" name="body" rows={4} required />
          <button className="btn" type="submit">Post</button>
        </form>
      </div>

      <div className="card">
        <h2>Recent questions</h2>
        {questions.length === 0 ? <p className="muted">No questions yet.</p> : (
          <table className="table">
            <thead><tr><th>Title</th><th>Asker</th><th>Answers</th></tr></thead>
            <tbody>
              {questions.map(q => (
                <tr key={q.id}>
                  <td><Link href={`/qa/${q.id}`}>{q.title}</Link></td>
                  <td>{q.user.email}</td>
                  <td>{q._count.answers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
