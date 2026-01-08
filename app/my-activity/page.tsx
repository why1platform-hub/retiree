import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

export default async function MyActivityPage() {
  const session = await requireUser();
  const user = session.user as any;

  const [programApps, jobApps, enrollments, bookings] = await Promise.all([
    prisma.programApplication.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { appliedAt: "desc" }
    }),
    prisma.jobApplication.findMany({
      where: { userId: user.id },
      include: { job: true },
      orderBy: { appliedAt: "desc" }
    }),
    prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { enrolledAt: "desc" }
    }),
    prisma.consultantBooking.findMany({
      where: { requesterId: user.id },
      include: { availability: true, consultant: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="grid">
      <div className="card">
        <h1>My Activity</h1>
        <p className="muted">Track applications, consultations, and learning progress.</p>
      </div>

      <div className="card">
        <h2>Program applications</h2>
        {programApps.length === 0 ? <p className="muted">No program applications.</p> : (
          <table className="table">
            <thead><tr><th>Applied</th><th>Program</th><th>Field</th><th>Status</th></tr></thead>
            <tbody>
              {programApps.map(a => (
                <tr key={a.id}>
                  <td>{a.appliedAt.toISOString().slice(0,10)}</td>
                  <td>{a.program.name}</td>
                  <td>{a.program.field}</td>
                  <td><span className="badge">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Job applications</h2>
        {jobApps.length === 0 ? <p className="muted">No job applications.</p> : (
          <table className="table">
            <thead><tr><th>Applied</th><th>Company</th><th>Role</th><th>Status</th></tr></thead>
            <tbody>
              {jobApps.map(a => (
                <tr key={a.id}>
                  <td>{a.appliedAt.toISOString().slice(0,10)}</td>
                  <td>{a.job.company}</td>
                  <td>{a.job.title}</td>
                  <td><span className="badge">{a.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Learning progress</h2>
        {enrollments.length === 0 ? <p className="muted">No courses yet.</p> : (
          <table className="table">
            <thead><tr><th>Course</th><th>Progress</th></tr></thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e.id}>
                  <td>{e.course.title}</td>
                  <td>{e.progressPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Consultation bookings</h2>
        {bookings.length === 0 ? <p className="muted">No bookings.</p> : (
          <table className="table">
            <thead><tr><th>Topic</th><th>Consultant</th><th>Time (UTC)</th><th>Status</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.topic}</td>
                  <td>{b.consultant.email}</td>
                  <td>{b.availability.startUtc.toISOString().slice(0,16).replace("T"," ")}</td>
                  <td><span className="badge">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
