import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { registerSchema } from '@/lib/validators';
import { ok, fail } from '@/lib/api';
import { issueEmailVerificationToken } from '@/lib/tokens';
import { sendAppEmail } from '@/lib/mailer';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = registerSchema.safeParse(body);
  if (!result.success) return fail('Invalid registration payload');

  const email = result.data.email.toLowerCase();
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return fail('Email already registered', 409);

  const passwordHash = await hashPassword(result.data.password);
  const user = await db.user.create({
    data: {
      fullName: result.data.fullName,
      email,
      passwordHash,
      role: result.data.role,
    },
  });

  const token = await issueEmailVerificationToken(user.id);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verify-email?token=${token.token}`;

  await sendAppEmail({
    to: user.email,
    subject: 'Verify your ProHire email',
    text: `Verify your email by opening: ${verifyUrl}` ,
  });

  return ok({ user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }, verifyUrl }, 201);
}
