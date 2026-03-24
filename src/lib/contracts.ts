/**
 * Smart contract ABIs and addresses for the TrustChain freelance marketplace.
 * 
 * After deploying the EscrowFactory to Sepolia, update ESCROW_FACTORY_ADDRESS below.
 * Run: npx hardhat run scripts/deploy.js --network sepolia
 */

import { ethers } from 'ethers';

// ============================================================
// DEPLOYED CONTRACT ADDRESS — UPDATE AFTER DEPLOYMENT
// ============================================================
export const ESCROW_FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'; // TODO: replace after deploy

// ============================================================
// ABIs (minimal — only the functions we call from the frontend)
// ============================================================

export const ESCROW_FACTORY_ABI = [
  'event EscrowCreated(address indexed escrowAddress, address indexed client, address indexed freelancer, uint256 totalAmount)',
  'function deployEscrow(address _freelancer, string[] calldata _milestoneTitles, uint256[] calldata _milestoneAmounts) external returns (address)',
  'function escrows(uint256) view returns (address escrowAddress, address client, address freelancer, uint256 totalAmount, uint256 createdAt)',
  'function getEscrowCount() view returns (uint256)',
  'function getClientEscrowCount(address _client) view returns (uint256)',
  'function getFreelancerEscrowCount(address _freelancer) view returns (uint256)',
  'function clientEscrows(address, uint256) view returns (uint256)',
  'function freelancerEscrows(address, uint256) view returns (uint256)',
];

export const ESCROW_ABI = [
  'event EscrowFunded(uint256 amount)',
  'event MilestoneCompleted(uint256 indexed milestoneId, string evidenceCID)',
  'event MilestoneApproved(uint256 indexed milestoneId, uint256 amount)',
  'event PaymentReleased(uint256 amount, address indexed to)',
  'event DisputeRaised(address indexed by)',
  'event EscrowRefunded(uint256 amount, address indexed to)',
  'function client() view returns (address)',
  'function freelancer() view returns (address)',
  'function state() view returns (uint8)',
  'function totalAmount() view returns (uint256)',
  'function releasedAmount() view returns (uint256)',
  'function getMilestoneCount() view returns (uint256)',
  'function milestones(uint256) view returns (string title, uint256 amount, bool completed, bool approved, string evidenceCID)',
  'function fund() payable',
  'function startWork()',
  'function completeMilestone(uint256 _id, string calldata _evidenceCID)',
  'function approveMilestone(uint256 _id)',
  'function releasePayment()',
  'function raiseDispute()',
  'function refund()',
];

// Solidity enum Escrow.State mapping
export const ESCROW_STATE_MAP: Record<number, string> = {
  0: 'Awaiting Deposit',
  1: 'Funded',
  2: 'In Progress',
  3: 'Under Review',
  4: 'Released',
  5: 'Completed',
  6: 'Disputed',
  7: 'Refunded',
};

// ============================================================
// Contract helper factories
// ============================================================

export function getProvider(): ethers.BrowserProvider | null {
  if (typeof window === 'undefined' || !(window as any).ethereum) return null;
  return new ethers.BrowserProvider((window as any).ethereum);
}

export async function getSigner(): Promise<ethers.JsonRpcSigner | null> {
  const provider = getProvider();
  if (!provider) return null;
  return provider.getSigner();
}

export function getFactoryContract(signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract {
  return new ethers.Contract(ESCROW_FACTORY_ADDRESS, ESCROW_FACTORY_ABI, signerOrProvider);
}

export function getEscrowContract(address: string, signerOrProvider: ethers.Signer | ethers.Provider): ethers.Contract {
  return new ethers.Contract(address, ESCROW_ABI, signerOrProvider);
}
