import Link from 'next/link';
import { db } from '@/lib/db';

export default async function HomePage() {
  const [jobsCount, companiesCount, professionsCount] = await Promise.all([
    db.job.count(),
    db.company.count(),
    db.profession.count(),
  ]);

  return (
    <div className="grid">
      <section className="card hero">
        <p className="kicker">Profession-first hiring</p>
        <h1>Connect job seekers and employers faster.</h1>
        <p className="muted">ProHire matches people by profession, location, experience, and work style.</p>
        <div className="inline-actions" style={{ marginTop: 16 }}>
          <Link className="button" href="/jobs">Browse jobs</Link>
          <Link className="button button-secondary" href="/register">Create account</Link>
        </div>
      </section>

      <section className="cards-2">
        <div className="card"><div className="stat">{jobsCount}</div><div className="muted">Live jobs</div></div>
        <div className="card"><div className="stat">{companiesCount}</div><div className="muted">Companies</div></div>
        <div className="card"><div className="stat">{professionsCount}</div><div className="muted">Profession categories</div></div>
      </section>
    </div>
  );
}
