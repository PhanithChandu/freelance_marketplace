# TrustChain — Trustless Freelance Marketplace

> A decentralized freelance marketplace where smart contract escrows protect both clients and freelancers. Every payment is transparent, every milestone is verified.

🔗 **Live Demo:** [freelance-marketplace-sand.vercel.app](https://freelance-marketplace-sand.vercel.app/)  
🌐 **Network:** Ethereum Sepolia Testnet

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Pages & Modules](#pages--modules)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

TrustChain eliminates the trust problem in freelancing. Instead of relying on a centralized platform to hold funds and adjudicate disputes, TrustChain deploys a dedicated smart contract escrow for every project. Clients lock payment into the contract; funds are only released when milestones are approved — no banks, no middlemen, no delays.

Built on Ethereum (Sepolia testnet), the platform is fully transparent: every escrow deployment, milestone approval, and payment release is recorded on-chain and verifiable by anyone.

---

## Features

- **Wallet-based authentication** — No sign-up form. Connect with MetaMask or any injected wallet. Your public address is your identity.
- **Project lifecycle management** — Post projects with title, description, budget (ETH), deadline, category, and milestone breakdown.
- **Bid & proposal system** — Freelancers browse open listings and submit price/timeline proposals. Clients review bids and select the best fit.
- **Per-project escrow contracts** — When a freelancer is selected, a new `Escrow.sol` instance is deployed via `EscrowFactory.sol` with the agreed terms baked in.
- **Milestone-gated payments** — Funds release only when the client approves a milestone. Partial payments are supported per milestone.
- **On-chain transaction history** — Every event (project created, escrow deployed, milestone approved, payment released) is indexed and displayed with a direct Etherscan deep-link.
- **Dispute mechanism** — Either party can raise a dispute, triggering a community arbitration path.
- **Decentralized file storage** — Evidence and deliverables are uploaded to IPFS; only the content hash is stored on-chain.

---

## How It Works

```
1. Client posts a project → defines milestones and total ETH budget
2. Freelancers browse listings → submit bids with price and timeline
3. Client selects a freelancer → EscrowFactory deploys a new Escrow contract
4. Client funds the escrow → ETH is locked in the contract
5. Freelancer completes milestone → submits evidence (IPFS link)
6. Client reviews and approves → releasePayment() is called → ETH sent to freelancer
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Web3 / Wallet | wagmi v2, viem, ConnectKit |
| Smart Contracts | Solidity ^0.8.x, Hardhat, OpenZeppelin |
| File Storage | IPFS via web3.storage |
| Off-chain Data | Supabase (bids, project metadata) |
| Event Indexing | The Graph / ethers.js contract event logs |
| RPC Provider | Alchemy |
| Deployment | Vercel (frontend), Sepolia testnet (contracts) |

---

## Smart Contract Architecture

```
contracts/
├── EscrowFactory.sol     # Deploys a new Escrow instance per project
├── Escrow.sol            # Holds funds, manages milestones, handles release
└── interfaces/
    └── IArbitration.sol  # Optional dispute/arbitration interface
```

### Key contract functions

```solidity
// EscrowFactory
function deployEscrow(address freelancer, Milestone[] calldata milestones) external payable returns (address);

// Escrow
function fundEscrow() external payable;
function approveMilestone(uint256 milestoneId) external;
function releasePayment() external;
function raiseDispute() external;
function refund() external;
```

### Escrow lifecycle states

```
AWAITING_DEPOSIT → FUNDED → IN_PROGRESS → UNDER_REVIEW → RELEASED
                                                        ↘ DISPUTED
```

---

## Pages & Modules

### `/` — Landing page
Hero section with platform stats (projects posted, ETH in escrow, active freelancers, success rate) and a walkthrough of the four-step flow.

### `/projects` — Browse projects
Filterable listing of all open projects. Filters include category (Web Development, Smart Contracts, Design, Data Science, etc.), status (Open / In Progress / Completed), and budget range. Each card shows title, budget in ETH, milestone count, bid count, and deadline.

### `/projects/[id]` — Project detail
Full project description, milestone breakdown, and the bid submission form for freelancers. Clients see incoming bids and can select a freelancer to trigger contract deployment.

### `/post-project` — Post a project
A three-step form: (1) project details — title, description, category, total budget, deadline; (2) milestone definition — title and ETH amount per milestone; (3) review and submit.

### `/dashboard` — Client & freelancer dashboard
Overview stats (total projects, open projects, active escrows, total value). Displays active escrow cards with milestone progress bars and wallet addresses, plus a full list of the connected wallet's projects.

### `/escrow/[id]` — Escrow detail
Visualises the escrow state machine. Shows locked funds, milestone checklist, freelancer-submitted evidence links, and the **Release Payment** button that calls `releasePayment()` on the contract.

### `/transactions` — On-chain audit trail
A live feed of all contract events — `ProjectCreated`, `EscrowDeployed`, `EscrowFunded`, `MilestoneApproved`, `PaymentReleased`, `DisputeRaised` — each with a transaction hash, block number, timestamp, and Etherscan link.

---

## Getting Started

### Prerequisites

- Node.js 18+
- A browser wallet (MetaMask recommended)
- Sepolia testnet ETH — get some from [sepoliafaucet.com](https://sepoliafaucet.com)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/trustchain.git
cd trustchain

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser and connect your wallet.

### Compile & deploy contracts (local)

```bash
# Install Hardhat dependencies
cd contracts
npm install

# Compile
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

## Environment Variables

Create a `.env.local` file in the project root:

```env
# Alchemy RPC
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key

# Deployed contract addresses (Sepolia)
NEXT_PUBLIC_ESCROW_FACTORY_ADDRESS=0x...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# IPFS / web3.storage
WEB3_STORAGE_TOKEN=your_web3_storage_token

# The Graph
NEXT_PUBLIC_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/your-subgraph
```

---

## Deployment

The frontend is deployed to **Vercel**. Smart contracts are live on the **Ethereum Sepolia testnet**.

To deploy your own instance:

1. Push the repository to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy — Vercel auto-deploys on every push to `main`

---

## Project Structure

```
trustchain/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── projects/           # Browse & project detail
│   ├── post-project/       # Multi-step post form
│   ├── dashboard/          # Client/freelancer dashboard
│   ├── escrow/[id]/        # Escrow detail & release
│   └── transactions/       # On-chain audit trail
├── components/             # Shared UI components
├── contracts/              # Solidity source & Hardhat config
│   ├── EscrowFactory.sol
│   ├── Escrow.sol
│   └── interfaces/
├── lib/                    # wagmi config, contract ABIs, helpers
├── public/                 # Static assets
└── README.md
```

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request so we can discuss the proposed change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: describe your change"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

<p align="center">Built on Ethereum · Deployed on Sepolia testnet · © 2026 TrustChain</p>
