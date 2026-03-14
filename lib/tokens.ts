import crypto from 'crypto';
import { db } from '@/lib/db';

const HOUR = 60 * 60 * 1000;

export function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}

export async function issueEmailVerificationToken(userId: string) {
  await db.emailVerificationToken.deleteMany({ where: { userId } });
  return db.emailVerificationToken.create({
    data: {
      userId,
      token: generateToken(),
      expiresAt: new Date(Date.now() + 24 * HOUR),
    },
  });
}

export async function issuePasswordResetToken(userId: string) {
  await db.passwordResetToken.deleteMany({ where: { userId, usedAt: null } });
  return db.passwordResetToken.create({
    data: {
      userId,
      token: generateToken(),
      expiresAt: new Date(Date.now() + 2 * HOUR),
    },
  });
}

export async function consumeEmailVerificationToken(token: string) {
  const record = await db.emailVerificationToken.findUnique({ where: { token } });
  if (!record) return { ok: false as const, reason: 'Invalid token' };
  if (record.expiresAt < new Date()) {
    await db.emailVerificationToken.delete({ where: { token } }).catch(() => null);
    return { ok: false as const, reason: 'Token expired' };
  }

  await db.user.update({
    where: { id: record.userId },
    data: { emailVerifiedAt: new Date() },
  });
  await db.emailVerificationToken.delete({ where: { token } });
  return { ok: true as const };
}

export async function consumePasswordResetToken(token: string, passwordHash: string) {
  const record = await db.passwordResetToken.findUnique({ where: { token } });
  if (!record) return { ok: false as const, reason: 'Invalid token' };
  if (record.usedAt) return { ok: false as const, reason: 'Token already used' };
  if (record.expiresAt < new Date()) {
    return { ok: false as const, reason: 'Token expired' };
  }

  await db.user.update({
    where: { id: record.userId },
    data: { passwordHash },
  });
  await db.passwordResetToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });
  return { ok: true as const };
}
