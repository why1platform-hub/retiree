import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";

export default async function HomePage() {
  const session = await requireUser();
  const user = session.user as any;

  const [announcements, programs, myProgramApps, myEnrollments, myBookings, jobs] = await Promise.all([
    prisma.announcement.findMany({
      where: { isPublished: true },
      orderBy: { publishFrom: "desc" },
      take: 3
    }),
    prisma.program.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.programApplication.findMany({
      where: { userId: user.id },
      include: { program: true },
      orderBy: { appliedAt: "desc" },
      take: 5
    }),
    prisma.courseEnrollment.findMany({
      where: { userId: user.id },
      include: { course: true },
      orderBy: { enrolledAt: "desc" },
      take: 5
    }),
    prisma.consultantBooking.findMany({
      where: { requesterId: user.id },
      include: { availability: true, consultant: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.jobPosting.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 2
    })
  ]);

  return (
    <div className="grid grid-2">
      <section className="card" aria-label="Main dashboard">
        <h1>Dashboard</h1>
        <p className="muted">Quick overview (공지사항, 진행 프로그램, 나의 현황).</p>

        <h3>Important announcements</h3>
        <table className="table" aria-label="Announcements">
          <thead>
            <tr>
              <th>Badge</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id}>
                <td>{a.badge ? <span className="badge primary">{a.badge}</span> : <span className="badge">Info</span>}</td>
                <td>{a.title}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 style={{marginTop:16}}>Ongoing programs</h3>
        <table className="table" aria-label="Programs preview">
          <thead>
            <tr>
              <th>Name</th>
              <th>Field</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.field}</td>
                <td><span className="badge">{p.statusLabel}</span></td>
                <td><Link href="/programs">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:16}}>
          <Link className="btn" href="/programs">Apply for programs</Link>
          <Link className="btn" href="/learning">Start learning</Link>
          <Link className="btn" href="/support">Support / FAQ</Link>
        </div>
      </section>

      <aside className="card" aria-label="My status">
        <h2>My status</h2>

        <div className="grid">
          <div className="card" style={{background:"#fff"}}>
            <h4 style={{marginTop:0}}>Applications</h4>
            <p className="muted">Recent program applications</p>
            {myProgramApps.length === 0 ? <p className="muted">No applications yet.</p> : (
              <ul>
                {myProgramApps.map(a => (
                  <li key={a.id}>
                    {a.program.name} — <span className="badge">{a.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/my-activity">Go to My Activity</Link>
          </div>

          <div className="card" style={{background:"#fff"}}>
            <h4 style={{marginTop:0}}>Learning</h4>
            <p className="muted">Recent course progress</p>
            {myEnrollments.length === 0 ? <p className="muted">No enrollments yet.</p> : (
              <ul>
                {myEnrollments.map(e => (
                  <li key={e.id}>
                    {e.course.title} — {e.progressPercent}%
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{background:"#fff"}}>
            <h4 style={{marginTop:0}}>Consultations</h4>
            <p className="muted">Bookings</p>
            {myBookings.length === 0 ? <p className="muted">No bookings yet.</p> : (
              <ul>
                {myBookings.map(b => (
                  <li key={b.id}>
                    {b.topic} — <span className="badge">{b.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="card" style={{background:"#fff"}}>
            <h4 style={{marginTop:0}}>Recommended jobs</h4>
            <p className="muted">Preview</p>
            {jobs.length === 0 ? <p className="muted">No jobs posted.</p> : (
              <ul>
                {jobs.map(j => (
                  <li key={j.id}>{j.company} — {j.title}</li>
                ))}
              </ul>
            )}
            <Link href="/jobs">Browse jobs</Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
