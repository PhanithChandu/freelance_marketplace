'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole, UserRole } from '@/lib/RoleProvider';
import { useWallet } from '@/lib/WalletProvider';
import { Shield } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles: ('client' | 'designer')[];
}

export default function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const router = useRouter();
  const { role } = useRole();
  const { address } = useWallet();

  useEffect(() => {
    // If not connected or no role, redirect to login
    if (!address || !role) {
      router.replace('/login');
      return;
    }
    // If role not allowed for this route, redirect to login
    if (!allowedRoles.includes(role)) {
      router.replace('/login');
    }
  }, [address, role, allowedRoles, router]);

  // Show nothing while checking
  if (!address || !role || !allowedRoles.includes(role)) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        gap: 12,
        color: 'var(--color-text-muted)',
        fontSize: 14,
      }}>
        <Shield size={20} style={{ animation: 'pulseSlow 2s ease-in-out infinite' }} />
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
