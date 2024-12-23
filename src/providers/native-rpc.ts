import { BaseProvider } from './base';
import { FeeData, ProviderConfig } from '../types/provider';
import { SUPPORTED_CHAINS } from '../config/chains';
import fetch from 'node-fetch';

interface JsonRpcRequest {
  jsonrpc: '2.0';
  method: string;
  params: any[];
  id: number;
}

export class NativeRpcProvider extends BaseProvider {
  private requestId = 1;

  constructor(chainId: string | number, providerName: string, config: ProviderConfig) {
    if (!config.rpcUrl) {
      throw new Error('RPC URL is required');
    }
    super(chainId, providerName, config);
  }

  private async makeRpcCall<T>(method: string, params: any[] = []): Promise<T> {
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id: this.requestId++,
    };

    const response = await fetch(this.config.rpcUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw this.createError(`RPC error: ${response.statusText}`);
    }

    const data = (await response.json()) as { error?: { message: string }; result: T };
    if (data.error) {
      throw this.createError(`RPC error: ${data.error.message}`);
    }

    return data.result;
  }

  async getCurrentFee(): Promise<FeeData> {
    const chain = SUPPORTED_CHAINS[this.chainId];
    const [baseFee, gasPrice] = await Promise.all([
      this.makeRpcCall<any>('eth_getBlockByNumber', ['latest', false]).then(
        (block) => block.baseFeePerGas || '0x0'
      ),
      this.makeRpcCall<string>('eth_gasPrice'),
    ]);

    const baseFeeValue = BigInt(baseFee);
    const gasPriceValue = BigInt(gasPrice);

    return {
      baseFee: baseFeeValue,
      priorityFee: gasPriceValue - baseFeeValue,
      timestamp: Date.now(),
      confidence: 'medium',
      unit: chain.feeUnit,
    };
  }

  async getHistoricalFees(from: Date, to: Date): Promise<FeeData[]> {
    throw this.createError('Historical data not implemented for native RPC');
  }
}
