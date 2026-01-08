import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { applyJob } from "./server-actions";

export default async function JobsPage() {
  const session = await requireUser();
  const user = session.user as any;

  const jobs = await prisma.jobPosting.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" }
  });

  const myApps = await prisma.jobApplication.findMany({ where: { userId: user.id } });
  const myApplied = new Set(myApps.map(a => a.jobId));

  return (
    <div className="card">
      <h1>Jobs</h1>
      <p className="muted">Browse job postings and apply.</p>

      <table className="table" aria-label="Job list">
        <thead>
          <tr>
            <th>Company / Role</th>
            <th>Location</th>
            <th>Type</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {jobs.map(j => (
            <tr key={j.id}>
              <td>
                <strong>{j.company}</strong><br />
                {j.title}<br />
                <span className="muted">{j.requirements ?? ""}</span>
              </td>
              <td>{j.location ?? "-"}</td>
              <td>{j.jobType ?? "-"}</td>
              <td>
                {myApplied.has(j.id) ? (
                  <span className="badge">Applied</span>
                ) : (
                  <form action={applyJob}>
                    <input type="hidden" name="jobId" value={j.id} />
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
