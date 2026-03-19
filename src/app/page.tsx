'use client';

import Link from 'next/link';
import { Shield, ArrowRight, Zap, Lock, Eye, Users, TrendingUp, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Escrow Protection',
    description: 'Funds are locked in smart contracts until milestones are approved. Neither party can run off with the money.',
    color: 'var(--color-accent-purple)',
    bgColor: 'rgba(108, 92, 231, 0.1)',
  },
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'Payments release automatically when milestones are verified. No banks, no delays, no intermediaries.',
    color: 'var(--color-accent-teal)',
    bgColor: 'rgba(0, 206, 201, 0.1)',
  },
  {
    icon: Eye,
    title: 'On-Chain Transparency',
    description: 'Every transaction is recorded on the blockchain. Both parties can verify the complete audit trail.',
    color: 'var(--color-accent-blue)',
    bgColor: 'rgba(116, 185, 255, 0.1)',
  },
  {
    icon: Users,
    title: 'Decentralized Disputes',
    description: 'Fair arbitration through community governance. No single entity controls the outcome.',
    color: 'var(--color-accent-coral)',
    bgColor: 'rgba(225, 112, 85, 0.1)',
  },
];

const stats = [
  { label: 'Projects Posted', value: '2,847', icon: TrendingUp },
  { label: 'ETH in Escrow', value: '1,234', icon: Lock },
  { label: 'Freelancers', value: '8,521', icon: Users },
  { label: 'Success Rate', value: '98.5%', icon: CheckCircle },
];

const steps = [
  { num: '01', title: 'Post Your Project', desc: 'Define milestones, set a budget in ETH, and describe your requirements.' },
  { num: '02', title: 'Choose a Freelancer', desc: 'Review bids from verified developers and select the best fit.' },
  { num: '03', title: 'Escrow Funds', desc: 'Smart contract locks your payment. Funds are safe until milestones are met.' },
  { num: '04', title: 'Release & Review', desc: 'Approve completed work and release payment automatically.' },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '100px 24px 80px',
        textAlign: 'center',
      }}>
        {/* Animated background orbs */}
        <div style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15), transparent 70%)',
          top: -200,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'pulseSlow 4s ease-in-out infinite',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.1), transparent 70%)',
          bottom: -100,
          right: -100,
          animation: 'pulseSlow 5s ease-in-out infinite 1s',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 16px',
            borderRadius: 20,
            background: 'rgba(108, 92, 231, 0.1)',
            border: '1px solid rgba(108, 92, 231, 0.2)',
            marginBottom: 24,
            fontSize: 13,
            color: 'var(--color-accent-purple-light)',
            fontWeight: 500,
          }}>
            <Shield size={14} />
            Powered by Ethereum Smart Contracts
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 20,
            letterSpacing: '-0.03em',
          }}>
            Hire Talent with{' '}
            <span className="gradient-text">Zero Trust</span>
            <br />Required
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--color-text-secondary)',
            maxWidth: 560,
            margin: '0 auto 36px',
            lineHeight: 1.6,
          }}>
            A decentralized freelance marketplace where smart contract escrows
            protect both clients and freelancers. Every payment is transparent,
            every milestone is verified.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/projects" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ padding: '14px 32px', fontSize: 16 }}>
                Browse Projects
                <ArrowRight size={18} />
              </button>
            </Link>
            <Link href="/post-project" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ padding: '14px 32px', fontSize: 16 }}>
                Post a Project
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="glass-card" style={{
                padding: '24px',
                textAlign: 'center',
              }}>
                <Icon size={24} style={{ color: 'var(--color-accent-purple-light)', marginBottom: 8 }} />
                <div style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginBottom: 4,
                }} className="gradient-text">
                  {stat.value}
                </div>
                <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Why <span className="gradient-text">TrustChain</span>?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Built on trustless technology so you don&apos;t have to trust anyone.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="glass-card" style={{ padding: '32px 28px' }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: feature.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text-primary)',
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 80px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            How It <span className="gradient-text-warm">Works</span>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--color-text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            Four simple steps from project posting to payment release.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 20,
        }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{
              position: 'relative',
              padding: '32px 24px',
              borderRadius: 16,
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-primary)',
              transition: 'all 0.3s ease',
              animation: `slideUp 0.5s ease-out ${i * 0.1}s both`,
            }}>
              <div style={{
                fontSize: 48,
                fontWeight: 800,
                position: 'absolute',
                top: 16,
                right: 20,
                opacity: 0.06,
                lineHeight: 1,
              }}>
                {step.num}
              </div>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-teal))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: 'white',
                marginBottom: 16,
              }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 100px',
      }}>
        <div className="glass-card" style={{
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute',
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108, 92, 231, 0.1), transparent 70%)',
            top: -100,
            right: -80,
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>
            Ready to Start <span className="gradient-text">Building</span>?
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--color-text-secondary)',
            maxWidth: 450,
            margin: '0 auto 28px',
          }}>
            Join thousands of developers and clients using smart contracts
            to make freelancing fair and transparent.
          </p>
          <Link href="/projects" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '14px 36px', fontSize: 16 }}>
              Explore the Marketplace
              <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--color-border-primary)',
        padding: '32px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={16} style={{ color: 'var(--color-accent-purple)' }} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>TrustChain</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
            © 2026 TrustChain. Built on Ethereum. Deployed on Sepolia testnet.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Docs</a>
            <a href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>GitHub</a>
            <a href="#" style={{ fontSize: 13, color: 'var(--color-text-muted)', textDecoration: 'none' }}>Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
