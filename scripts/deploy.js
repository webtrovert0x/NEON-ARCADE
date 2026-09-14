const hre = require("hardhat");

async function main() {
    console.log("==================================================");
    console.log("🚀 Starting Deployment to BOT Chain Testnet (968)");
    console.log("==================================================");

    const [deployer] = await hre.ethers.getSigners();
    if (deployer) {
        console.log("Deployer Address:", deployer.address);
        const balance = await deployer.getBalance();
        console.log("Deployer Balance:", hre.ethers.utils.formatEther(balance), "BOT");
    }

    // 1. Deploy NeonArcadeScore
    console.log("\n📦 Deploying NeonArcadeScore contract...");
    const NeonArcadeScore = await hre.ethers.getContractFactory("NeonArcadeScore");
    const neonArcadeScore = await NeonArcadeScore.deploy();
    await neonArcadeScore.deployed();

    console.log("✨ NeonArcadeScore successfully deployed!");
    console.log("📍 Contract Address:", neonArcadeScore.address);
    console.log("🔍 Bohr Explorer:", `https://scan.bohr.life/address/${neonArcadeScore.address}`);

    // 2. Deploy NeonOracle
    console.log("\n📦 Deploying NeonOracle contract...");
    const NeonOracle = await hre.ethers.getContractFactory("NeonOracle");
    const neonOracle = await NeonOracle.deploy();
    await neonOracle.deployed();

    console.log("✨ NeonOracle successfully deployed!");
    console.log("📍 Contract Address:", neonOracle.address);
    console.log("🔍 Bohr Explorer:", `https://scan.bohr.life/address/${neonOracle.address}`);

    console.log("\n==================================================");
    console.log("🎉 All contracts deployed successfully to BOT Chain!");
    console.log("==================================================");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });