import { fail } from '@/lib/api';

export async function POST() {
  return fail('Use Auth.js signOut from the client in v5.', 400);
}
