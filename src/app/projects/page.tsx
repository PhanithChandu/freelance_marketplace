'use client';

import Link from 'next/link';
import { useStore } from '@/lib/store';
import { ProjectCategory } from '@/lib/types';
import { Search, Filter, Briefcase, Clock, DollarSign, Users, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

const categoryColors: Record<string, { bg: string; text: string }> = {
  [ProjectCategory.WebDevelopment]: { bg: 'rgba(108, 92, 231, 0.15)', text: 'var(--color-accent-purple-light)' },
  [ProjectCategory.SmartContracts]: { bg: 'rgba(0, 206, 201, 0.15)', text: 'var(--color-accent-teal-light)' },
  [ProjectCategory.Design]: { bg: 'rgba(253, 203, 110, 0.15)', text: 'var(--color-accent-amber)' },
  [ProjectCategory.Marketing]: { bg: 'rgba(225, 112, 85, 0.15)', text: 'var(--color-accent-coral)' },
  [ProjectCategory.Writing]: { bg: 'rgba(116, 185, 255, 0.15)', text: 'var(--color-accent-blue)' },
  [ProjectCategory.DataScience]: { bg: 'rgba(253, 121, 168, 0.15)', text: 'var(--color-accent-pink)' },
  [ProjectCategory.Mobile]: { bg: 'rgba(108, 92, 231, 0.15)', text: 'var(--color-accent-purple-light)' },
  [ProjectCategory.DevOps]: { bg: 'rgba(0, 184, 148, 0.15)', text: 'var(--color-success)' },
};

const statusMap: Record<string, { label: string; bg: string; text: string }> = {
  open: { label: 'Open', bg: 'rgba(0, 184, 148, 0.15)', text: 'var(--color-success)' },
  in_progress: { label: 'In Progress', bg: 'rgba(108, 92, 231, 0.15)', text: 'var(--color-accent-purple-light)' },
  completed: { label: 'Completed', bg: 'rgba(116, 185, 255, 0.15)', text: 'var(--color-accent-blue)' },
  cancelled: { label: 'Cancelled', bg: 'rgba(214, 48, 49, 0.15)', text: 'var(--color-error)' },
};

export default function ProjectsPage() {
  const { projects } = useStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (budgetFilter === '<1' && p.budget >= 1) return false;
      if (budgetFilter === '1-3' && (p.budget < 1 || p.budget > 3)) return false;
      if (budgetFilter === '3-5' && (p.budget < 3 || p.budget > 5)) return false;
      if (budgetFilter === '>5' && p.budget <= 5) return false;
      return true;
    });
  }, [projects, search, categoryFilter, statusFilter, budgetFilter]);

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Browse <span className="gradient-text">Projects</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>
          Find your next opportunity — {projects.filter(p => p.status === 'open').length} open projects available
        </p>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{
          flex: 1,
          minWidth: 250,
          position: 'relative',
        }}>
          <Search size={16} style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-text-muted)',
          }} />
          <input
            className="input-field"
            placeholder="Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 40 }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />

          <select
            className="input-field"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 150, padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            {Object.values(ProjectCategory).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="input-field"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 120, padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="input-field"
            value={budgetFilter}
            onChange={e => setBudgetFilter(e.target.value)}
            style={{ width: 'auto', minWidth: 130, padding: '10px 14px', cursor: 'pointer' }}
          >
            <option value="all">All Budgets</option>
            <option value="<1">&lt; 1 ETH</option>
            <option value="1-3">1 – 3 ETH</option>
            <option value="3-5">3 – 5 ETH</option>
            <option value=">5">&gt; 5 ETH</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
        Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Project Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: 16,
      }}>
        {filtered.map((project, i) => {
          const catColor = categoryColors[project.category] || categoryColors[ProjectCategory.WebDevelopment];
          const status = statusMap[project.status];

          return (
            <Link key={project.id} href={`/projects/${project.id}`} style={{ textDecoration: 'none' }}>
              <div className="glass-card" style={{
                padding: '24px',
                cursor: 'pointer',
                animation: `slideUp 0.4s ease-out ${i * 0.05}s both`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span className="badge" style={{ background: catColor.bg, color: catColor.text }}>
                      {project.category}
                    </span>
                    <span className="badge" style={{ background: status.bg, color: status.text }}>
                      {status.label}
                    </span>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </div>

                <h3 style={{
                  fontSize: 17,
                  fontWeight: 600,
                  marginBottom: 8,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.3,
                }}>
                  {project.title}
                </h3>

                <p style={{
                  fontSize: 13,
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.5,
                  marginBottom: 16,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {project.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: 20,
                  paddingTop: 12,
                  borderTop: '1px solid var(--color-border-primary)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <DollarSign size={14} style={{ color: 'var(--color-accent-teal)' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-accent-teal-light)' }}>
                      {project.budget} ETH
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Briefcase size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {project.milestones.length} milestones
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Users size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {project.bids.length} bids
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
                    <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: 'var(--color-text-muted)',
        }}>
          <Briefcase size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
          <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>No projects found</p>
          <p style={{ fontSize: 14 }}>Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
}
