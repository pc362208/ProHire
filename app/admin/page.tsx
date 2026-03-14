import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { db } from '@/lib/db';

export default async function AdminPage() {
  await requireRole([UserRole.ADMIN]);
  const [users, companies, jobs] = await Promise.all([db.user.count(), db.company.count(), db.job.count()]);
  return (
    <div className="cards-2">
      <div className="card"><h1>Admin</h1><p className="muted">Moderation and verification starter dashboard.</p></div>
      <div className="card"><div className="stat">{users}</div><div className="muted">Users</div></div>
      <div className="card"><div className="stat">{companies}</div><div className="muted">Companies</div></div>
      <div className="card"><div className="stat">{jobs}</div><div className="muted">Jobs</div></div>
    </div>
  );
}
