'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Project, Bid, Escrow, Transaction, EscrowState } from './types';
import { mockProjects, mockEscrows, mockTransactions } from './mock-data';
import { ethers } from 'ethers';
import { getFactoryContract, getEscrowContract, getSigner } from './contracts';

interface AppStore {
  projects: Project[];
  escrows: Escrow[];
  transactions: Transaction[];
  addProject: (project: Project) => void;
  addBid: (projectId: string, bid: Bid) => void;
  acceptBid: (projectId: string, bidId: string) => Promise<void>;
  updateEscrowState: (escrowId: string, state: EscrowState) => void;
  approveMilestone: (escrowId: string, milestoneId: string) => void;
  completeMilestone: (escrowId: string, milestoneId: string, evidenceUrl: string) => void;
}

const StoreContext = createContext<AppStore | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [escrows, setEscrows] = useState<Escrow[]>(mockEscrows);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  const addProject = useCallback((project: Project) => {
    setProjects(prev => [project, ...prev]);
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'ProjectCreated',
      projectId: project.id,
      projectTitle: project.title,
      fromAddress: project.clientAddress,
      txHash: `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 8)}`,
      blockNumber: 18300000 + Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      details: `New project posted: ${project.title} (${project.budget} ETH budget)`,
    };
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const addBid = useCallback((projectId: string, bid: Bid) => {
    setProjects(prev =>
      prev.map(p =>
        p.id === projectId ? { ...p, bids: [...p.bids, bid] } : p
      )
    );
  }, []);

  const acceptBid = useCallback(async (projectId: string, bidId: string) => {
    const project = projects.find(p => p.id === projectId);
    const bid = project?.bids.find(b => b.id === bidId);
    if (!project || !bid) return;

    let contractAddress = `0x${Math.random().toString(16).slice(2, 14)}`;
    let realTxHash = '';

    // Try on-chain deployment via MetaMask
    try {
      const signer = await getSigner();
      if (signer) {
        const factory = getFactoryContract(signer);

        // Prepare milestone data for the contract
        const titles = project.milestones.map(m => m.title);
        const amounts = project.milestones.map(m =>
          ethers.parseEther(m.amount.toString())
        );

        // Deploy escrow on-chain
        const deployTx = await factory.deployEscrow(
          bid.freelancerAddress,
          titles,
          amounts
        );
        const receipt = await deployTx.wait();
        realTxHash = receipt.hash;

        // Get deployed escrow address from EscrowCreated event
        const event = receipt.logs.find(
          (log: any) => {
            try {
              return factory.interface.parseLog({ topics: log.topics as string[], data: log.data })?.name === 'EscrowCreated';
            } catch { return false; }
          }
        );
        if (event) {
          const parsed = factory.interface.parseLog({ topics: event.topics as string[], data: event.data });
          contractAddress = parsed?.args[0] || contractAddress;
        }

        // Fund the escrow with ETH
        const escrowContract = getEscrowContract(contractAddress, signer);
        const totalWei = amounts.reduce((a, b) => a + b, BigInt(0));
        const fundTx = await escrowContract.fund({ value: totalWei });
        await fundTx.wait();
      }
    } catch (err: any) {
      console.error('On-chain deployment failed:', err);
      alert(`On-chain transaction failed: ${err?.reason || err?.message || 'Unknown error'}\n\nThe escrow has been created with mock data.`);
    }

    // Update project state
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        return {
          ...p,
          status: 'in_progress' as const,
          freelancerAddress: bid.freelancerAddress,
          bids: p.bids.map(b => ({
            ...b,
            status: b.id === bidId ? 'accepted' as const : 'rejected' as const,
          })),
          escrowId: `esc-${Date.now()}`,
        };
      })
    );

    // Create escrow record
    const newEscrow: Escrow = {
      id: `esc-${Date.now()}`,
      projectId,
      projectTitle: project.title,
      clientAddress: project.clientAddress,
      freelancerAddress: bid.freelancerAddress,
      totalAmount: bid.amount,
      state: EscrowState.Funded,
      milestones: project.milestones,
      contractAddress,
      createdAt: new Date().toISOString(),
      fundedAt: new Date().toISOString(),
    };
    setEscrows(prev => [newEscrow, ...prev]);

    // Log transaction
    const tx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'EscrowDeployed',
      projectId,
      projectTitle: project.title,
      fromAddress: project.clientAddress,
      txHash: realTxHash || `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 8)}`,
      blockNumber: 18300000 + Math.floor(Math.random() * 10000),
      timestamp: new Date().toISOString(),
      details: `Escrow deployed and funded with ${bid.amount} ETH for ${project.title}`,
    };
    setTransactions(prev => [tx, ...prev]);
  }, [projects]);

  const updateEscrowState = useCallback((escrowId: string, state: EscrowState) => {
    setEscrows(prev =>
      prev.map(e => (e.id === escrowId ? { ...e, state } : e))
    );
  }, []);

  const approveMilestone = useCallback((escrowId: string, milestoneId: string) => {
    setEscrows(prev =>
      prev.map(e => {
        if (e.id !== escrowId) return e;
        const updatedMilestones = e.milestones.map(m =>
          m.id === milestoneId ? { ...m, approved: true } : m
        );
        const allApproved = updatedMilestones.every(m => m.approved);
        return {
          ...e,
          milestones: updatedMilestones,
          state: allApproved ? EscrowState.Completed : e.state,
          completedAt: allApproved ? new Date().toISOString() : e.completedAt,
        };
      })
    );

    const escrow = escrows.find(e => e.id === escrowId);
    const milestone = escrow?.milestones.find(m => m.id === milestoneId);
    if (escrow && milestone) {
      const tx: Transaction = {
        id: `tx-${Date.now()}`,
        type: 'MilestoneApproved',
        projectId: escrow.projectId,
        projectTitle: escrow.projectTitle,
        fromAddress: escrow.clientAddress,
        toAddress: escrow.freelancerAddress,
        amount: milestone.amount,
        txHash: `0x${Math.random().toString(16).slice(2, 14)}...${Math.random().toString(16).slice(2, 8)}`,
        blockNumber: 18300000 + Math.floor(Math.random() * 10000),
        timestamp: new Date().toISOString(),
        details: `Milestone "${milestone.title}" approved — ${milestone.amount} ETH released`,
      };
      setTransactions(prev => [tx, ...prev]);
    }
  }, [escrows]);

  const completeMilestone = useCallback((escrowId: string, milestoneId: string, evidenceUrl: string) => {
    setEscrows(prev =>
      prev.map(e => {
        if (e.id !== escrowId) return e;
        return {
          ...e,
          state: EscrowState.UnderReview,
          milestones: e.milestones.map(m =>
            m.id === milestoneId ? { ...m, completed: true, evidenceUrl } : m
          ),
        };
      })
    );
  }, []);

  return (
    <StoreContext.Provider
      value={{
        projects,
        escrows,
        transactions,
        addProject,
        addBid,
        acceptBid,
        updateEscrowState,
        approveMilestone,
        completeMilestone,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore(): AppStore {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
