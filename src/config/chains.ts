export interface ChainConfig {
  id: string | number;
  name: string;
  feeUnit: string;
  feeDecimals: number;
  blockTime: number;
  defaultProvider: string;
  supportedProviders: string[];
}

export const SUPPORTED_CHAINS: Record<string | number, ChainConfig> = {
  // Ethereum Mainnet
  1: {
    id: 1,
    name: 'Ethereum Mainnet',
    feeUnit: 'gwei',
    feeDecimals: 9,
    blockTime: 12,
    defaultProvider: 'blocknative',
    supportedProviders: ['blocknative', 'etherscan', 'native-rpc'],
  },
  // Polygon
  137: {
    id: 137,
    name: 'Polygon Mainnet',
    feeUnit: 'gwei',
    feeDecimals: 9,
    blockTime: 2,
    defaultProvider: 'blocknative',
    supportedProviders: ['blocknative', 'polygonscan', 'native-rpc'],
  },
  // Solana
  'mainnet-beta': {
    id: 'mainnet-beta',
    name: 'Solana Mainnet',
    feeUnit: 'lamports',
    feeDecimals: 9,
    blockTime: 0.4,
    defaultProvider: 'native-rpc',
    supportedProviders: ['native-rpc'],
  },
};
