import Link from 'next/link';
import { consumeEmailVerificationToken } from '@/lib/tokens';

export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams;
  const token = params.token || '';
  const result = token ? await consumeEmailVerificationToken(token) : { ok: false as const, reason: 'Missing token' };

  return (
    <div className="card" style={{ maxWidth: 680 }}>
      <h1>Email verification</h1>
      {result.ok ? (
        <>
          <p>Your email address has been verified.</p>
          <Link className="button" href="/login">Go to login</Link>
        </>
      ) : (
        <>
          <p className="error">{result.reason}</p>
          <p className="muted">Generate a fresh verification link from a logged-in flow or by re-registering in the starter environment.</p>
        </>
      )}
    </div>
  );
}
