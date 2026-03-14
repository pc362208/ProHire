import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { ApplicationStatusForm } from '@/components/onboarding-forms';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';
import { calculateMatch } from '@/lib/match';

export default async function EmployerJobApplicantsPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireRole([UserRole.EMPLOYER, UserRole.ADMIN]);
  const { id } = await params;

  const job = await db.job.findUnique({
    where: { id },
    include: {
      company: true,
      profession: true,
      skills: { include: { skill: true } },
      applications: {
        include: {
          seeker: {
            include: {
              user: true,
              profession: true,
              skills: { include: { skill: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!job) notFound();
  if (user.role !== 'ADMIN' && job.companyId !== user.employerProfile?.companyId) notFound();

  return (
    <div className="grid">
      <div className="card">
        <p><Link href="/employer">← Back to employer dashboard</Link></p>
        <h1>{job.title}</h1>
        <p className="muted">{job.company.name} · {job.profession.name} · {job.location || 'Flexible'}</p>
        <p>{job.description}</p>
      </div>

      <div className="card">
        <h2>Applicants</h2>
        {job.applications.length ? job.applications.map((application) => {
          const seekerSkills = application.seeker.skills.map((entry) => entry.skill.name);
          const matchScore = calculateMatch({
            professionId: job.professionId,
            location: job.location,
            salaryMax: job.salaryMax,
            experienceRequired: job.experienceRequired,
            skills: job.skills.map((entry) => entry.skill.name),
          }, {
            professionId: application.seeker.professionId,
            location: application.seeker.location,
            expectedSalaryMin: application.seeker.expectedSalaryMin,
            yearsExperience: application.seeker.yearsExperience,
            skills: seekerSkills,
          });

          return (
            <div key={application.id} style={{ padding: '1rem 0', borderTop: '1px solid #eee' }}>
              <div className="row-between">
                <div>
                  <p><strong>{application.seeker.user.fullName}</strong> · {application.seeker.profession.name}</p>
                  <p className="muted">{application.seeker.location || 'Location not set'} · {application.seeker.yearsExperience ?? 0} years experience</p>
                </div>
                <p><strong>{matchScore}% match</strong></p>
              </div>
              <p>{application.seeker.bio || 'No bio provided yet.'}</p>
              <p className="muted small">Skills: {seekerSkills.length ? seekerSkills.join(', ') : 'No skills listed yet'}</p>
              <p className="muted small">Current status: <strong>{application.status}</strong></p>
              <ApplicationStatusForm applicationId={application.id} currentStatus={application.status} />
            </div>
          );
        }) : <p className="muted">No applicants yet.</p>}
      </div>
    </div>
  );
}
