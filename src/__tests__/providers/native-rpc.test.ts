import { NativeRpcProvider } from '../../providers/native-rpc';
import { SUPPORTED_CHAINS } from '../../config/chains';
import fetch from 'node-fetch';
import { jest } from '@jest/globals';

jest.mock('node-fetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('NativeRpcProvider', () => {
  const chainId = 1;
  const providerName = 'native-rpc';
  const config = { rpcUrl: 'https://test.rpc' };
  let provider: NativeRpcProvider;

  beforeEach(() => {
    provider = new NativeRpcProvider(chainId, providerName, config);
    jest.clearAllMocks();
  });

  test('constructor should throw error without RPC URL', () => {
    expect(() => {
      new NativeRpcProvider(chainId, providerName, {});
    }).toThrow('RPC URL is required');
  });

  test('getCurrentFee should return valid fee data', async () => {
    const mockBlockResponse = {
      result: {
        baseFeePerGas: '0x2540BE400', // 10 gwei = 10000000000
      },
    };

    const mockGasPriceResponse = {
      result: '0x28FA6AE00', // 11 gwei = 11000000000
    };

    mockedFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBlockResponse,
      } as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockGasPriceResponse,
      } as any);

    const result = await provider.getCurrentFee();

    expect(result).toEqual({
      baseFee: BigInt('10000000000'),
      priorityFee: BigInt('1000000000'),
      timestamp: expect.any(Number),
      confidence: 'medium',
      unit: SUPPORTED_CHAINS[chainId].feeUnit,
    });
  });
});
