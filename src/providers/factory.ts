import { GasDataProvider, ProviderConfig } from '../types/provider';
import { SUPPORTED_CHAINS } from '../config/chains';
import { BlocknativeProvider } from './blocknative';
import { NativeRpcProvider } from './native-rpc';

export class ProviderFactory {
  private static providers: Map<string, GasDataProvider> = new Map();

  static getProvider(
    chainId: string | number,
    config: ProviderConfig & { preferredProvider?: string }
  ): GasDataProvider {
    const chain = SUPPORTED_CHAINS[chainId];
    if (!chain) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }

    const providerName = config.preferredProvider || chain.defaultProvider;
    const cacheKey = `${chainId}-${providerName}`;

    if (this.providers.has(cacheKey)) {
      return this.providers.get(cacheKey)!;
    }

    const provider = this.createProvider(chainId, providerName, config);
    this.providers.set(cacheKey, provider);
    return provider;
  }

  private static createProvider(
    chainId: string | number,
    providerName: string,
    config: ProviderConfig
  ): GasDataProvider {
    switch (providerName) {
      case 'blocknative':
        return new BlocknativeProvider(chainId, providerName, config);
      case 'native-rpc':
        return new NativeRpcProvider(chainId, providerName, config);
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  }

  static clearProviders(): void {
    this.providers.clear();
  }
}
