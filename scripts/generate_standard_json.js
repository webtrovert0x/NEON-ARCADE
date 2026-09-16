const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const buildInfoDir = path.join(rootDir, 'artifacts/build-info');
const files = fs.readdirSync(buildInfoDir);

if (files.length > 0) {
    const buildInfo = JSON.parse(fs.readFileSync(path.join(buildInfoDir, files[0]), 'utf8'));
    const input = buildInfo.input;

    // 1. NeonArcadeScore Standard JSON Input
    const arcadeScoreInput = {
        language: "Solidity",
        sources: {
            "contracts/NeonArcadeScore.sol": input.sources["contracts/NeonArcadeScore.sol"]
        },
        settings: input.settings
    };
    fs.writeFileSync(
        path.join(rootDir, 'contracts/NeonArcadeScore_StandardJson.json'),
        JSON.stringify(arcadeScoreInput, null, 2)
    );
    console.log("✅ contracts/NeonArcadeScore_StandardJson.json generated!");

    // 2. NeonOracle Standard JSON Input
    const oracleInput = {
        language: "Solidity",
        sources: {
            "contracts/NeonOracle.sol": input.sources["contracts/NeonOracle.sol"]
        },
        settings: input.settings
    };
    fs.writeFileSync(
        path.join(rootDir, 'contracts/NeonOracle_StandardJson.json'),
        JSON.stringify(oracleInput, null, 2)
    );
    console.log("✅ contracts/NeonOracle_StandardJson.json generated!");
}
