const hre = require("hardhat");

async function main() {
  console.log("Deploying EscrowFactory to Sepolia...\n");

  const EscrowFactory = await hre.ethers.getContractFactory("EscrowFactory");
  const factory = await EscrowFactory.deploy();
  await factory.waitForDeployment();

  const address = await factory.getAddress();
  console.log(`EscrowFactory deployed at: ${address}`);
  console.log(`\nView on Etherscan: https://sepolia.etherscan.io/address/${address}`);
  console.log(`\nCopy this address into src/lib/contracts.ts as ESCROW_FACTORY_ADDRESS`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
