import { ResetPasswordForm } from '@/components/auth-forms';

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h1>Reset password</h1>
      <p className="muted">Set a new password using your reset token.</p>
      <ResetPasswordForm token={params.token || ''} />
    </div>
  );
}
