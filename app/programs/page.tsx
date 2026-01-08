import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { applyProgram } from "./server-actions";

export default async function ProgramsPage() {
  const session = await requireUser();
  const user = session.user as any;

  const programs = await prisma.program.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

  const myApps = await prisma.programApplication.findMany({ where: { userId: user.id } });
  const myApplied = new Set(myApps.map(a => a.programId));

  return (
    <div className="card">
      <h1>Programs</h1>
      <p className="muted">Browse open programs and submit applications.</p>

      <table className="table" aria-label="Program list">
        <thead>
          <tr>
            <th>Program</th>
            <th>Field</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {programs.map(p => (
            <tr key={p.id}>
              <td>
                <strong>{p.name}</strong><br />
                <span className="muted">{p.description}</span>
              </td>
              <td>{p.field}</td>
              <td><span className="badge">{p.statusLabel}</span></td>
              <td>
                {myApplied.has(p.id) ? (
                  <span className="badge">Applied</span>
                ) : (
                  <form action={applyProgram}>
                    <input type="hidden" name="programId" value={p.id} />
                    <button className="btn" type="submit">Apply</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
