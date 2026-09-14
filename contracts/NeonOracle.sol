// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title NeonOracle
 * @dev Decentralized prediction & number oracle game tailored for BOT Chain Testnet.
 */
contract NeonOracle {
    address public owner;
    uint256 public gameRound;
    uint256 public prizePool;
    
    enum Difficulty { INITIATE, SEER, GRAND_ORACLE }

    struct RoundData {
        uint256 targetNumber;
        uint256 maxRange;
        uint256 maxAttempts;
        uint256 entryFee;
        bool active;
    }

    RoundData public currentRound;
    
    mapping(address => uint256) public playerGuesses;
    mapping(address => uint256) public attemptsUsed;
    mapping(address => bool) public hasGuessed;
    mapping(address => uint256) public totalWins;

    event RoundStarted(uint256 indexed roundId, uint256 maxRange, uint256 prize);
    event OracleGuessed(address indexed player, uint256 guess, string hint);
    event OracleSynchronized(address indexed winner, uint256 roundId, uint256 prize);
    event PrizePoolFunded(address indexed funder, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "NeonOracle: Only architect can execute");
        _;
    }

    constructor() payable {
        owner = msg.sender;
        gameRound = 1;
        prizePool = msg.value;
        _startNewRound(100, 5, 0.01 ether);
    }

    function _startNewRound(uint256 _maxRange, uint256 _maxAttempts, uint256 _entryFee) internal {
        // Pseudo-random seed generation for testnet game round
        uint256 pseudoSecret = (uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, gameRound, address(this)))) % _maxRange) + 1;
        
        currentRound = RoundData({
            targetNumber: pseudoSecret,
            maxRange: _maxRange,
            maxAttempts: _maxAttempts,
            entryFee: _entryFee,
            active: true
        });

        emit RoundStarted(gameRound, _maxRange, prizePool);
    }

    function fundOracle() external payable {
        require(msg.value > 0, "NeonOracle: Must deposit positive amount");
        prizePool += msg.value;
        emit PrizePoolFunded(msg.sender, msg.value);
    }

    function submitPrediction(uint256 _guess) external payable {
        require(currentRound.active, "NeonOracle: Round is not active");
        require(_guess >= 1 && _guess <= currentRound.maxRange, "NeonOracle: Guess out of bounds");
        require(attemptsUsed[msg.sender] < currentRound.maxAttempts, "NeonOracle: Max attempts reached for round");

        if (currentRound.entryFee > 0) {
            require(msg.value >= currentRound.entryFee, "NeonOracle: Insufficient entry fee");
            prizePool += msg.value;
        }

        attemptsUsed[msg.sender]++;
        playerGuesses[msg.sender] = _guess;
        hasGuessed[msg.sender] = true;

        if (_guess == currentRound.targetNumber) {
            currentRound.active = false;
            totalWins[msg.sender]++;
            
            uint256 reward = prizePool;
            prizePool = 0;
            
            (bool sent, ) = payable(msg.sender).call{value: reward}("");
            require(sent, "NeonOracle: Failed to transfer reward");

            emit OracleSynchronized(msg.sender, gameRound, reward);
            gameRound++;
            _startNewRound(currentRound.maxRange, currentRound.maxAttempts, currentRound.entryFee);
        } else if (_guess < currentRound.targetNumber) {
            emit OracleGuessed(msg.sender, _guess, "HIGHER");
        } else {
            emit OracleGuessed(msg.sender, _guess, "LOWER");
        }
    }

    function startCustomRound(uint256 _maxRange, uint256 _maxAttempts, uint256 _entryFee) external onlyOwner {
        gameRound++;
        _startNewRound(_maxRange, _maxAttempts, _entryFee);
    }

    function emergencyWithdraw() external onlyOwner {
        uint256 bal = address(this).balance;
        prizePool = 0;
        (bool sent, ) = payable(owner).call{value: bal}("");
        require(sent, "NeonOracle: Withdraw failed");
    }

    receive() external payable {
        prizePool += msg.value;
    }
}
