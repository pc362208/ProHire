import { UserRole } from '@prisma/client';
import { CompanyVerificationForm } from '@/components/onboarding-forms';
import { requireRole } from '@/lib/auth';
import { db } from '@/lib/db';

export default async function EmployerVerificationPage() {
  const user = await requireRole([UserRole.EMPLOYER, UserRole.ADMIN]);
  const companyId = user.employerProfile?.companyId;
  const requests = companyId
    ? await db.verificationRequest.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } })
    : [];

  return (
    <div className="grid" style={{ maxWidth: 760 }}>
      <div className="card">
        <h1>Company verification</h1>
        <p className="muted">Upload a supporting document to request manual verification.</p>
      </div>
      <div className="card">
        <CompanyVerificationForm />
      </div>
      <div className="card">
        <h2>Previous requests</h2>
        {requests.length ? requests.map((request) => (
          <p key={request.id}><strong>{request.status}</strong> · {new Date(request.createdAt).toLocaleDateString()} · <a href={request.documentUrl}>View document</a></p>
        )) : <p className="muted">No verification requests yet.</p>}
      </div>
    </div>
  );
}
