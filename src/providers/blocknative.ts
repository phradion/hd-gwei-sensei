import fetch from 'node-fetch';
import { BaseProvider } from './base';
import { FeeData, ProviderConfig } from '../types/provider';
import { SUPPORTED_CHAINS } from '../config/chains';

export class BlocknativeProvider extends BaseProvider {
  private readonly baseUrl = 'https://api.blocknative.com/gasprices/blockprices';

  constructor(chainId: string | number, providerName: string, config: ProviderConfig) {
    if (!config.blocknativeApiKey) {
      throw new Error('Blocknative API key is required');
    }
    super(chainId, providerName, config);
  }

  async getCurrentFee(): Promise<FeeData> {
    const response = await fetch(this.baseUrl, {
      headers: {
        Authorization: this.config.blocknativeApiKey ?? '',
      },
    });

    if (!response.ok) {
      throw this.createError(`Blocknative API error: ${response.statusText}`);
    }

    const data = await response.json();
    return this.transformFeeData(data);
  }

  async getHistoricalFees(from: Date, to: Date): Promise<FeeData[]> {
    throw this.createError('Historical data not available through Blocknative');
  }

  private transformFeeData(data: any): FeeData {
    const blockPrices = data.blockPrices[0];
    const estimatedPrices = blockPrices.estimatedPrices[0];
    const chain = SUPPORTED_CHAINS[this.chainId];

    return {
      baseFee: BigInt(Math.round(blockPrices.baseFeePerGas * 1e9)),
      priorityFee: BigInt(Math.round(estimatedPrices.maxPriorityFeePerGas * 1e9)),
      timestamp: Date.now(),
      confidence: this.getConfidenceLevel(estimatedPrices.confidence),
      unit: chain.feeUnit,
    };
  }

  private getConfidenceLevel(confidence: number): 'low' | 'medium' | 'high' {
    if (confidence >= 90) return 'high';
    if (confidence >= 70) return 'medium';
    return 'low';
  }
}
