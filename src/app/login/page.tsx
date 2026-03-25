'use client';

import { useRouter } from 'next/navigation';
import { useWallet } from '@/lib/WalletProvider';
import { useRole } from '@/lib/RoleProvider';
import { Shield, Briefcase, Palette, ArrowRight, Sparkles, Users, FolderPlus } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { address, connect, isConnecting } = useWallet();
  const { setRole } = useRole();

  const handleRoleSelect = async (role: 'client' | 'designer') => {
    if (!address) {
      await connect();
      // After connect, the wallet state updates asynchronously.
      // We set the role optimistically — WalletProvider will update the address.
    }
    setRole(role);
    if (role === 'client') {
      router.push('/projects');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute',
        width: 500,
        height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108, 92, 231, 0.12), transparent 70%)',
        top: -150,
        left: -100,
        animation: 'pulseSlow 5s ease-in-out infinite',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 206, 201, 0.08), transparent 70%)',
        bottom: -100,
        right: -80,
        animation: 'pulseSlow 6s ease-in-out infinite 1s',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 48, position: 'relative' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 16px',
          borderRadius: 20,
          background: 'rgba(108, 92, 231, 0.1)',
          border: '1px solid rgba(108, 92, 231, 0.2)',
          marginBottom: 20,
          fontSize: 13,
          color: 'var(--color-accent-purple-light)',
          fontWeight: 500,
        }}>
          <Sparkles size={14} />
          Choose Your Role
        </div>

        <h1 style={{
          fontSize: 'clamp(28px, 5vw, 44px)',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: 12,
          letterSpacing: '-0.03em',
        }}>
          Welcome to <span className="gradient-text">TrustChain</span>
        </h1>
        <p style={{
          fontSize: 'clamp(14px, 2vw, 17px)',
          color: 'var(--color-text-secondary)',
          maxWidth: 480,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          Select how you want to use the marketplace. You can change your role anytime.
        </p>
      </div>

      {/* Role Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 24,
        maxWidth: 700,
        width: '100%',
        position: 'relative',
      }}>
        {/* Client Card */}
        <button
          onClick={() => handleRoleSelect('client')}
          disabled={isConnecting}
          style={{
            padding: '40px 32px',
            borderRadius: 20,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(116, 185, 255, 0.4)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(116, 185, 255, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116, 185, 255, 0.08), transparent 70%)',
            top: -60,
            right: -60,
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'rgba(116, 185, 255, 0.1)',
            border: '1px solid rgba(116, 185, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Briefcase size={28} style={{ color: 'var(--color-accent-blue)' }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--color-text-primary)' }}>
            I&apos;m a Client
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Browse projects, hire talented designers, and manage escrow payments securely.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {['Browse & discover projects', 'Hire freelance designers', 'Manage milestone payments'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <Users size={14} style={{ color: 'var(--color-accent-blue)' }} />
                {item}
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-accent-blue)',
          }}>
            Enter as Client
            <ArrowRight size={16} />
          </div>
        </button>

        {/* Designer Card */}
        <button
          onClick={() => handleRoleSelect('designer')}
          disabled={isConnecting}
          style={{
            padding: '40px 32px',
            borderRadius: 20,
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border-primary)',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            textAlign: 'left',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'rgba(108, 92, 231, 0.4)';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(108, 92, 231, 0.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--color-border-primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Glow */}
          <div style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.08), transparent 70%)',
            top: -60,
            right: -60,
            pointerEvents: 'none',
          }} />

          <div style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: 'rgba(108, 92, 231, 0.1)',
            border: '1px solid rgba(108, 92, 231, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}>
            <Palette size={28} style={{ color: 'var(--color-accent-purple-light)' }} />
          </div>

          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, color: 'var(--color-text-primary)' }}>
            I&apos;m a Designer
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
            Post your projects, set milestones, receive bids, and get paid through smart contracts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {['Post & manage projects', 'Define milestones & pricing', 'Receive secure ETH payments'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                <FolderPlus size={14} style={{ color: 'var(--color-accent-purple-light)' }} />
                {item}
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--color-accent-purple-light)',
          }}>
            Enter as Designer
            <ArrowRight size={16} />
          </div>
        </button>
      </div>

      {/* Bottom note */}
      <p style={{
        marginTop: 36,
        fontSize: 13,
        color: 'var(--color-text-muted)',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <Shield size={14} />
        Secured by MetaMask — your wallet is your identity
      </p>
    </div>
  );
}
