import { ForgotPasswordForm } from '@/components/auth-forms';

export default function ForgotPasswordPage() {
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h1>Forgot password</h1>
      <p className="muted">Generate a password reset link. In this scaffold, the link is also returned in the API response for easy testing.</p>
      <ForgotPasswordForm />
    </div>
  );
}
