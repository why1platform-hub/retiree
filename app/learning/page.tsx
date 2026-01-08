import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { enrollCourse } from "./server-actions";

export default async function LearningPage() {
  const session = await requireUser();
  const user = session.user as any;

  const [courses, resources, myEnrollments] = await Promise.all([
    prisma.course.findMany({
      where: { isPublished: true },
      include: { lessons: true, instructor: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.learningResource.findMany({ orderBy: { downloads: "desc" }, take: 10 }),
    prisma.courseEnrollment.findMany({ where: { userId: user.id } })
  ]);

  const enrolled = new Set(myEnrollments.map(e => e.courseId));

  return (
    <div className="grid">
      <div className="card">
        <h1>Learning</h1>
        <p className="muted">Online lectures (VOD) and downloadable materials. (간단한 LMS)</p>
        <p><Link href="/consulting">Need 1:1 support? Book a consultant →</Link></p>
      </div>

      <div className="card">
        <h2>Online courses</h2>
        {courses.length === 0 ? <p className="muted">No courses.</p> : (
          <table className="table">
            <thead><tr><th>Course</th><th>Lessons</th><th>Instructor</th><th /></tr></thead>
            <tbody>
              {courses.map(c => (
                <tr key={c.id}>
                  <td>
                    <strong>{c.title}</strong><br />
                    <span className="muted">{c.description}</span>
                  </td>
                  <td>{c.lessons.length}</td>
                  <td>{c.instructor.email}</td>
                  <td>
                    {enrolled.has(c.id) ? (
                      <span className="badge">Enrolled</span>
                    ) : (
                      <form action={enrollCourse}>
                        <input type="hidden" name="courseId" value={c.id} />
                        <button className="btn" type="submit">Enroll</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <h2>Downloadable resources</h2>
        {resources.length === 0 ? <p className="muted">No resources.</p> : (
          <table className="table">
            <thead><tr><th>Title</th><th>Type</th><th>Size</th><th /></tr></thead>
            <tbody>
              {resources.map(r => (
                <tr key={r.id}>
                  <td>{r.title}</td>
                  <td>{r.category ?? "-"}</td>
                  <td>{r.fileSize ?? "-"}</td>
                  <td><a className="btn" href={r.fileUrl} target="_blank" rel="noreferrer">Download</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
