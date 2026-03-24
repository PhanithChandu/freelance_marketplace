/**
 * Deploy EscrowFactory to Sepolia using raw ethers.js
 * Run: node scripts/deploy.js
 */
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    console.error("Missing SEPOLIA_RPC_URL or DEPLOYER_PRIVATE_KEY in .env");
    process.exit(1);
  }

  console.log("Deploying EscrowFactory to Sepolia...\n");

  // Load compiled artifact
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "EscrowFactory.sol", "EscrowFactory.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log(`Deployer address: ${wallet.address}`);
  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH\n`);

  if (balance === 0n) {
    console.error("No Sepolia ETH! Get some from https://cloud.google.com/application/web3/faucet/ethereum/sepolia");
    process.exit(1);
  }

  // Deploy
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, wallet);
  console.log("Sending deployment transaction...");
  const contract = await factory.deploy();
  console.log(`Transaction hash: ${contract.deploymentTransaction().hash}`);
  console.log("Waiting for confirmation...");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`\n✅ EscrowFactory deployed at: ${address}`);
  console.log(`View on Etherscan: https://sepolia.etherscan.io/address/${address}`);
  console.log(`\n📋 Update ESCROW_FACTORY_ADDRESS in src/lib/contracts.ts`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
