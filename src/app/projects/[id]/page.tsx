'use client';

import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useState } from 'react';
import { ArrowLeft, DollarSign, Clock, Users, CheckCircle, Circle, Send, Briefcase, Calendar, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { projects, addBid, acceptBid } = useStore();
  const project = projects.find(p => p.id === params.id);

  const [bidAmount, setBidAmount] = useState('');
  const [bidTimeline, setBidTimeline] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  if (!project) {
    return (
      <div className="page-container" style={{ textAlign: 'center', paddingTop: 100 }}>
        <Briefcase size={48} style={{ marginBottom: 16, opacity: 0.3, color: 'var(--color-text-muted)' }} />
        <p style={{ fontSize: 18, color: 'var(--color-text-muted)' }}>Project not found</p>
        <Link href="/projects" style={{ color: 'var(--color-accent-purple-light)', fontSize: 14 }}>← Back to projects</Link>
      </div>
    );
  }

  const handleSubmitBid = () => {
    if (!bidAmount || !bidTimeline || !bidMessage) return;
    const newBid = {
      id: `bid-${Date.now()}`,
      projectId: project.id,
      freelancerAddress: '0xYOUR...ADDR',
      amount: parseFloat(bidAmount),
      timeline: parseInt(bidTimeline),
      message: bidMessage,
      createdAt: new Date().toISOString(),
      status: 'pending' as const,
    };
    addBid(project.id, newBid);
    setBidSubmitted(true);
    setBidAmount('');
    setBidTimeline('');
    setBidMessage('');
    setTimeout(() => setBidSubmitted(false), 3000);
  };

  const handleAcceptBid = (bidId: string) => {
    acceptBid(project.id, bidId);
    router.push('/dashboard');
  };

  return (
    <div className="page-container">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'transparent',
          border: 'none',
          color: 'var(--color-text-secondary)',
          cursor: 'pointer',
          fontSize: 14,
          marginBottom: 24,
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        Back to Projects
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, alignItems: 'start' }}>
        {/* Main Content */}
        <div>
          {/* Project Header */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
              <span className="badge badge-purple">{project.category}</span>
              <span className="badge" style={{
                background: project.status === 'open' ? 'rgba(0, 184, 148, 0.15)' : 'rgba(108, 92, 231, 0.15)',
                color: project.status === 'open' ? 'var(--color-success)' : 'var(--color-accent-purple-light)',
              }}>
                {project.status === 'open' ? 'Open' : project.status === 'in_progress' ? 'In Progress' : 'Completed'}
              </span>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
              {project.title}
            </h1>

            <p style={{
              fontSize: 15,
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: 20,
            }}>
              {project.description}
            </p>

            <div style={{
              display: 'flex',
              gap: 24,
              paddingTop: 16,
              borderTop: '1px solid var(--color-border-primary)',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <DollarSign size={16} style={{ color: 'var(--color-accent-teal)' }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Budget</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>{project.budget} ETH</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} style={{ color: 'var(--color-text-muted)' }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Deadline</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Users size={16} style={{ color: 'var(--color-text-muted)' }} />
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Client</div>
                  <div style={{ fontSize: 14, fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{project.clientAddress}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="glass-card" style={{ padding: '28px', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle size={18} style={{ color: 'var(--color-accent-purple)' }} />
              Milestones ({project.milestones.length})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {project.milestones.map((ms, i) => (
                <div key={ms.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px',
                  borderRadius: 12,
                  background: 'var(--color-bg-tertiary)',
                  border: `1px solid ${ms.approved ? 'rgba(0, 184, 148, 0.3)' : 'var(--color-border-primary)'}`,
                }}>
                  <div style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: ms.approved ? 'rgba(0, 184, 148, 0.15)' : 'var(--color-bg-card)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    {ms.approved ? (
                      <CheckCircle size={14} style={{ color: 'var(--color-success)' }} />
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)' }}>{i + 1}</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{ms.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{ms.description}</div>
                  </div>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'var(--color-accent-teal-light)',
                    whiteSpace: 'nowrap',
                  }}>
                    {ms.amount} ETH
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bids Section */}
          <div className="glass-card" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={18} style={{ color: 'var(--color-accent-coral)' }} />
              Bids ({project.bids.length})
            </h2>

            {project.bids.length === 0 ? (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                No bids yet — be the first to submit a proposal!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {project.bids.map(bid => (
                  <div key={bid.id} style={{
                    padding: '16px',
                    borderRadius: 12,
                    background: 'var(--color-bg-tertiary)',
                    border: `1px solid ${bid.status === 'accepted' ? 'rgba(0, 184, 148, 0.3)' : 'var(--color-border-primary)'}`,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-teal))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          <Users size={14} color="white" />
                        </div>
                        <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)' }}>
                          {bid.freelancerAddress}
                        </span>
                      </div>
                      <span className="badge" style={{
                        background: bid.status === 'accepted' ? 'rgba(0,184,148,0.15)' : bid.status === 'rejected' ? 'rgba(214,48,49,0.15)' : 'rgba(253,203,110,0.15)',
                        color: bid.status === 'accepted' ? 'var(--color-success)' : bid.status === 'rejected' ? 'var(--color-error)' : 'var(--color-accent-amber)',
                      }}>
                        {bid.status}
                      </span>
                    </div>
                    <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                      {bid.message}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>
                          {bid.amount} ETH
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> {bid.timeline} days
                        </span>
                      </div>
                      {project.status === 'open' && bid.status === 'pending' && (
                        <button className="btn-success" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => handleAcceptBid(bid.id)}>
                          Accept Bid
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 88 }}>
          {/* Bid Submission Form */}
          {project.status === 'open' && (
            <div className="glass-card" style={{ padding: '28px', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} style={{ color: 'var(--color-accent-purple)' }} />
                Submit a Bid
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                    Your Price (ETH)
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    step="0.01"
                    placeholder="e.g. 2.5"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                    Timeline (days)
                  </label>
                  <input
                    className="input-field"
                    type="number"
                    placeholder="e.g. 30"
                    value={bidTimeline}
                    onChange={e => setBidTimeline(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-muted)', display: 'block', marginBottom: 6 }}>
                    Proposal Message
                  </label>
                  <textarea
                    className="input-field"
                    placeholder="Describe your experience and approach..."
                    value={bidMessage}
                    onChange={e => setBidMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <button className="btn-primary" onClick={handleSubmitBid} style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={14} />
                  Submit Bid
                </button>

                {bidSubmitted && (
                  <div style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(0, 184, 148, 0.1)',
                    border: '1px solid rgba(0, 184, 148, 0.2)',
                    color: 'var(--color-success)',
                    fontSize: 13,
                    textAlign: 'center',
                    animation: 'slideDown 0.3s ease-out',
                  }}>
                    ✓ Bid submitted successfully!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Info Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Project Info
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Posted</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Deadline</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{new Date(project.deadline).toLocaleDateString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Milestones</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{project.milestones.length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Total Bids</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{project.bids.length}</span>
              </div>
              {project.escrowId && (
                <Link href={`/escrow/${project.escrowId}`} style={{ textDecoration: 'none' }}>
                  <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                    <ExternalLink size={14} />
                    View Escrow
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
