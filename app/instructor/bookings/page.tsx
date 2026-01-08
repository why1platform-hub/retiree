import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/guards";
import { approveBooking, rejectBooking } from "./server-actions";

export default async function InstructorBookingsPage() {
  const session = const session = await requireRole(["Instructor", "Admin"]);

  const user = session.user as any;

  const bookings = await prisma.consultantBooking.findMany({
    where: { consultantId: user.id },
    include: { requester: true, availability: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="card">
      <h1>Instructor — Booking requests</h1>
      <p className="muted">Approve or reject consultation requests.</p>

      {bookings.length === 0 ? <p className="muted">No requests.</p> : (
        <table className="table">
          <thead><tr><th>Requester</th><th>Topic</th><th>Time (UTC)</th><th>Status</th><th /></tr></thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.requester.email}</td>
                <td>{b.topic}</td>
                <td>{b.availability.startUtc.toISOString().slice(0,16).replace("T"," ")}</td>
                <td><span className="badge">{b.status}</span></td>
                <td>
                  {b.status === "Requested" ? (
                    <div style={{display:"flex", gap:8, flexWrap:"wrap"}}>
                      <form action={approveBooking}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn" type="submit">Approve</button>
                      </form>
                      <form action={rejectBooking}>
                        <input type="hidden" name="bookingId" value={b.id} />
                        <button className="btn" type="submit">Reject</button>
                      </form>
                    </div>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
