import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { LogoutButton } from '@/components/logout-button';
import { Providers } from '@/components/providers';

export const metadata = {
  title: 'ProHire',
  description: 'Profession-based hiring platform',
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body>
        <Providers>
          <header className="site-header">
            <nav className="site-nav">
              <Link href="/" className="brand">ProHire</Link>
              <div className="nav-links">
                <Link href="/jobs">Jobs</Link>
                {user?.role === 'JOB_SEEKER' ? <Link href="/dashboard">Dashboard</Link> : null}
                {user?.role === 'EMPLOYER' ? <Link href="/employer">Employer</Link> : null}
                {user?.role === 'ADMIN' ? <Link href="/admin">Admin</Link> : null}
                {user ? <Link href="/onboarding">Setup</Link> : null}
                {user ? <LogoutButton /> : <><Link href="/register">Register</Link><Link href="/login">Login</Link></>}
              </div>
            </nav>
          </header>
          <main className="container">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
