const fs = require('fs');
const path = require('path');
const https = require('https');

const EXPLORER_HOST = process.env.EXPLORER_HOST || 'scan.botchain.ai';

function postVerification(postData) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: EXPLORER_HOST,
            port: 443,
            path: '/api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData),
            },
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ raw: data });
                }
            });
        });

        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

function checkStatus(guid) {
    return new Promise((resolve) => {
        https.get(`https://${EXPLORER_HOST}/api?module=contract&action=checkverifystatus&guid=${guid}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ raw: data });
                }
            });
        });
    });
}

async function verifyWithStandardJson(contractAddress, contractName, jsonPath) {
    console.log(`\n==================================================`);
    console.log(`🚀 Submitting Standard JSON Verification for: ${contractName}`);
    console.log(`📍 Contract: ${contractAddress}`);
    console.log(`==================================================`);

    const jsonContent = fs.readFileSync(jsonPath, 'utf8');

    const params = new URLSearchParams({
        module: 'contract',
        action: 'verifysourcecode',
        contractaddress: contractAddress,
        sourceCode: jsonContent,
        codeformat: 'solidity-standard-json-input',
        contractname: `contracts/${contractName}.sol:${contractName}`,
        compilerversion: 'v0.8.20+commit.a1b79de6',
    });

    const submitRes = await postVerification(params.toString());
    console.log('Submission Response:', submitRes);

    if (submitRes.status === '1' || submitRes.message === 'OK') {
        const guid = submitRes.result;
        console.log(`⏳ Verification queued with GUID: ${guid}`);
        console.log(`Polling verification status...`);

        for (let i = 0; i < 10; i++) {
            await new Promise(r => setTimeout(r, 3000));
            const statusRes = await checkStatus(guid);
            console.log(`[Attempt ${i + 1}] Status:`, statusRes.result || statusRes);
            if (statusRes.result && statusRes.result.toLowerCase().includes('pass')) {
                console.log(`🎉 SUCCESS: ${contractName} is VERIFIED on ${EXPLORER_HOST}!`);
                console.log(`🔗 https://${EXPLORER_HOST}/address/${contractAddress}#code`);
                return true;
            }
            if (statusRes.result && statusRes.result.toLowerCase().includes('fail')) {
                console.log(`⚠️ Status message: ${statusRes.result}`);
                break;
            }
        }
    } else {
        console.log('⚠️ Could not queue standard JSON verification:', submitRes);
    }

    // Try Single File fallback with exact settings
    console.log(`\nAttempting Single File Verification with EVM paris & optimization disabled...`);
    const flattenedFile = jsonPath.replace('_StandardJson.json', '_Flattened.sol');
    if (fs.existsSync(flattenedFile)) {
        const singleParams = new URLSearchParams({
            module: 'contract',
            action: 'verifysourcecode',
            contractaddress: contractAddress,
            sourceCode: fs.readFileSync(flattenedFile, 'utf8'),
            codeformat: 'solidity-single-file',
            contractname: contractName,
            compilerversion: 'v0.8.20+commit.a1b79de6',
            optimizationUsed: '0',
            evmversion: 'paris',
        });

        const singleRes = await postVerification(singleParams.toString());
        console.log('Single File Submission:', singleRes);

        if (singleRes.status === '1' || singleRes.message === 'OK') {
            const guid = singleRes.result;
            for (let i = 0; i < 10; i++) {
                await new Promise(r => setTimeout(r, 3000));
                const statusRes = await checkStatus(guid);
                console.log(`[Attempt ${i + 1}] Status:`, statusRes.result || statusRes);
                if (statusRes.result && statusRes.result.toLowerCase().includes('pass')) {
                    console.log(`🎉 SUCCESS: ${contractName} is VERIFIED on ${EXPLORER_HOST}!`);
                    console.log(`🔗 https://${EXPLORER_HOST}/address/${contractAddress}#code`);
                    return true;
                }
            }
        }
    }
}

async function main() {
    const rootDir = path.resolve(__dirname, '..');
    const scoreAddr = process.argv[2] || process.env.SCORE_ADDR || '0x2726459981F58d2ea331A2309655DB267057aaC8';
    const oracleAddr = process.argv[3] || process.env.ORACLE_ADDR || '0xa5af6637A9bAB165CDF467b5385250770757cb01';

    // 1. NeonArcadeScore
    if (scoreAddr) {
        await verifyWithStandardJson(
            scoreAddr,
            'NeonArcadeScore',
            path.join(rootDir, 'contracts/NeonArcadeScore_StandardJson.json')
        );
    }

    // 2. NeonOracle
    if (oracleAddr) {
        await verifyWithStandardJson(
            oracleAddr,
            'NeonOracle',
            path.join(rootDir, 'contracts/NeonOracle_StandardJson.json')
        );
    }
}

main();
