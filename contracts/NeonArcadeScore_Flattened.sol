// Sources flattened with hardhat v2.29.1 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/NeonArcadeScore.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title NeonArcadeScore
 * @dev Gas-optimized decentralized arcade score vault on BOT Chain Testnet (Chain ID: 968).
 * Records player high scores, win counts, and maximum streaks with zero overhead.
 */
contract NeonArcadeScore {
    struct PlayerStats {
        uint256 totalPoints;
        uint256 gamesWon;
        uint256 highStreak;
        uint256 lastUpdated;
    }

    // Mapping from player wallet address to their on-chain arcade stats
    mapping(address => PlayerStats) public playerStats;

    // Leaderboard tracking
    address[] public registeredPlayers;
    mapping(address => bool) private hasPlayed;

    // Events for real-time telemetry indexing
    event ScoreRecorded(
        address indexed player,
        uint256 totalPoints,
        uint256 gamesWon,
        uint256 highStreak,
        uint256 timestamp
    );

    /**
     * @notice Commit local arcade session score to BOT Chain Testnet.
     * @param points Total points accumulated
     * @param won Number of games won
     * @param streak Highest consecutive streak achieved
     */
    function recordScore(uint256 points, uint256 won, uint256 streak) external {
        PlayerStats storage stats = playerStats[msg.sender];

        // Track new players for leaderboard enumeration
        if (!hasPlayed[msg.sender]) {
            hasPlayed[msg.sender] = true;
            registeredPlayers.push(msg.sender);
        }

        // Update stats (points and wins are monotonic; streak updates if higher)
        if (points > stats.totalPoints) {
            stats.totalPoints = points;
        }
        if (won > stats.gamesWon) {
            stats.gamesWon = won;
        }
        if (streak > stats.highStreak) {
            stats.highStreak = streak;
        }
        stats.lastUpdated = block.timestamp;

        emit ScoreRecorded(msg.sender, stats.totalPoints, stats.gamesWon, stats.highStreak, block.timestamp);
    }

    /**
     * @notice Get stats for a specific player.
     */
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    /**
     * @notice Total number of unique players registered on-chain.
     */
    function getTotalPlayers() external view returns (uint256) {
        return registeredPlayers.length;
    }
}
