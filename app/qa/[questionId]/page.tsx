import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { addAnswer } from "./server-actions";

export default async function QuestionPage({ params }: { params: { questionId: string } }) {
  await requireUser();

  const q = await prisma.question.findUnique({
    where: { id: params.questionId },
    include: { user: true, answers: { include: { user: true }, orderBy: { createdAt: "asc" } } }
  });

  if (!q) return <div className="card"><h2>Question not found</h2></div>;

  return (
    <div className="card">
      <h1>{q.title}</h1>
      <p className="muted">Asked by {q.user.email}</p>
      <p>{q.body}</p>

      <hr />

      <h2>Answers</h2>
      {q.answers.length === 0 ? <p className="muted">No answers yet.</p> : (
        <div className="grid">
          {q.answers.map(a => (
            <div key={a.id} className="card" style={{background:"#fff"}}>
              <div className="muted">{a.user.email} • {a.createdAt.toISOString().slice(0,16).replace("T"," ")}</div>
              <p style={{marginBottom:0}}>{a.body}</p>
            </div>
          ))}
        </div>
      )}

      <hr />

      <form action={addAnswer} style={{display:"grid", gap:10}}>
        <input type="hidden" name="questionId" value={q.id} />
        <label htmlFor="body">Your answer</label>
        <textarea className="input" id="body" name="body" rows={4} required />
        <button className="btn" type="submit">Submit answer</button>
      </form>
    </div>
  );
}
