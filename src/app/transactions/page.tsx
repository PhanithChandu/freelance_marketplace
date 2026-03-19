'use client';

import { useStore } from '@/lib/store';
import { useState, useMemo } from 'react';
import { ArrowLeftRight, ExternalLink, Filter, Search, Briefcase, CheckCircle, DollarSign, AlertTriangle, Shield, Zap } from 'lucide-react';

const typeConfig: Record<string, { icon: typeof Briefcase; color: string; bg: string; label: string }> = {
  ProjectCreated: { icon: Briefcase, color: 'var(--color-accent-purple-light)', bg: 'rgba(108, 92, 231, 0.1)', label: 'Project Created' },
  EscrowDeployed: { icon: Shield, color: 'var(--color-accent-teal-light)', bg: 'rgba(0, 206, 201, 0.1)', label: 'Escrow Deployed' },
  EscrowFunded: { icon: DollarSign, color: 'var(--color-accent-amber)', bg: 'rgba(253, 203, 110, 0.1)', label: 'Escrow Funded' },
  MilestoneApproved: { icon: CheckCircle, color: 'var(--color-success)', bg: 'rgba(0, 184, 148, 0.1)', label: 'Milestone Approved' },
  PaymentReleased: { icon: Zap, color: 'var(--color-accent-teal-light)', bg: 'rgba(0, 206, 201, 0.1)', label: 'Payment Released' },
  DisputeRaised: { icon: AlertTriangle, color: 'var(--color-error)', bg: 'rgba(214, 48, 49, 0.1)', label: 'Dispute Raised' },
};

export default function TransactionsPage() {
  const { transactions } = useStore();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const filtered = useMemo(() => {
    return transactions
      .filter(tx => {
        if (search && !tx.projectTitle.toLowerCase().includes(search.toLowerCase()) && !tx.txHash.toLowerCase().includes(search.toLowerCase())) return false;
        if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [transactions, search, typeFilter]);

  // Stats
  const totalTx = transactions.length;
  const totalAmount = transactions.reduce((s, t) => s + (t.amount || 0), 0);
  const projectsCreated = transactions.filter(t => t.type === 'ProjectCreated').length;
  const paymentsReleased = transactions.filter(t => t.type === 'PaymentReleased' || t.type === 'MilestoneApproved').length;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          <span className="gradient-text">Transactions</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
          On-chain activity feed — every event is recorded and verifiable
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12,
        marginBottom: 28,
      }}>
        {[
          { label: 'Total Events', value: totalTx, icon: ArrowLeftRight, color: 'var(--color-accent-purple)' },
          { label: 'Value Transferred', value: `${totalAmount.toFixed(1)} ETH`, icon: DollarSign, color: 'var(--color-accent-teal)' },
          { label: 'Projects Created', value: projectsCreated, icon: Briefcase, color: 'var(--color-accent-amber)' },
          { label: 'Payments Made', value: paymentsReleased, icon: Zap, color: 'var(--color-success)' },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Icon size={16} style={{ color: stat.color }} />
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{stat.label}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={16} style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }} />
          <input
            className="input-field"
            placeholder="Search by project or tx hash..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
          <select
            className="input-field"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 170, padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="all">All Event Types</option>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((tx, i) => {
          const config = typeConfig[tx.type] || typeConfig.ProjectCreated;
          const Icon = config.icon;

          return (
            <div key={tx.id} className="glass-card" style={{
              padding: '18px 24px',
              animation: `slideUp 0.3s ease-out ${i * 0.03}s both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Event Icon */}
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: config.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={20} style={{ color: config.color }} />
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: config.bg, color: config.color, fontSize: 11 }}>
                      {config.label}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{tx.projectTitle}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {tx.details}
                  </p>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 11, color: 'var(--color-text-muted)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>Tx: {tx.txHash}</span>
                    <span>Block #{tx.blockNumber.toLocaleString()}</span>
                  </div>
                </div>

                {/* Right Side */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {tx.amount && (
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-accent-teal-light)', marginBottom: 4 }}>
                      {tx.amount} ETH
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {new Date(tx.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                    target="_blank"
                    rel="noopener"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 11,
                      color: 'var(--color-accent-blue)',
                      textDecoration: 'none',
                      marginTop: 4,
                    }}
                  >
                    <ExternalLink size={10} />
                    Etherscan
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
          <ArrowLeftRight size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>No transactions found</p>
          <p style={{ fontSize: 14 }}>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
