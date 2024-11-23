'use client'

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInButton() {
  const router = useRouter();

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => router.push('/login')}
        className="btn-primary"
      >
        Sign In
      </button>
      <Link href="/signup" className="btn-secondary">
        Sign Up
      </Link>
    </div>
  );
}