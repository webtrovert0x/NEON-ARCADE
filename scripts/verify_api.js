const fs = require('fs');
const path = require('path');
const https = require('https');

async function verifyContract(contractAddress, contractName, flattenedFilePath, compilerVersion = 'v0.8.20+commit.a1b79de6') {
    console.log("==================================================");
    console.log(`🔍 Submitting verification for ${contractName}...`);
    console.log(`📍 Address: ${contractAddress}`);
    console.log("==================================================");

    const sourceCode = fs.readFileSync(flattenedFilePath, 'utf8');

    const postData = new URLSearchParams({
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: sourceCode,
        codeformat: 'solidity-single-file',
        contractname: contractName,
        compilerversion: compilerVersion,
        optimizationUsed: '0',
    }).toString();

    const options = {
        hostname: 'scan.bohr.life',
        port: 443,
        path: '/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData),
        },
    };

    return new Promise((resolve) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                console.log(`Status Code: ${res.statusCode}`);
                console.log(`Response: ${data}`);
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.status === '1' || parsed.message === 'OK') {
                        console.log(`✅ ${contractName} successfully verified via API!`);
                        console.log(`🔗 Explorer Code: https://scan.bohr.life/address/${contractAddress}#code`);
                    } else {
                        console.log(`ℹ️ Result: ${parsed.result || parsed.message}`);
                    }
                } catch (e) {
                    console.log(`Raw response: ${data}`);
                }
                resolve();
            });
        });

        req.on('error', (e) => {
            console.error(`❌ Request error: ${e.message}`);
            resolve();
        });

        req.write(postData);
        req.end();
    });
}

async function main() {
    const rootDir = path.resolve(__dirname, '..');

    // 1. Verify NeonArcadeScore
    const arcadeScoreAddress = '0x2726459981F58d2ea331A2309655DB267057aaC8';
    const arcadeScoreFile = path.join(rootDir, 'contracts/NeonArcadeScore_Flattened.sol');
    if (fs.existsSync(arcadeScoreFile)) {
        await verifyContract(arcadeScoreAddress, 'NeonArcadeScore', arcadeScoreFile);
    }

    console.log('\n--------------------------------------------------\n');

    // 2. Verify NeonOracle
    const oracleAddress = '0xa5af6637A9bAB165CDF467b5385250770757cb01';
    const oracleFile = path.join(rootDir, 'contracts/NeonOracle_Flattened.sol');
    if (fs.existsSync(oracleFile)) {
        await verifyContract(oracleAddress, 'NeonOracle', oracleFile);
    }
}

main();
