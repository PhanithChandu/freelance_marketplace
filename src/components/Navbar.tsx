'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Briefcase, LayoutDashboard, FolderPlus, ArrowLeftRight, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navLinks = [
  { href: '/projects', label: 'Browse Projects', icon: Briefcase },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/post-project', label: 'Post Project', icon: FolderPlus },
  { href: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

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

        {/* Wallet Display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            padding: '6px 12px',
            borderRadius: 8,
            background: 'rgba(0, 206, 201, 0.1)',
            border: '1px solid rgba(0, 206, 201, 0.2)',
            fontSize: 12,
            color: 'var(--color-accent-teal-light)',
            fontWeight: 500,
            display: 'none',
          }} className="network-badge">
            Sepolia
          </div>
          <button
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: 13 }}
          >
            <Shield size={14} />
            Connect Wallet
          </button>

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
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
          .network-badge { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
          .network-badge { display: block !important; }
        }
      `}</style>
    </nav>
  );
}
