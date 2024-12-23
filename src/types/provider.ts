export type ConfidenceLevel = 'low' | 'medium' | 'high';

export interface FeeData {
  baseFee: bigint;
  priorityFee?: bigint;
  timestamp: number;
  confidence: ConfidenceLevel;
  unit: string;
  blockNumber?: number;
}

export interface ProviderConfig {
  apiKey?: string;
  rpcUrl?: string;
  timeout?: number;
  customParams?: Record<string, any>;
  blocknativeApiKey?: string;
}

export interface GasDataProvider {
  readonly chainId: string | number;
  readonly providerName: string;

  getCurrentFee(): Promise<FeeData>;
  getHistoricalFees(from: Date, to: Date): Promise<FeeData[]>;
  estimateGas?(txParams: any): Promise<bigint>;

  // Optional methods for provider-specific features
  getPriorityFeeRange?(): Promise<{ min: bigint; max: bigint }>;
  getNetworkLoad?(): Promise<ConfidenceLevel>;
}

export interface ProviderError extends Error {
  code?: string;
  data?: any;
  provider?: string;
}

export interface HistoricalFeeData extends FeeData {
  blockNumber: number;
}
