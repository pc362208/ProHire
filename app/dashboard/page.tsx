import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { db } from '@/lib/db';

export default async function DashboardPage() {
  const user = await requireRole([UserRole.JOB_SEEKER]);
  const profile = user.seekerProfile;
  const [applications, jobs] = await Promise.all([
    profile ? db.application.findMany({ where: { seekerId: profile.id }, include: { job: { include: { company: true } } }, orderBy: { createdAt: 'desc' } }) : [],
    profile ? db.job.findMany({ where: { professionId: profile.professionId, status: 'OPEN' }, include: { company: true }, take: 5 }) : [],
  ]);

  return (
    <div className="grid">
      <div className="card">
        <h1>Job Seeker Dashboard</h1>
        <p className="muted">Welcome back, {user.fullName}.</p>
        <p><strong>Profession:</strong> {profile?.professionId ? 'Profile completed' : 'Profile incomplete'}</p>
        <p><strong>Resume:</strong> {profile?.resumeUrl ? <a href={profile.resumeUrl}>Uploaded</a> : 'Not uploaded yet'}</p>
        <Link href="/jobs">Browse all jobs</Link>
      </div>

      <div className="cards-2">
        <div className="card">
          <h2>Recent applications</h2>
          {applications.length ? applications.map((application) => (
            <p key={application.id}>{application.job.title} · {application.job.company.name} · <strong>{application.status}</strong></p>
          )) : <p className="muted">No applications yet.</p>}
        </div>
        <div className="card">
          <h2>Matching jobs</h2>
          {jobs.length ? jobs.map((job) => (
            <p key={job.id}><Link href={`/jobs/${job.id}`}>{job.title}</Link> · {job.company.name}</p>
          )) : <p className="muted">No matching jobs yet.</p>}
        </div>
      </div>
    </div>
  );
}
