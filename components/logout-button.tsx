'use client';

import { signOut } from 'next-auth/react';

export function LogoutButton() {
  return (
    <button
      className="button button-secondary"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Logout
    </button>
  );
}
