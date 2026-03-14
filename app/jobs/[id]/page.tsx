import { notFound } from 'next/navigation';
import { ApplyButton } from '@/components/onboarding-forms';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await db.job.findUnique({
    where: { id },
    include: { company: true, profession: true, applications: true },
  });
  const user = await getCurrentUser();

  if (!job) notFound();

  const hasApplied = Boolean(
    user?.seekerProfile && job.applications.some((application) => application.seekerId === user.seekerProfile?.id)
  );

  return (
    <div className="grid">
      <div className="card">
        <h1>{job.title}</h1>
        <p className="muted">{job.company.name} · {job.profession.name}</p>
        <p><strong>Location:</strong> {job.location || 'Flexible'}</p>
        <p><strong>Work type:</strong> {job.workType || 'Not specified'}</p>
        <p><strong>Salary:</strong> {job.salaryMin && job.salaryMax ? `$${job.salaryMin.toLocaleString()} - $${job.salaryMax.toLocaleString()}` : 'Not specified'}</p>
        <p><strong>Applicants:</strong> {job.applications.length}</p>
        <p>{job.description}</p>
      </div>
      {user?.role === 'JOB_SEEKER' && user.seekerProfile ? (
        <div className="card">
          <h2>Apply</h2>
          <ApplyButton jobId={job.id} hasApplied={hasApplied} />
        </div>
      ) : null}
    </div>
  );
}
