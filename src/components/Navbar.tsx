'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, FolderPlus, ArrowLeftRight, Shield, Menu, X, LogOut, Loader2, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useWallet, shortenAddress } from '@/lib/WalletProvider';
import { useRole } from '@/lib/RoleProvider';

const CHAIN_NAMES: Record<string, string> = {
  '0x1': 'Mainnet',
  '0xaa36a7': 'Sepolia',
  '0x5': 'Goerli',
  '0x89': 'Polygon',
  '0x13881': 'Mumbai',
  '0xa4b1': 'Arbitrum',
  '0xa': 'Optimism',
};

const clientLinks = [
  { href: '/projects', label: 'Browse Projects', icon: Briefcase },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

const designerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/post-project', label: 'Post Project', icon: FolderPlus },
  { href: '/projects', label: 'Browse Projects', icon: Briefcase },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

const defaultLinks = [
  { href: '/login', label: 'Get Started', icon: UserCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address, chainId, isConnecting, error, connect, disconnect } = useWallet();
  const { role, clearRole } = useRole();

  const networkName = chainId ? (CHAIN_NAMES[chainId] || `Chain ${parseInt(chainId, 16)}`) : null;

  // Choose nav links based on role
  const navLinks = role === 'client' ? clientLinks : role === 'designer' ? designerLinks : defaultLinks;

  const handleDisconnect = () => {
    clearRole();
    disconnect();
  };

  const roleBadge = role === 'client'
    ? { label: 'Client', color: 'var(--color-accent-blue)', bg: 'rgba(116, 185, 255, 0.1)', border: 'rgba(116, 185, 255, 0.25)' }
    : role === 'designer'
      ? { label: 'Designer', color: 'var(--color-accent-purple-light)', bg: 'rgba(108, 92, 231, 0.1)', border: 'rgba(108, 92, 231, 0.25)' }
      : null;

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(10, 10, 15, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--color-border-primary)',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-teal))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={20} color="white" />
          </div>
          <span style={{
            fontSize: 18,
            fontWeight: 700,
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.02em',
          }}>
            Trust<span style={{ color: 'var(--color-accent-purple-light)' }}>Chain</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }} className="desktop-nav">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Wallet + Role Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Role Badge */}
          {roleBadge && address && (
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '5px 12px',
                borderRadius: 8,
                background: roleBadge.bg,
                border: `1px solid ${roleBadge.border}`,
                fontSize: 12,
                color: roleBadge.color,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }} className="role-badge">
                {roleBadge.label}
              </div>
            </Link>
          )}

          {/* Network Badge */}
          {address && networkName && (
            <div style={{
              padding: '6px 12px',
              borderRadius: 8,
              background: 'rgba(0, 206, 201, 0.1)',
              border: '1px solid rgba(0, 206, 201, 0.2)',
              fontSize: 12,
              color: 'var(--color-accent-teal-light)',
              fontWeight: 500,
            }} className="network-badge">
              {networkName}
            </div>
          )}

          {address ? (
            /* Connected State */
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(108, 92, 231, 0.15)',
                border: '1px solid rgba(108, 92, 231, 0.3)',
                fontSize: 13,
                color: 'var(--color-accent-purple-light)',
                fontWeight: 500,
                fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#00CE7D',
                  boxShadow: '0 0 6px rgba(0, 206, 125, 0.6)',
                }} />
                {shortenAddress(address)}
              </div>
              <button
                onClick={handleDisconnect}
                title="Disconnect wallet"
                style={{
                  padding: '8px 10px',
                  borderRadius: 10,
                  background: 'rgba(255, 71, 87, 0.1)',
                  border: '1px solid rgba(255, 71, 87, 0.2)',
                  color: '#FF4757',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            /* Disconnected State */
            <Link href="/login" style={{ textDecoration: 'none' }}>
              <button
                className="btn-primary"
                style={{
                  padding: '8px 20px',
                  fontSize: 13,
                }}
              >
                <Shield size={14} />
                Get Started
              </button>
            </Link>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
            }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <div style={{
          padding: '10px 24px',
          background: 'rgba(255, 71, 87, 0.1)',
          borderTop: '1px solid rgba(255, 71, 87, 0.2)',
          color: '#FF4757',
          fontSize: 13,
          textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          padding: '12px 24px 20px',
          borderTop: '1px solid var(--color-border-primary)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }} className="mobile-menu">
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--color-accent-purple-light)' : 'var(--color-text-secondary)',
                  background: isActive ? 'rgba(108, 92, 231, 0.1)' : 'transparent',
                }}
              >
                <Icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .network-badge { display: none !important; }
          .role-badge { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .network-badge { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
