'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { BilingualAuthScreen } from '@/components/BilingualAuthScreen';

export default function AuthPage() {
  const router = useRouter();

  return (
    <BilingualAuthScreen
      initialMode="login"
      onLoginSuccess={() => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kin_auth', 'true');
        }
        router.push('/?view=dashboard');
      }}
    />
  );
}
