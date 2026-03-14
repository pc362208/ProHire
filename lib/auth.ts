import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { auth } from '@/auth';
import { db } from './db';

export async function getSession() {
  return auth();
}

export async function getCurrentUser() {
  const session = await auth();
  const id = (session?.user as any)?.id;
  if (!id) return null;

  return db.user.findUnique({
    where: { id },
    include: {
      seekerProfile: true,
      employerProfile: { include: { company: true } },
    },
  });
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireUser();
  if (!roles.includes(user.role)) {
    if (user.role === 'EMPLOYER') redirect('/employer');
    if (user.role === 'ADMIN') redirect('/admin');
    redirect('/dashboard');
  }
  return user;
}
