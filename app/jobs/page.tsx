import Link from 'next/link';
import { db } from '@/lib/db';

export default async function JobsPage() {
  const jobs = await db.job.findMany({
    include: { company: true, profession: true },
    where: { status: 'OPEN' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="grid">
      <div>
        <h1>Jobs</h1>
        <p className="muted">Live listings from verified and demo employers.</p>
      </div>
      {jobs.map((job) => (
        <div className="card" key={job.id}>
          <h2>{job.title}</h2>
          <p className="muted">{job.company.name} · {job.profession.name} · {job.location || 'Location flexible'}</p>
          <div className="inline-actions">
            <Link href={`/jobs/${job.id}`}>View details</Link>
          </div>
        </div>
      ))}
      {!jobs.length ? <div className="card">No jobs yet.</div> : null}
    </div>
  );
}
