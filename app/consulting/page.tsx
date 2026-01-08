import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { requestBooking } from "./server-actions";

export default async function ConsultingPage() {
  const session = await requireUser();
  const user = session.user as any;

  const slots = await prisma.consultantAvailability.findMany({
    where: { isActive: true, startUtc: { gt: new Date() } },
    include: { consultant: true },
    orderBy: { startUtc: "asc" },
    take: 20
  });

  return (
    <div className="card">
      <h1>Book a consultant</h1>
      <p className="muted">Request an available time slot. Instructors approve/reject.</p>

      {slots.length === 0 ? (
        <p className="muted">No upcoming slots.</p>
      ) : (
        <table className="table" aria-label="Consultant availability">
          <thead><tr><th>Consultant</th><th>Start (UTC)</th><th>End (UTC)</th><th /></tr></thead>
          <tbody>
            {slots.map(s => (
              <tr key={s.id}>
                <td>{s.consultant.email}</td>
                <td>{s.startUtc.toISOString().slice(0,16).replace("T"," ")}</td>
                <td>{s.endUtc.toISOString().slice(0,16).replace("T"," ")}</td>
                <td>
                  <form action={requestBooking} style={{display:"grid", gap:8}}>
                    <input type="hidden" name="availabilityId" value={s.id} />
                    <input type="hidden" name="consultantId" value={s.consultantId} />
                    <input className="input" name="topic" placeholder="Topic (e.g., resume review)" required />
                    <button className="btn" type="submit">Request</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
