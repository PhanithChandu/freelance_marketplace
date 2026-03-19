export enum EscrowState {
  AwaitingDeposit = 'Awaiting Deposit',
  Funded = 'Funded',
  InProgress = 'In Progress',
  UnderReview = 'Under Review',
  Released = 'Released',
  Completed = 'Completed',
  Disputed = 'Disputed',
  Refunded = 'Refunded',
}

export enum ProjectCategory {
  WebDevelopment = 'Web Development',
  SmartContracts = 'Smart Contracts',
  Design = 'Design',
  Marketing = 'Marketing',
  Writing = 'Writing',
  DataScience = 'Data Science',
  Mobile = 'Mobile Development',
  DevOps = 'DevOps',
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: number; // in ETH
  completed: boolean;
  approved: boolean;
  evidenceUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  budget: number; // in ETH
  milestones: Milestone[];
  clientAddress: string;
  freelancerAddress?: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
  deadline: string;
  bids: Bid[];
  escrowId?: string;
}

export interface Bid {
  id: string;
  projectId: string;
  freelancerAddress: string;
  amount: number; // in ETH
  timeline: number; // in days
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Escrow {
  id: string;
  projectId: string;
  projectTitle: string;
  clientAddress: string;
  freelancerAddress: string;
  totalAmount: number;
  state: EscrowState;
  milestones: Milestone[];
  contractAddress: string;
  createdAt: string;
  fundedAt?: string;
  completedAt?: string;
}

export interface Transaction {
  id: string;
  type: 'ProjectCreated' | 'MilestoneApproved' | 'PaymentReleased' | 'DisputeRaised' | 'EscrowFunded' | 'EscrowDeployed';
  projectId: string;
  projectTitle: string;
  fromAddress: string;
  toAddress?: string;
  amount?: number;
  txHash: string;
  blockNumber: number;
  timestamp: string;
  details: string;
}
