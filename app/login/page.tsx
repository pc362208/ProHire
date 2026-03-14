import { LoginForm } from '@/components/auth-forms';

export default function LoginPage() {
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h1>Login</h1>
      <p className="muted">Auth.js credentials auth is wired in for the starter.</p>
      <LoginForm />
    </div>
  );
}
