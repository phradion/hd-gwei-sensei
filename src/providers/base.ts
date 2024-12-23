import { GasDataProvider, ProviderConfig, FeeData, ProviderError } from '../types/provider';
import { SUPPORTED_CHAINS } from '../config/chains';

export abstract class BaseProvider implements GasDataProvider {
  readonly chainId: string | number;
  readonly providerName: string;
  protected config: ProviderConfig;

  constructor(chainId: string | number, providerName: string, config: ProviderConfig = {}) {
    this.chainId = chainId;
    this.providerName = providerName;
    this.validateChain(chainId);

    this.config = {
      timeout: 10000,
      apiKey: '',
      rpcUrl: '',
      customParams: {},
      blocknativeApiKey: '',
      ...config,
    };
  }

  protected validateChain(chainId: string | number): void {
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) {
      throw this.createError(`Unsupported chain ID: ${chainId}`);
    }
    if (!chain.supportedProviders.includes(this.providerName)) {
      throw this.createError(`Provider ${this.providerName} not supported for chain ${chainId}`);
    }
  }

  protected createError(message: string, code?: string, data?: any): ProviderError {
    const error = new Error(message) as ProviderError;
    error.provider = this.providerName;
    error.code = code;
    error.data = data;
    return error;
  }

  abstract getCurrentFee(): Promise<FeeData>;
  abstract getHistoricalFees(from: Date, to: Date): Promise<FeeData[]>;
}
