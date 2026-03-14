import { ok, fail } from '@/lib/api';
import { verifyEmailSchema } from '@/lib/validators';
import { consumeEmailVerificationToken } from '@/lib/tokens';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = verifyEmailSchema.safeParse(body);
  if (!result.success) return fail('Invalid verification request');

  const verification = await consumeEmailVerificationToken(result.data.token);
  if (!verification.ok) return fail(verification.reason, 400);

  return ok({ message: 'Email verified successfully.' });
}
