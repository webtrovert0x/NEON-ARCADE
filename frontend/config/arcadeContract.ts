/**
 * Neon Arcade On-Chain Contract Config for BOT Chain Testnet (968)
 */

export const ARCADE_SCORE_CONTRACT_ADDRESS = (
  process.env.NEXT_PUBLIC_ARCADE_CONTRACT_ADDRESS || '0x2726459981F58d2ea331A2309655DB267057aaC8'
) as `0x${string}`;

export const ARCADE_SCORE_ABI = [
  {
    type: 'function',
    name: 'recordScore',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'points', type: 'uint256' },
      { name: 'won', type: 'uint256' },
      { name: 'streak', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getPlayerStats',
    stateMutability: 'view',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      {
        type: 'tuple',
        components: [
          { name: 'totalPoints', type: 'uint256' },
          { name: 'gamesWon', type: 'uint256' },
          { name: 'highStreak', type: 'uint256' },
          { name: 'lastUpdated', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getTotalPlayers',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'ScoreRecorded',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'totalPoints', type: 'uint256', indexed: false },
      { name: 'gamesWon', type: 'uint256', indexed: false },
      { name: 'highStreak', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;
