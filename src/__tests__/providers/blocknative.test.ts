import { BlocknativeProvider } from '../../providers/blocknative';
import { SUPPORTED_CHAINS } from '../../config/chains';
import fetch from 'node-fetch';

jest.mock('node-fetch');
const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('BlocknativeProvider', () => {
  const chainId = 1; // Ethereum Mainnet
  const providerName = 'blocknative';
  const config = { blocknativeApiKey: 'test-api-key' };
  let provider: BlocknativeProvider;

  beforeEach(() => {
    provider = new BlocknativeProvider(chainId, providerName, config);
    jest.clearAllMocks();
  });

  test('constructor should throw error without API key', () => {
    expect(() => {
      new BlocknativeProvider(chainId, providerName, {});
    }).toThrow('Blocknative API key is required');
  });

  test('getCurrentFee should return valid fee data', async () => {
    const mockResponse = {
      blockPrices: [
        {
          baseFeePerGas: 50,
          estimatedPrices: [
            {
              maxPriorityFeePerGas: 2,
              confidence: 95,
            },
          ],
        },
      ],
    };

    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as any);

    const result = await provider.getCurrentFee();

    expect(result).toEqual({
      baseFee: BigInt('50000000000'),
      priorityFee: BigInt('2000000000'),
      timestamp: expect.any(Number),
      confidence: 'high',
      unit: SUPPORTED_CHAINS[chainId].feeUnit,
    });
  });
});
