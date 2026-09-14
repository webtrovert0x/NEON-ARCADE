/**
 * NEON ORACLE — Decentralized Number Matrix Prediction Engine
 * Deployed for BOT Chain Testnet (Chain ID: 968)
 */

// BOT Chain Testnet Parameters
const BOT_CHAIN_CONFIG = {
    chainId: '0x3c8', // 968 in Hex
    chainName: 'BOT Chain Testnet',
    nativeCurrency: {
        name: 'BOT Token',
        symbol: 'BOT',
        decimals: 18,
    },
    rpcUrls: ['https://rpc.bohr.life'],
    blockExplorerUrls: ['https://scan.botchain.ai'],
};

// Difficulty Configurations
const TIERS = {
    initiate: { name: 'Initiate', max: 50, attempts: 7, bounty: '0.05' },
    seer: { name: 'Seer', max: 100, attempts: 5, bounty: '0.15' },
    grand: { name: 'Grand Oracle', max: 500, attempts: 8, bounty: '0.50' }
};

// Web3 State
let web3Provider = null;
let currentAccount = null;
let currentChainId = null;
let contract = null;
const contractAddress = "0x0000000000000000000000000000000000000000"; // Configurable when deployed

// Game State
let currentTier = 'seer';
let targetNumber = 0;
let attemptsLeft = 5;
let maxAttempts = 5;
let gameActive = false;
let roundGuesses = [];
let soundEnabled = true;

// Persistent User Telemetry
let userStats = {
    totalWins: 0,
    currentStreak: 0,
    bestStreak: 0,
    totalGuesses: 0,
    earnedBounties: 0.0
};

// Web Audio Synthesizer Context
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
            audioCtx = new AudioContext();
        }
    }
}

function playTone(freq, type = 'sine', duration = 0.12, volume = 0.15) {
    if (!soundEnabled) return;
    try {
        initAudio();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(volume, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Audio play error:', e);
    }
}

function playSound(type) {
    switch (type) {
        case 'click':
            playTone(800, 'triangle', 0.06, 0.1);
            break;
        case 'higher':
            playTone(320, 'sine', 0.1, 0.15);
            setTimeout(() => playTone(480, 'sine', 0.15, 0.2), 80);
            break;
        case 'lower':
            playTone(480, 'sine', 0.1, 0.15);
            setTimeout(() => playTone(300, 'sine', 0.18, 0.2), 80);
            break;
        case 'hint':
            playTone(600, 'sine', 0.08, 0.12);
            setTimeout(() => playTone(900, 'sine', 0.12, 0.15), 90);
            break;
        case 'win':
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                setTimeout(() => playTone(freq, 'sawtooth', 0.3, 0.2), i * 110);
            });
            break;
        case 'fail':
            playTone(180, 'sawtooth', 0.25, 0.2);
            setTimeout(() => playTone(120, 'sawtooth', 0.35, 0.25), 180);
            break;
    }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    loadSavedStats();
    setupEventListeners();
    initGameRound('seer');
    checkExistingWallet();
});

// Load stats from localStorage
function loadSavedStats() {
    const saved = localStorage.getItem('neon_oracle_stats');
    if (saved) {
        try {
            userStats = { ...userStats, ...JSON.parse(saved) };
        } catch (e) {}
    }
    const savedAudio = localStorage.getItem('neon_oracle_sound');
    if (savedAudio !== null) {
        soundEnabled = savedAudio === 'true';
        updateAudioButton();
    }
    updateStatsDisplay();
}

function saveStats() {
    localStorage.setItem('neon_oracle_stats', JSON.stringify(userStats));
    updateStatsDisplay();
}

function updateAudioButton() {
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
        btn.innerHTML = soundEnabled ? '🔊' : '🔇';
        btn.setAttribute('title', soundEnabled ? 'Mute Audio' : 'Unmute Audio');
    }
}

// Setup DOM Event Listeners
function setupEventListeners() {
    document.getElementById('guessInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            submitPrediction();
        }
    });

    document.getElementById('soundToggleBtn').addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        localStorage.setItem('neon_oracle_sound', soundEnabled);
        updateAudioButton();
        if (soundEnabled) playSound('click');
    });

    // Tier buttons
    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tier = btn.getAttribute('data-tier');
            setTier(tier);
        });
    });
}

// Game Initialization
function initGameRound(tierKey) {
    currentTier = tierKey;
    const config = TIERS[tierKey];
    maxAttempts = config.attempts;
    attemptsLeft = config.attempts;
    targetNumber = Math.floor(Math.random() * config.max) + 1;
    gameActive = true;
    roundGuesses = [];

    // UI Updates
    document.querySelectorAll('.tier-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tier') === tierKey);
    });

    const rangeInfo = document.getElementById('rangeInfo');
    if (rangeInfo) {
        rangeInfo.textContent = `[ Range: 1 — ${config.max} ]`;
    }

    const core = document.getElementById('oracleCore');
    core.className = 'oracle-core';
    
    document.getElementById('oracleStatus').textContent = "ORACLE AWAITING FREQUENCY...";
    document.getElementById('oracleStatus').style.color = "var(--neon-cyan)";
    
    const input = document.getElementById('guessInput');
    input.value = '';
    input.min = 1;
    input.max = config.max;
    input.disabled = false;
    input.focus();

    document.getElementById('submitGuessBtn').disabled = false;
    document.getElementById('hintBtn').disabled = false;
    document.getElementById('hintBanner').style.display = 'none';
    document.getElementById('hintBanner').textContent = '';

    renderEnergyNodes();
    renderGuessHistory();
}

function setTier(tier) {
    playSound('click');
    initGameRound(tier);
    showToast(`Difficulty calibrated to ${TIERS[tier].name}`);
}

function renderEnergyNodes() {
    const container = document.getElementById('energyNodes');
    container.innerHTML = '';
    for (let i = 0; i < maxAttempts; i++) {
        const node = document.createElement('div');
        node.className = `energy-node ${i >= attemptsLeft ? 'spent' : ''}`;
        container.appendChild(node);
    }
    document.getElementById('attemptsCount').textContent = `${attemptsLeft}/${maxAttempts}`;
}

function renderGuessHistory() {
    const container = document.getElementById('guessHistory');
    container.innerHTML = '';
    if (roundGuesses.length === 0) {
        container.innerHTML = '<span style="color: var(--text-muted); font-size: 0.85rem;">No frequencies submitted yet.</span>';
        return;
    }

    roundGuesses.forEach(item => {
        const chip = document.createElement('div');
        chip.className = `guess-chip ${item.result === 'low' ? 'chip-low' : item.result === 'high' ? 'chip-high' : 'chip-win'}`;
        chip.innerHTML = `${item.val} ${item.result === 'low' ? '▲ HIGHER' : item.result === 'high' ? '▼ LOWER' : '★ SYNCHRONIZED'}`;
        container.appendChild(chip);
    });
}

function submitPrediction() {
    if (!gameActive) return;

    const input = document.getElementById('guessInput');
    const guess = parseInt(input.value, 10);
    const config = TIERS[currentTier];

    if (isNaN(guess) || guess < 1 || guess > config.max) {
        showToast(`Please enter a valid frequency between 1 and ${config.max}`, 'warn');
        playSound('fail');
        return;
    }

    if (roundGuesses.some(g => g.val === guess)) {
        showToast(`Frequency ${guess} already probed this round!`, 'warn');
        return;
    }

    userStats.totalGuesses++;
    attemptsLeft--;
    renderEnergyNodes();

    const core = document.getElementById('oracleCore');
    core.classList.add('analyzing');

    setTimeout(() => {
        core.classList.remove('analyzing');

        if (guess === targetNumber) {
            // WIN EVENT
            handleWin(guess);
        } else {
            const isTooLow = guess < targetNumber;
            roundGuesses.push({ val: guess, result: isTooLow ? 'low' : 'high' });
            renderGuessHistory();

            if (attemptsLeft <= 0) {
                // LOSS EVENT
                handleLoss();
            } else {
                playSound(isTooLow ? 'higher' : 'lower');
                const diff = Math.abs(guess - targetNumber);
                let proximity = diff <= 5 ? '🔥 PROXIMITY CRITICAL' : diff <= 15 ? '⚡ SIGNAL WARM' : '❄️ SIGNAL COLD';
                
                document.getElementById('oracleStatus').innerHTML = `${proximity}: TARGET IS <span style="color:${isTooLow ? 'var(--neon-cyan)' : 'var(--neon-magenta)'}">${isTooLow ? 'HIGHER ▲' : 'LOWER ▼'}</span>`;
            }
        }
        input.value = '';
        input.focus();
        saveStats();
    }, 280);
}

function handleWin(guess) {
    gameActive = false;
    userStats.totalWins++;
    userStats.currentStreak++;
    if (userStats.currentStreak > userStats.bestStreak) {
        userStats.bestStreak = userStats.currentStreak;
    }
    const bountyEarned = parseFloat(TIERS[currentTier].bounty);
    userStats.earnedBounties += bountyEarned;

    playSound('win');
    const core = document.getElementById('oracleCore');
    core.classList.add('sync-won');

    roundGuesses.push({ val: guess, result: 'win' });
    renderGuessHistory();

    document.getElementById('oracleStatus').innerHTML = `🌟 ORACLE SYNCHRONIZED! [ ${targetNumber} ]`;
    document.getElementById('oracleStatus').style.color = "var(--neon-green)";

    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitGuessBtn').disabled = true;
    document.getElementById('hintBtn').disabled = true;

    showToast(`Synchronized! +${bountyEarned} BOT bounty claimed.`, 'success');
}

function handleLoss() {
    gameActive = false;
    userStats.currentStreak = 0;
    playSound('fail');

    document.getElementById('oracleStatus').innerHTML = `⚠️ ORACLE OVERLOAD! Frequency was [ ${targetNumber} ]`;
    document.getElementById('oracleStatus').style.color = "var(--neon-magenta)";

    document.getElementById('guessInput').disabled = true;
    document.getElementById('submitGuessBtn').disabled = true;
    document.getElementById('hintBtn').disabled = true;

    showToast('Depleted energy nodes. Re-calibrate to try again.', 'error');
}

function requestOracleHint() {
    if (!gameActive || attemptsLeft <= 1) {
        showToast('Insufficient energy to extract oracle telemetry.', 'warn');
        return;
    }

    playSound('hint');
    const hintBanner = document.getElementById('hintBanner');
    
    // Generate intelligent oracle hint
    const isEven = targetNumber % 2 === 0;
    const isPrime = checkPrime(targetNumber);
    const config = TIERS[currentTier];
    
    let hintOptions = [
        `Oracle Telemetry: The secret target is an ${isEven ? 'EVEN' : 'ODD'} number.`,
        isPrime ? `Quantum scan detects a PRIME frequency signature.` : `Quantum scan confirms a COMPOSITE (non-prime) frequency.`,
        targetNumber > (config.max / 2) ? `Frequency lies in the UPPER half [>${Math.floor(config.max / 2)}].` : `Frequency lies in the LOWER half [≤${Math.floor(config.max / 2)}].`
    ];

    const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];
    hintBanner.style.display = 'block';
    hintBanner.textContent = `🔮 ${randomHint}`;
    document.getElementById('hintBtn').disabled = true;
    showToast('Oracle hint unlocked.');
}

function checkPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function updateStatsDisplay() {
    document.getElementById('statWins').textContent = userStats.totalWins;
    document.getElementById('statStreak').textContent = userStats.currentStreak;
    document.getElementById('statBounties').textContent = userStats.earnedBounties.toFixed(2);
    
    const accuracy = userStats.totalGuesses > 0 
        ? Math.round((userStats.totalWins / userStats.totalGuesses) * 100) 
        : 0;
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;
}

// ---------------- Web3 / BOT Chain Testnet Integration ---------------- //

async function checkExistingWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                currentAccount = accounts[0];
                currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
                updateWalletUI();
                verifyNetwork();
            }
        } catch (e) {
            console.error(e);
        }

        window.ethereum.on('accountsChanged', (accs) => {
            currentAccount = accs.length > 0 ? accs[0] : null;
            updateWalletUI();
        });

        window.ethereum.on('chainChanged', (cId) => {
            currentChainId = cId;
            verifyNetwork();
        });
    }
}

async function connectWallet() {
    if (!window.ethereum) {
        showToast('Web3 wallet not detected. Please install MetaMask!', 'warn');
        return;
    }

    try {
        playSound('click');
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        currentAccount = accounts[0];
        currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
        updateWalletUI();
        await verifyNetwork();
        showToast('Wallet connected successfully!');
    } catch (err) {
        console.error('Connection failed:', err);
        showToast('Wallet connection cancelled', 'warn');
    }
}

async function verifyNetwork() {
    if (!window.ethereum || !currentAccount) return;

    if (currentChainId !== BOT_CHAIN_CONFIG.chainId) {
        const switchBtn = document.getElementById('switchNetworkBtn');
        if (switchBtn) switchBtn.style.display = 'inline-flex';
        document.getElementById('networkDot').style.backgroundColor = '#ff007f';
        document.getElementById('networkName').textContent = 'WRONG NETWORK';
        showToast('Switch network to BOT Chain Testnet (ID: 968)', 'warn');
    } else {
        const switchBtn = document.getElementById('switchNetworkBtn');
        if (switchBtn) switchBtn.style.display = 'none';
        document.getElementById('networkDot').style.backgroundColor = 'var(--neon-green)';
        document.getElementById('networkName').textContent = 'BOT CHAIN TESTNET';
    }
}

async function switchToBotChain() {
    if (!window.ethereum) return;

    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BOT_CHAIN_CONFIG.chainId }],
        });
    } catch (switchError) {
        // Error code 4902 indicates chain not added to wallet
        if (switchError.code === 4902 || switchError.code === -32603) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [BOT_CHAIN_CONFIG],
                });
            } catch (addError) {
                console.error('Failed to add BOT Chain:', addError);
                showToast('Failed to add BOT Chain Testnet to wallet.', 'error');
            }
        } else {
            console.error('Network switch error:', switchError);
        }
    }
}

function updateWalletUI() {
    const btn = document.getElementById('connectWalletBtn');
    if (!btn) return;

    if (currentAccount) {
        const shortAddr = `${currentAccount.substring(0, 6)}...${currentAccount.substring(currentAccount.length - 4)}`;
        btn.innerHTML = `⚡ ${shortAddr}`;
        btn.classList.add('connected');
    } else {
        btn.innerHTML = `<span>⚡</span> Connect Wallet`;
        btn.classList.remove('connected');
    }
}

// Toast System
let toastTimeout;
function showToast(message, type = 'info') {
    const toast = document.getElementById('cyberToast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = 'cyber-toast show';

    if (type === 'warn') {
        toast.style.borderColor = 'var(--neon-magenta)';
    } else if (type === 'success') {
        toast.style.borderColor = 'var(--neon-green)';
    } else {
        toast.style.borderColor = 'var(--neon-cyan)';
    }

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.className = 'cyber-toast';
    }, 3200);
}
