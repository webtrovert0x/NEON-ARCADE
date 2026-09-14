const hre = require("hardhat");

async function main() {
    // Replace with your deployed contract address or pass via CLI args
    const contractAddress = process.env.CONTRACT_ADDRESS || process.argv[2];

    if (!contractAddress) {
        console.error("❌ Please provide a contract address!");
        console.log("Usage: npx hardhat run scripts/verify.js --network botchainTestnet -- <CONTRACT_ADDRESS>");
        console.log("   or: CONTRACT_ADDRESS=0x... npm run verify:testnet");
        process.exit(1);
    }

    console.log("==================================================");
    console.log("🔍 Verifying Contract on BOT Chain Testnet (968)");
    console.log("📍 Address:", contractAddress);
    console.log("==================================================");

    try {
        await hre.run("verify:verify", {
            address: contractAddress,
            constructorArguments: [], // Add constructor arguments here if any
        });
        console.log("✅ Contract verified successfully!");
        console.log("🔗 View on Bohr Scan:", `https://scan.bohr.life/address/${contractAddress}#code`);
    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("ℹ️ Contract is already verified on Bohr Scan!");
        } else {
            console.error("⚠️ Verification via API failed:", error.message);
            console.log("\n💡 Alternative: Flatten contract for 1-click verification on scan.bohr.life:");
            console.log("   npx hardhat flatten contracts/NeonArcadeScore.sol > NeonArcadeScore_flattened.sol");
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
