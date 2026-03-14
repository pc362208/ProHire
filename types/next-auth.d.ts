import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
      hasSeekerProfile?: boolean;
      hasEmployerProfile?: boolean;
      emailVerified?: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN';
    hasSeekerProfile?: boolean;
    hasEmployerProfile?: boolean;
    emailVerified?: boolean;
  }
}
