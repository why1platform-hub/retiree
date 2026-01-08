import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { addPost } from "./server-actions";

export default async function ThreadPage({ params }: { params: { threadId: string } }) {
  await requireUser();

  const thread = await prisma.discussionThread.findUnique({
    where: { id: params.threadId },
    include: { user: true, posts: { include: { user: true }, orderBy: { createdAt: "asc" } } }
  });

  if (!thread) {
    return <div className="card"><h2>Thread not found</h2></div>;
  }

  return (
    <div className="grid">
      <div className="card">
        <h1>{thread.title}</h1>
        <p className="muted">Started by {thread.user.email}</p>

        {thread.posts.length === 0 ? <p className="muted">No posts.</p> : (
          <div className="grid" aria-label="Posts">
            {thread.posts.map(p => (
              <div key={p.id} className="card" style={{background:"#fff"}}>
                <div className="muted">{p.user.email} • {p.createdAt.toISOString().slice(0,16).replace("T"," ")}</div>
                <p style={{marginBottom:0}}>{p.body}</p>
              </div>
            ))}
          </div>
        )}

        <hr />

        <form action={addPost} style={{display:"grid", gap:10}}>
          <input type="hidden" name="threadId" value={thread.id} />
          <label htmlFor="body">Reply</label>
          <textarea id="body" name="body" className="input" rows={4} required />
          <button className="btn" type="submit" disabled={thread.locked}>Post</button>
          {thread.locked ? <p className="muted">This thread is locked.</p> : null}
        </form>
      </div>
    </div>
  );
}
