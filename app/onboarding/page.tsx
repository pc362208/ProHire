import { redirect } from 'next/navigation';
import { CompanyForm, SeekerProfileForm } from '@/components/onboarding-forms';
import { requireUser } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function OnboardingPage() {
  const user = await requireUser();
  const professions = await db.profession.findMany({ orderBy: { name: 'asc' } });

  if (user.role === 'JOB_SEEKER' && user.seekerProfile) redirect('/dashboard');
  if (user.role === 'EMPLOYER' && user.employerProfile?.companyId) redirect('/employer');
  if (user.role === 'ADMIN') redirect('/admin');

  return (
    <div className="grid" style={{ maxWidth: 760 }}>
      <div className="card">
        <h1>Finish setup</h1>
        <p className="muted">Complete the minimum profile needed to start using the app.</p>
      </div>
      <div className="card">
        {user.role === 'JOB_SEEKER' ? (
          <SeekerProfileForm professions={professions} userId={user.id} />
        ) : (
          <CompanyForm userId={user.id} />
        )}
      </div>
    </div>
  );
}
