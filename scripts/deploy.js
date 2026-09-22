const hre = require("hardhat");

async function main() {
    const net = await hre.ethers.provider.getNetwork();
    const isMainnet = net.chainId === 677;
    const networkName = isMainnet ? "BOT Chain Mainnet (677)" : `BOT Chain (${net.chainId})`;
    const explorerBase = isMainnet ? "https://scan.botchain.ai" : "https://scan.bohr.life";

    console.log("==================================================");
    console.log(`🚀 Starting Deployment to ${networkName}`);
    console.log("==================================================");

    const [deployer] = await hre.ethers.getSigners();
    if (deployer) {
        console.log("Deployer Address:", deployer.address);
        const balance = await deployer.getBalance();
        console.log("Deployer Balance:", hre.ethers.utils.formatEther(balance), "BOT");
        if (balance.eq(0)) {
            console.error("⚠️ ERROR: Deployer balance is 0 BOT. Please fund this account before deploying!");
            process.exit(1);
        }
    }

    // 1. Deploy NeonArcadeScore
    console.log("\n📦 Deploying NeonArcadeScore contract...");
    const NeonArcadeScore = await hre.ethers.getContractFactory("contracts/NeonArcadeScore.sol:NeonArcadeScore");
    const neonArcadeScore = await NeonArcadeScore.deploy();
    await neonArcadeScore.deployed();

    console.log("✨ NeonArcadeScore successfully deployed!");
    console.log("📍 Contract Address:", neonArcadeScore.address);
    console.log("🔍 Explorer:", `${explorerBase}/address/${neonArcadeScore.address}`);

    // 2. Deploy NeonOracle
    console.log("\n📦 Deploying NeonOracle contract...");
    const NeonOracle = await hre.ethers.getContractFactory("contracts/NeonOracle.sol:NeonOracle");
    const neonOracle = await NeonOracle.deploy();
    await neonOracle.deployed();

    console.log("✨ NeonOracle successfully deployed!");
    console.log("📍 Contract Address:", neonOracle.address);
    console.log("🔍 Explorer:", `${explorerBase}/address/${neonOracle.address}`);

    console.log("\n==================================================");
    console.log(`🎉 All contracts deployed successfully to ${networkName}!`);
    console.log("==================================================");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });