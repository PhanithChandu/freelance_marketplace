'use client';

import { useStore } from '@/lib/store';
import Link from 'next/link';
import { LayoutDashboard, DollarSign, Briefcase, CheckCircle, Clock, Users, ExternalLink, ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { projects, escrows } = useStore();

  const myProjects = projects; // In real app, filter by connected wallet
  const openProjects = myProjects.filter(p => p.status === 'open');
  const activeProjects = myProjects.filter(p => p.status === 'in_progress');
  const completedProjects = myProjects.filter(p => p.status === 'completed');
  const totalBids = myProjects.reduce((s, p) => s + p.bids.length, 0);
  const totalValue = myProjects.reduce((s, p) => s + p.budget, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
          Manage your projects, track escrows, and review milestones
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {[
          { label: 'Total Projects', value: myProjects.length, icon: Briefcase, color: 'var(--color-accent-purple)' },
          { label: 'Open Projects', value: openProjects.length, icon: Clock, color: 'var(--color-accent-teal)' },
          { label: 'Active Escrows', value: escrows.filter(e => e.state !== 'Completed' && e.state !== 'Refunded').length, icon: DollarSign, color: 'var(--color-accent-amber)' },
          { label: 'Total Bids', value: totalBids, icon: Users, color: 'var(--color-accent-coral)' },
          { label: 'Total Value', value: `${totalValue.toFixed(1)} ETH`, icon: TrendingUp, color: 'var(--color-accent-blue)' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Active Escrows */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <DollarSign size={20} style={{ color: 'var(--color-accent-teal)' }} />
            Active Escrows
          </h2>
        </div>

        {escrows.length === 0 ? (
          <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-muted)' }}>No active escrows yet</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {escrows.map(escrow => {
              const completedMs = escrow.milestones.filter(m => m.approved).length;
              const progress = (completedMs / escrow.milestones.length) * 100;

              return (
                <Link key={escrow.id} href={`/escrow/${escrow.id}`} style={{ textDecoration: 'none' }}>
                  <div className="glass-card" style={{ padding: '20px 24px', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{escrow.projectTitle}</h3>
                        <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--color-text-secondary)' }}>
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{escrow.contractAddress}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge" style={{
                          background: escrow.state === 'Completed' ? 'rgba(0,184,148,0.15)' : 'rgba(108,92,231,0.15)',
                          color: escrow.state === 'Completed' ? 'var(--color-success)' : 'var(--color-accent-purple-light)',
                        }}>
                          {escrow.state}
                        </span>
                        <div style={{ fontSize: 18, fontWeight: 700, marginTop: 8, color: 'var(--color-accent-teal-light)' }}>
                          {escrow.totalAmount} ETH
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {completedMs} of {escrow.milestones.length} milestones
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--color-accent-purple-light)', fontWeight: 500 }}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div style={{
                        height: 6,
                        background: 'var(--color-bg-tertiary)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: 'linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-teal))',
                          borderRadius: 3,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        <span>Client: {escrow.clientAddress}</span>
                        <span>Freelancer: {escrow.freelancerAddress}</span>
                      </div>
                      <ArrowRight size={14} style={{ color: 'var(--color-text-muted)' }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Projects */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Briefcase size={20} style={{ color: 'var(--color-accent-purple)' }} />
            Your Projects
          </h2>
          <Link href="/post-project" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: 13 }}>
              + New Project
            </button>
          </Link>
        </div>

        <div style={{ display: 'grid', gap: 12 }}>
          {myProjects.slice(0, 5).map(project => (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{ padding: '18px 24px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: project.status === 'open' ? 'var(--color-success)' : project.status === 'in_progress' ? 'var(--color-accent-purple)' : 'var(--color-accent-blue)',
                    }} />
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 600 }}>{project.title}</h3>
                      <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                        <span>{project.category}</span>
                        <span>•</span>
                        <span>{project.bids.length} bids</span>
                        <span>•</span>
                        <span>{project.milestones.length} milestones</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>
                      {project.budget} ETH
                    </div>
                    <span className="badge" style={{
                      background: project.status === 'open' ? 'rgba(0,184,148,0.15)' : project.status === 'in_progress' ? 'rgba(108,92,231,0.15)' : 'rgba(116,185,255,0.15)',
                      color: project.status === 'open' ? 'var(--color-success)' : project.status === 'in_progress' ? 'var(--color-accent-purple-light)' : 'var(--color-accent-blue)',
                      fontSize: 11,
                      marginTop: 4,
                    }}>
                      {project.status === 'open' ? 'Open' : project.status === 'in_progress' ? 'In Progress' : 'Completed'}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
