const https = require('https');

function checkStatus(guid) {
    const url = `https://scan.bohr.life/api?module=contract&action=checkverifystatus&guid=${guid}`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`GUID: ${guid}`);
            console.log(`Result: ${data}`);
        });
    });
}

console.log("Checking NeonArcadeScore status...");
checkStatus("2726459981f58d2ea331a2309655db267057aac86aaa2ca4");

console.log("Checking NeonOracle status...");
checkStatus("a5af6637a9bab165cdf467b5385250770757cb016aaa2ca4");
