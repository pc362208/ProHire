import Link from 'next/link';
import { requireRole } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { db } from '@/lib/db';

export default async function EmployerPage() {
  const user = await requireRole([UserRole.EMPLOYER]);
  const employerProfile = user.employerProfile;
  const company = employerProfile?.companyId
    ? await db.company.findUnique({
        where: { id: employerProfile.companyId },
        include: {
          jobs: {
            include: { applications: true, profession: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
    : null;

  const totalApplicants = company?.jobs.reduce((sum, job) => sum + job.applications.length, 0) ?? 0;

  return (
    <div className="grid">
      <div className="card">
        <h1>Employer Dashboard</h1>
        <p className="muted">{company ? `${company.name} · ${company.location || 'Location pending'}` : 'Complete setup to create your company.'}</p>
        <div className="inline-actions">
          <Link className="button" href="/employer/jobs/new">Post a job</Link>
          <Link className="button button-secondary" href="/onboarding">Edit setup</Link>
          <Link className="button button-secondary" href="/employer/verification">Verification</Link>
        </div>
      </div>

      <div className="cards-3">
        <div className="card">
          <h2>{company?.jobs.length ?? 0}</h2>
          <p className="muted">Active and draft jobs</p>
        </div>
        <div className="card">
          <h2>{totalApplicants}</h2>
          <p className="muted">Applicants received</p>
        </div>
        <div className="card">
          <h2>{company?.isVerified ? 'Verified' : 'Pending'}</h2>
          <p className="muted">Company trust status</p>
        </div>
      </div>

      <div className="card">
        <h2>Your jobs</h2>
        {company?.jobs.length ? company.jobs.map((job) => (
          <div key={job.id} style={{ padding: '0.9rem 0', borderTop: '1px solid #eee' }}>
            <div className="row-between">
              <div>
                <p><strong>{job.title}</strong> · {job.profession.name}</p>
                <p className="muted">{job.applications.length} applicants · {job.status}</p>
              </div>
              <Link href={`/employer/jobs/${job.id}`}>View applicants</Link>
            </div>
          </div>
        )) : <p className="muted">No jobs posted yet.</p>}
      </div>
    </div>
  );
}
