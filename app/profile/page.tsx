import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guards";
import { updateProfile } from "./server-actions";

export default async function ProfilePage() {
  const session = await requireUser();
  const user = session.user as any;

  const profile = await prisma.userProfile.findUnique({
    where: { userId: user.id },
    include: { skills: true }
  });

  return (
    <div className="grid">
      <div className="card">
        <h1>My Profile</h1>
        <p className="muted">Write your headline, bio, and key skills.</p>

        <form action={updateProfile} style={{display:"grid", gap:10, maxWidth:720}}>
          <label htmlFor="headline">Headline</label>
          <input className="input" id="headline" name="headline" defaultValue={profile?.headline ?? ""} />

          <label htmlFor="bio">Bio</label>
          <textarea className="input" id="bio" name="bio" rows={5} defaultValue={profile?.bio ?? ""} />

          <label htmlFor="location">Location</label>
          <input className="input" id="location" name="location" defaultValue={profile?.location ?? ""} />

          <button className="btn" type="submit">Save</button>
        </form>
      </div>

      <aside className="card">
        <h2>Skills</h2>
        <p className="muted">This starter keeps skills simple. Add CRUD screens later.</p>
        {profile?.skills?.length ? (
          <ul>
            {profile.skills.map(s => (
              <li key={s.id}>{s.name} — Level {s.level}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">No skills yet.</p>
        )}
      </aside>
    </div>
  );
}
