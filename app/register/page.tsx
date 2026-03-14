import { RegisterForm } from '@/components/auth-forms';

export default function RegisterPage() {
  return (
    <div className="card" style={{ maxWidth: 560 }}>
      <h1>Create your account</h1>
      <p className="muted">Choose job seeker or employer and start the onboarding flow.</p>
      <RegisterForm />
    </div>
  );
}
