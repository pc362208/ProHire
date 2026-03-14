export { auth as middleware } from '@/auth';

export const config = {
  matcher: ['/dashboard/:path*', '/employer/:path*', '/admin/:path*', '/onboarding/:path*'],
};
