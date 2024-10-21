"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Account = ({ params }) => {
  const { locale } = params;
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session) {
      router.push(`/${locale}/login`); // Redirect to the correct locale login page
    }
  }, [session, status, locale, router]);

  if (!session) return null; // Optionally return null while loading or redirecting

  return (
    <div>
      <h1>Your Account</h1>
      <p>Your email: {session.user.email}</p>
    </div>
  );
};

export default Account;
