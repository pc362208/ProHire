'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const payload = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      role: String(formData.get('role') || 'JOB_SEEKER'),
    };

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const json = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(json.error || 'Registration failed');
      return;
    }

    const login = await signIn('credentials', {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setLoading(false);
    if (login?.error) {
      setError('Account created, but automatic sign-in failed. Please sign in manually.');
      router.push('/login');
      return;
    }

    router.push('/onboarding');
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Full name
        <input name="fullName" required />
      </label>
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" minLength={8} required />
      </label>
      <label>
        Account type
        <select name="role" defaultValue="JOB_SEEKER">
          <option value="JOB_SEEKER">Job seeker</option>
          <option value="EMPLOYER">Employer</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
    </form>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const email = String(formData.get('email') || '');
    const password = String(formData.get('password') || '');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      setError('Invalid email or password');
      return;
    }

    const profileRes = await fetch('/api/auth/me', { cache: 'no-store' });
    const profileJson = await profileRes.json();
    const user = profileJson.user;

    const redirectTo = user?.role === 'EMPLOYER'
      ? (user?.employerProfile?.companyId ? '/employer' : '/onboarding')
      : user?.role === 'ADMIN'
        ? '/admin'
        : (user?.seekerProfile ? '/dashboard' : '/onboarding');

    setLoading(false);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      <label>
        Password
        <input name="password" type="password" minLength={8} required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      <button className="button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
      <div className="grid" style={{ gap: 8 }}>
        <p className="muted small">Seed login: seeker@example.com / password123</p>
        <Link href="/forgot-password" className="muted small">Forgot your password?</Link>
      </div>
    </form>
  );
}


export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage(null);
    setError(null);
    setResetUrl(null);

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(formData.get('email') || '') }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || 'Unable to generate reset link');
      return;
    }

    setMessage(json.message || 'Reset link generated');
    setResetUrl(json.resetUrl || null);
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <label>
        Email
        <input name="email" type="email" required />
      </label>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p>{message}</p> : null}
      {resetUrl ? <a href={resetUrl} className="muted small">Open reset link</a> : null}
      <button className="button" disabled={loading}>{loading ? 'Generating...' : 'Send reset link'}</button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const password = String(formData.get('password') || '');
    const passwordConfirm = String(formData.get('passwordConfirm') || '');
    if (password !== passwordConfirm) {
      setLoading(false);
      setError('Passwords do not match');
      return;
    }

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    const json = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(json.error || 'Unable to reset password');
      return;
    }

    setMessage('Password updated. Redirecting to login...');
    setTimeout(() => {
      router.push('/login');
      router.refresh();
    }, 800);
  }

  return (
    <form action={onSubmit} className="grid form-grid">
      <input type="hidden" name="token" value={token} />
      <label>
        New password
        <input name="password" type="password" minLength={8} required />
      </label>
      <label>
        Confirm password
        <input name="passwordConfirm" type="password" minLength={8} required />
      </label>
      {!token ? <p className="error">Missing reset token.</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {message ? <p>{message}</p> : null}
      <button className="button" disabled={loading || !token}>{loading ? 'Updating...' : 'Update password'}</button>
    </form>
  );
}
