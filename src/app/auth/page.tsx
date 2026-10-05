'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { EnterpriseAuthScreen } from '@/components/EnterpriseAuthScreen';

export default function AuthPage() {
  const router = useRouter();

  return (
    <EnterpriseAuthScreen
      initialMode="login"
      onLoginSuccess={(userData) => {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('kin_auth', 'true');
          if (userData) {
            localStorage.setItem('kin_active_user', JSON.stringify(userData));
          }
        }
        const userParam = userData?.id ? `&userId=${encodeURIComponent(userData.id)}` : '';
        router.push(`/?view=dashboard${userParam}`);
      }}
    />
  );
}
