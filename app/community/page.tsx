import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { createThread } from "./server-actions";

export default async function CommunityPage() {
  await requireUser();

  const threads = await prisma.discussionThread.findMany({
    include: { user: true, _count: { select: { posts: true } } },
    orderBy: { updatedAt: "desc" },
    take: 50
  });

  return (
    <div className="grid">
      <div className="card">
        <h1>Discussion</h1>
        <p className="muted">Create threads and share experiences.</p>

        <form action={createThread} style={{display:"grid", gap:10, maxWidth:720}}>
          <label htmlFor="title">New thread</label>
          <input className="input" id="title" name="title" placeholder="Thread title" required />
          <button className="btn" type="submit">Create</button>
        </form>
      </div>

      <div className="card">
        <h2>Threads</h2>
        {threads.length === 0 ? <p className="muted">No threads.</p> : (
          <table className="table">
            <thead><tr><th>Title</th><th>Author</th><th>Posts</th></tr></thead>
            <tbody>
              {threads.map(t => (
                <tr key={t.id}>
                  <td><Link href={`/community/${t.id}`}>{t.title}</Link></td>
                  <td>{t.user.email}</td>
                  <td>{t._count.posts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
