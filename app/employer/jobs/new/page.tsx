import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { JobForm } from '@/components/onboarding-forms';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function NewEmployerJobPage() {
  const user = await requireRole([UserRole.EMPLOYER]);
  const professions = await db.profession.findMany({ orderBy: { name: 'asc' } });
  const companies = user.employerProfile?.companyId
    ? await db.company.findMany({ where: { id: user.employerProfile.companyId } })
    : [];

  if (!companies.length) redirect('/onboarding');

  return (
    <div className="card">
      <h1>Create job</h1>
      <p className="muted">Your job will appear immediately in the public jobs directory.</p>
      <JobForm professions={professions} companies={companies} />
    </div>
  );
}
