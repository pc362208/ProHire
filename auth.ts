import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { verifyPassword } from '@/lib/password';

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || '').trim().toLowerCase();
        const password = String(credentials?.password || '');
        if (!email || !password) return null;

        const user = await db.user.findUnique({
          where: { email },
          include: { seekerProfile: true, employerProfile: true },
        });

        if (!user?.passwordHash) return null;
        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          hasSeekerProfile: Boolean(user.seekerProfile),
          hasEmployerProfile: Boolean(user.employerProfile?.companyId),
          emailVerified: Boolean(user.emailVerifiedAt),
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.hasSeekerProfile = (user as any).hasSeekerProfile;
        token.hasEmployerProfile = (user as any).hasEmployerProfile;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).hasSeekerProfile = token.hasSeekerProfile;
        (session.user as any).hasEmployerProfile = token.hasEmployerProfile;
        (session.user as any).emailVerified = token.emailVerified;
      }
      return session;
    },
    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const protectedPrefixes = ['/dashboard', '/employer', '/admin', '/onboarding'];
      const needsAuth = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
      if (!needsAuth) return true;
      return !!auth?.user;
    },
  },
});
