'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { EscrowState } from '@/lib/types';
import { ArrowLeft, Shield, DollarSign, CheckCircle, Circle, AlertTriangle, Clock, ExternalLink, Lock, Unlock, FileText } from 'lucide-react';
import Link from 'next/link';

const stateFlow: EscrowState[] = [
  EscrowState.AwaitingDeposit,
  EscrowState.Funded,
  EscrowState.InProgress,
  EscrowState.UnderReview,
  EscrowState.Released,
  EscrowState.Completed,
];

const stateColors: Record<string, { bg: string; text: string; border: string }> = {
  [EscrowState.AwaitingDeposit]: { bg: 'rgba(253, 203, 110, 0.1)', text: 'var(--color-accent-amber)', border: 'rgba(253, 203, 110, 0.3)' },
  [EscrowState.Funded]: { bg: 'rgba(0, 206, 201, 0.1)', text: 'var(--color-accent-teal-light)', border: 'rgba(0, 206, 201, 0.3)' },
  [EscrowState.InProgress]: { bg: 'rgba(108, 92, 231, 0.1)', text: 'var(--color-accent-purple-light)', border: 'rgba(108, 92, 231, 0.3)' },
  [EscrowState.UnderReview]: { bg: 'rgba(116, 185, 255, 0.1)', text: 'var(--color-accent-blue)', border: 'rgba(116, 185, 255, 0.3)' },
  [EscrowState.Released]: { bg: 'rgba(0, 184, 148, 0.1)', text: 'var(--color-success)', border: 'rgba(0, 184, 148, 0.3)' },
  [EscrowState.Completed]: { bg: 'rgba(0, 184, 148, 0.15)', text: 'var(--color-success)', border: 'rgba(0, 184, 148, 0.4)' },
  [EscrowState.Disputed]: { bg: 'rgba(214, 48, 49, 0.1)', text: 'var(--color-error)', border: 'rgba(214, 48, 49, 0.3)' },
  [EscrowState.Refunded]: { bg: 'rgba(214, 48, 49, 0.1)', text: 'var(--color-error)', border: 'rgba(214, 48, 49, 0.3)' },
};

const stateIcons: Record<string, typeof Clock> = {
  [EscrowState.AwaitingDeposit]: Clock,
  [EscrowState.Funded]: Lock,
  [EscrowState.InProgress]: Shield,
  [EscrowState.UnderReview]: FileText,
  [EscrowState.Released]: Unlock,
  [EscrowState.Completed]: CheckCircle,
  [EscrowState.Disputed]: AlertTriangle,
  [EscrowState.Refunded]: AlertTriangle,
};

export default function EscrowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { escrows, approveMilestone, completeMilestone, updateEscrowState } = useStore();
  const escrow = escrows.find(e => e.id === params.id);

  if (!escrow) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <Shield size={48} style={{ marginBottom: 16, opacity: 0.3, color: 'var(--color-text-muted)' }} />
        <p style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Escrow not found</p>
        <Link href="/dashboard" style={{ color: 'var(--color-accent-purple-light)', fontSize: 14 }}>← Back to dashboard</Link>
      </div>
    );
  }

  const currentStateIndex = stateFlow.indexOf(escrow.state);
  const completedMs = escrow.milestones.filter(m => m.approved).length;
  const progress = (completedMs / escrow.milestones.length) * 100;
  const colors = stateColors[escrow.state] || stateColors[EscrowState.InProgress];

  const handleApprove = (milestoneId: string) => {
    approveMilestone(escrow.id, milestoneId);
  };

  const handleComplete = (milestoneId: string) => {
    const url = prompt('Enter evidence URL (IPFS CID or link):');
    if (url) completeMilestone(escrow.id, milestoneId, url);
  };

  const handleDispute = () => {
    updateEscrowState(escrow.id, EscrowState.Disputed);
  };

  const handleRelease = () => {
    updateEscrowState(escrow.id, EscrowState.Completed);
  };

  return (
    <div className="page-container">
      {/* Back */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'transparent', border: 'none',
          color: 'var(--color-text-secondary)', cursor: 'pointer',
          fontSize: 14, marginBottom: 24, padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Escrow Header */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
              {escrow.projectTitle}
            </h1>
            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)' }}>Contract: {escrow.contractAddress}</span>
              <span>•</span>
              <span>Created {new Date(escrow.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div style={{
            padding: '12px 20px',
            borderRadius: 14,
            background: colors.bg,
            border: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              STATUS
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
              {escrow.state}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid var(--color-border-primary)',
        }}>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--color-bg-tertiary)' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Total Locked</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-accent-teal-light)' }}>{escrow.totalAmount} ETH</div>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--color-bg-tertiary)' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Client</div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{escrow.clientAddress}</div>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--color-bg-tertiary)' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Freelancer</div>
            <div style={{ fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{escrow.freelancerAddress}</div>
          </div>
          <div style={{ padding: '12px 16px', borderRadius: 10, background: 'var(--color-bg-tertiary)' }}>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 4 }}>Progress</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{Math.round(progress)}%</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* Main Content */}
        <div>
          {/* State Machine Visualization */}
          <div className="glass-card" style={{ padding: '28px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={18} style={{ color: 'var(--color-accent-purple)' }} />
              Escrow Lifecycle
            </h2>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
              overflowX: 'auto',
              padding: '8px 0',
            }}>
              {stateFlow.map((state, i) => {
                const isPast = i < currentStateIndex;
                const isCurrent = i === currentStateIndex;
                const isFuture = i > currentStateIndex;
                const isDisputed = escrow.state === EscrowState.Disputed;
                const sc = stateColors[state];
                const Icon = stateIcons[state];

                return (
                  <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      minWidth: 80,
                    }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: isPast ? 'var(--color-success)' : isCurrent ? sc.bg : 'var(--color-bg-tertiary)',
                        border: `2px solid ${isPast ? 'var(--color-success)' : isCurrent ? sc.text : 'var(--color-border-primary)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.5s ease',
                        boxShadow: isCurrent ? `0 0 20px ${sc.border}` : 'none',
                        animation: isCurrent ? 'glow 2s ease-in-out infinite alternate' : 'none',
                      }}>
                        {isPast ? (
                          <CheckCircle size={20} style={{ color: 'white' }} />
                        ) : (
                          <Icon size={20} style={{ color: isCurrent ? sc.text : 'var(--color-text-muted)' }} />
                        )}
                      </div>
                      <span style={{
                        fontSize: 11,
                        fontWeight: isCurrent ? 600 : 400,
                        color: isPast ? 'var(--color-success)' : isCurrent ? sc.text : 'var(--color-text-muted)',
                        textAlign: 'center',
                        maxWidth: 80,
                        lineHeight: 1.3,
                      }}>
                        {state}
                      </span>
                    </div>
                    {i < stateFlow.length - 1 && (
                      <div style={{
                        width: 40,
                        height: 2,
                        background: isPast ? 'var(--color-success)' : 'var(--color-border-primary)',
                        transition: 'background 0.5s ease',
                        marginBottom: 24,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>

            {escrow.state === EscrowState.Disputed && (
              <div style={{
                marginTop: 16,
                padding: '12px 16px',
                borderRadius: 10,
                background: 'rgba(214, 48, 49, 0.08)',
                border: '1px solid rgba(214, 48, 49, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 13,
                color: 'var(--color-error)',
              }}>
                <AlertTriangle size={16} />
                This escrow is currently under dispute. Arbitration is in progress.
              </div>
            )}
          </div>

          {/* Milestone Checklist */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} style={{ color: 'var(--color-accent-teal)' }} />
              Milestone Checklist
            </h2>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
              {completedMs} of {escrow.milestones.length} milestones approved
            </p>

            {/* Progress Bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                height: 8,
                background: 'var(--color-bg-tertiary)',
                borderRadius: 4,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, var(--color-accent-purple), var(--color-accent-teal))',
                  borderRadius: 4,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {escrow.milestones.map((ms, i) => (
                <div key={ms.id} style={{
                  padding: '18px 20px',
                  borderRadius: 14,
                  background: 'var(--color-bg-tertiary)',
                  border: `1px solid ${ms.approved ? 'rgba(0, 184, 148, 0.3)' : ms.completed ? 'rgba(116, 185, 255, 0.3)' : 'var(--color-border-primary)'}`,
                  transition: 'all 0.3s ease',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: ms.approved ? 'var(--color-success)' : ms.completed ? 'rgba(116, 185, 255, 0.15)' : 'var(--color-bg-card)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}>
                      {ms.approved ? (
                        <CheckCircle size={14} style={{ color: 'white' }} />
                      ) : ms.completed ? (
                        <Clock size={14} style={{ color: 'var(--color-accent-blue)' }} />
                      ) : (
                        <Circle size={14} style={{ color: 'var(--color-text-muted)' }} />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: 15,
                        fontWeight: 600,
                        marginBottom: 4,
                        color: ms.approved ? 'var(--color-success)' : 'var(--color-text-primary)',
                      }}>
                        {ms.title}
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>
                        {ms.description}
                      </div>
                      {ms.evidenceUrl && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-accent-blue)' }}>
                          <ExternalLink size={12} />
                          <a href={ms.evidenceUrl} target="_blank" rel="noopener" style={{ color: 'inherit' }}>
                            View Evidence
                          </a>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>
                        {ms.amount} ETH
                      </div>
                      {ms.approved ? (
                        <span className="badge badge-success" style={{ fontSize: 11 }}>Approved ✓</span>
                      ) : ms.completed ? (
                        <button className="btn-success" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => handleApprove(ms.id)}>
                          Approve
                        </button>
                      ) : (
                        <button className="btn-secondary" style={{ padding: '5px 14px', fontSize: 12 }} onClick={() => handleComplete(ms.id)}>
                          Submit Work
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 88 }}>
          {/* Fund Lock Indicator */}
          <div className="glass-card" style={{
            padding: '28px',
            textAlign: 'center',
            marginBottom: 16,
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 206, 201, 0.08), transparent 70%)',
              top: -60,
              right: -60,
              pointerEvents: 'none',
            }} />

            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-teal))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              animation: escrow.state !== EscrowState.Completed ? 'pulseSlow 3s ease-in-out infinite' : 'none',
            }}>
              <Lock size={28} color="white" />
            </div>

            <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Funds Locked
            </div>
            <div style={{ fontSize: 36, fontWeight: 800 }} className="gradient-text">
              {escrow.totalAmount} ETH
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>
              ≈ ${(escrow.totalAmount * 3200).toLocaleString()} USD
            </div>
          </div>

          {/* Action Buttons */}
          {escrow.state !== EscrowState.Completed && escrow.state !== EscrowState.Refunded && escrow.state !== EscrowState.Disputed && (
            <div className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {escrow.milestones.every(m => m.approved) && (
                  <button className="btn-success" style={{ width: '100%', justifyContent: 'center' }} onClick={handleRelease}>
                    <Unlock size={16} />
                    Release All Funds
                  </button>
                )}
                <button className="btn-danger" style={{ width: '100%', justifyContent: 'center' }} onClick={handleDispute}>
                  <AlertTriangle size={16} />
                  Raise Dispute
                </button>
              </div>
            </div>
          )}

          {/* Contract Info */}
          <div className="glass-card" style={{ padding: '24px', marginTop: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contract Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Contract Address</div>
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>{escrow.contractAddress}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>Network</div>
                <div style={{ fontSize: 12, color: 'var(--color-accent-teal-light)' }}>Sepolia Testnet</div>
              </div>
              <a
                href={`https://sepolia.etherscan.io/address/${escrow.contractAddress}`}
                target="_blank"
                rel="noopener"
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', fontSize: 12, padding: '8px 16px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} />
                View on Etherscan
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 320px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
