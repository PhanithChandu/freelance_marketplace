'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useWallet } from './WalletProvider';

export type UserRole = 'client' | 'designer' | null;

interface RoleState {
  role: UserRole;
  setRole: (role: 'client' | 'designer') => void;
  clearRole: () => void;
  isClient: boolean;
  isDesigner: boolean;
}

const RoleContext = createContext<RoleState | null>(null);

function getRoleKey(address: string): string {
  return `trustchain_role_${address.toLowerCase()}`;
}

export function RoleProvider({ children }: { children: ReactNode }) {
  const { address } = useWallet();
  const [role, setRoleState] = useState<UserRole>(null);

  // Load role from localStorage when wallet address changes
  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(getRoleKey(address));
      if (saved === 'client' || saved === 'designer') {
        setRoleState(saved);
      } else {
        setRoleState(null);
      }
    } else {
      setRoleState(null);
    }
  }, [address]);

  const setRole = useCallback((newRole: 'client' | 'designer') => {
    if (address) {
      localStorage.setItem(getRoleKey(address), newRole);
    }
    setRoleState(newRole);
  }, [address]);

  const clearRole = useCallback(() => {
    if (address) {
      localStorage.removeItem(getRoleKey(address));
    }
    setRoleState(null);
  }, [address]);

  return (
    <RoleContext.Provider value={{
      role,
      setRole,
      clearRole,
      isClient: role === 'client',
      isDesigner: role === 'designer',
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleState {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
