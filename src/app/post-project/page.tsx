'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useWallet } from '@/lib/WalletProvider';
import { Project, Milestone, ProjectCategory } from '@/lib/types';
import { FolderPlus, Plus, Trash2, CheckCircle, ArrowRight, DollarSign } from 'lucide-react';

export default function PostProjectPage() {
  const router = useRouter();
  const { addProject } = useStore();
  const { address, connect } = useWallet();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProjectCategory>(ProjectCategory.WebDevelopment);
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [milestones, setMilestones] = useState<{ title: string; description: string; amount: string }[]>([
    { title: '', description: '', amount: '' },
  ]);

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', description: '', amount: '' }]);
  };

  const removeMilestone = (idx: number) => {
    setMilestones(milestones.filter((_, i) => i !== idx));
  };

  const updateMilestone = (idx: number, field: string, value: string) => {
    setMilestones(milestones.map((m, i) => i === idx ? { ...m, [field]: value } : m));
  };

  const handleSubmit = async () => {
    if (!address) {
      await connect();
      return;
    }

    const projectMilestones: Milestone[] = milestones.map((m, i) => ({
      id: `ms-new-${Date.now()}-${i}`,
      title: m.title,
      description: m.description,
      amount: parseFloat(m.amount) || 0,
      completed: false,
      approved: false,
    }));

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title,
      description,
      category,
      budget: parseFloat(budget) || 0,
      milestones: projectMilestones,
      clientAddress: address,
      status: 'open',
      createdAt: new Date().toISOString(),
      deadline: new Date(deadline).toISOString(),
      bids: [],
    };

    addProject(newProject);
    router.push('/dashboard');
  };

  const totalMilestoneAmount = milestones.reduce((s, m) => s + (parseFloat(m.amount) || 0), 0);

  return (
    <div className="page-container" style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Post a <span className="gradient-text">Project</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
          Define your requirements and milestones to get started
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 32,
        alignItems: 'center',
      }}>
        {['Details', 'Milestones', 'Review'].map((label, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, flex: i < 2 ? 1 : 'unset' }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: step > i + 1 ? 'var(--color-success)' : step === i + 1 ? 'linear-gradient(135deg, var(--color-accent-purple), var(--color-accent-teal))' : 'var(--color-bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 13,
              fontWeight: 600,
              color: step >= i + 1 ? 'white' : 'var(--color-text-muted)',
              flexShrink: 0,
            }}>
              {step > i + 1 ? <CheckCircle size={16} /> : i + 1}
            </div>
            <span style={{
              fontSize: 13,
              fontWeight: step === i + 1 ? 600 : 400,
              color: step === i + 1 ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
            }}>
              {label}
            </span>
            {i < 2 && (
              <div style={{
                flex: 1,
                height: 2,
                background: step > i + 1 ? 'var(--color-success)' : 'var(--color-border-primary)',
                borderRadius: 1,
                marginLeft: 8,
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Project Details */}
      {step === 1 && (
        <div className="glass-card" style={{ padding: '32px', animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8 }}>
            <FolderPlus size={20} style={{ color: 'var(--color-accent-purple)' }} />
            Project Details
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8 }}>
                Project Title *
              </label>
              <input
                className="input-field"
                placeholder="e.g. DeFi Dashboard Development"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8 }}>
                Description *
              </label>
              <textarea
                className="input-field"
                placeholder="Describe your project requirements in detail..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={5}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8 }}>
                  Category *
                </label>
                <select
                  className="input-field"
                  value={category}
                  onChange={e => setCategory(e.target.value as ProjectCategory)}
                  style={{ cursor: 'pointer' }}
                >
                  {Object.values(ProjectCategory).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8 }}>
                  Total Budget (ETH) *
                </label>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 2.5"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-secondary)', display: 'block', marginBottom: 8 }}>
                Deadline *
              </label>
              <input
                className="input-field"
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn-primary"
              onClick={() => setStep(2)}
              disabled={!title || !description || !budget || !deadline}
              style={{ opacity: !title || !description || !budget || !deadline ? 0.5 : 1 }}
            >
              Next: Milestones
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Milestones */}
      {step === 2 && (
        <div className="glass-card" style={{ padding: '32px', animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={20} style={{ color: 'var(--color-accent-teal)' }} />
            Define Milestones
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
            Break your project into verifiable deliverables. Budget: {budget} ETH total | Allocated: {totalMilestoneAmount.toFixed(2)} ETH
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {milestones.map((ms, i) => (
              <div key={i} style={{
                padding: '20px',
                borderRadius: 12,
                background: 'var(--color-bg-tertiary)',
                border: '1px solid var(--color-border-primary)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-accent-purple-light)' }}>
                    Milestone {i + 1}
                  </span>
                  {milestones.length > 1 && (
                    <button
                      onClick={() => removeMilestone(i)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-error)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input
                    className="input-field"
                    placeholder="Milestone title"
                    value={ms.title}
                    onChange={e => updateMilestone(i, 'title', e.target.value)}
                  />
                  <input
                    className="input-field"
                    placeholder="Brief description of deliverables"
                    value={ms.description}
                    onChange={e => updateMilestone(i, 'description', e.target.value)}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DollarSign size={14} style={{ color: 'var(--color-accent-teal)' }} />
                    <input
                      className="input-field"
                      type="number"
                      step="0.01"
                      placeholder="Amount in ETH"
                      value={ms.amount}
                      onChange={e => updateMilestone(i, 'amount', e.target.value)}
                      style={{ width: 160 }}
                    />
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>ETH</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={addMilestone}
            className="btn-secondary"
            style={{ marginTop: 16, width: '100%', justifyContent: 'center' }}
          >
            <Plus size={16} />
            Add Milestone
          </button>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Back
            </button>
            <button
              className="btn-primary"
              onClick={() => setStep(3)}
              disabled={milestones.some(m => !m.title || !m.amount)}
              style={{ opacity: milestones.some(m => !m.title || !m.amount) ? 0.5 : 1 }}
            >
              Next: Review
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review & Submit */}
      {step === 3 && (
        <div className="glass-card" style={{ padding: '32px', animation: 'fadeIn 0.3s ease-out' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
            Review & Submit
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--color-bg-tertiary)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Title</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
            </div>

            <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--color-bg-tertiary)' }}>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Description</div>
              <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--color-text-secondary)' }}>{description}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--color-bg-tertiary)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Category</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{category}</div>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--color-bg-tertiary)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Budget</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>{budget} ETH</div>
              </div>
              <div style={{ padding: '16px 20px', borderRadius: 12, background: 'var(--color-bg-tertiary)' }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Deadline</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{new Date(deadline).toLocaleDateString()}</div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Milestones ({milestones.length})</div>
              {milestones.map((ms, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--color-bg-tertiary)',
                  marginBottom: 8,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{ms.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{ms.description}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>
                    {ms.amount} ETH
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            marginTop: 24,
            padding: '14px 20px',
            borderRadius: 12,
            background: 'rgba(108, 92, 231, 0.08)',
            border: '1px solid rgba(108, 92, 231, 0.2)',
            fontSize: 13,
            color: 'var(--color-accent-purple-light)',
            lineHeight: 1.5,
          }}>
            ⚡ Once a freelancer is selected, an escrow smart contract will be deployed
            and your funds will be locked until milestones are approved.
          </div>

          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Back
            </button>
            <button className="btn-primary" onClick={handleSubmit} style={{ padding: '12px 28px' }}>
              <FolderPlus size={16} />
              Post Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
