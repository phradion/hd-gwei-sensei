# 🥷 gwei-sensei

A machine learning-powered tool for predicting optimal transaction fees and scheduling deployments across multiple blockchain networks. Despite the playful 'gwei' reference in the name (a nod to Ethereum's gas unit), gwei-sensei supports both EVM and non-EVM chains where transaction fee optimization is crucial. It helps developers minimize costs and optimize deployment timing using historical fee data and advanced prediction models.

## 🎯 Features

- **Fee Prediction**: ML-based forecasting of transaction fees across chains
- **Deployment Scheduling**: Optimal timing suggestions for contract/program deployments
- **Multi-Chain Support**: Extensive support for various blockchain networks
- **Flexible Usage**: Available as bot- **Historical Analysis**: Uses historical fee data for accurate predictions

## 🌐 Supported Networks

gwei-sensei supports fee optimization for the following blockchain networks:

### EVM Compatible Networks
- Ethereum Mainnet
- Polygon PoS
- BNB Smart Chain
- Arbitrum One
- Optimism
- Avalanche C-Chain
- Base
- zkSync Era
- Linea

### Non-EVM Networks
- Solana (prioritization fees)
- Cosmos Hub (gas fees)
- Sui (gas fees)
- Aptos (gas fees)
- Near Protocol (gas fees)
- Polkadot (transaction fees)
- Cardano (transaction fees)
- Tezos (gas fees)

Each network has its own fee model and optimization strategies. gwei-sensei automatically adjusts its predictions and recommendations based on the specific characteristics of each chain.

## 📦 Installation

Install gwei-sensei globally using npm:

```bash
npm install -g gwei-sensei
```

Or add it to your project:

```bash
npm install gwei-sensei
```

## 🚀 Usage

### CLI Usage

```bash
# Get the next optimal deployment window
gwei-sensei predict-window

# Get current fee recommendation
gwei-sensei suggest-fee --network ethereum

# Schedule a deployment for optimal gas price
gwei-sensei schedule-deploy --max-gas 100 --deadline "2024-01-01"
```

### Code Integration

```typescript
import { GweiSensei } from 'gwei-sensei';

// Initialize the predictor
const sensei = new GweiSensei();

// Get next optimal deployment window
const window = await sensei.predictOptimalWindow({
maxGas: 100,
deadline: new Date('2024-01-01'),
});

// Schedule a deployment
const schedule = await sensei.scheduleDeployment({
contract: './MyContract.sol',
maxGas: 100,
deadline: new Date('2024-01-01'),
});
```

## 🛠 Development

```bash
# Clone the repository
git clone https://github.com/yourusername/gwei-sensei.git
cd gwei-sensei

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, questions, or feedback, please [open an issue](https://github.com/yourusername/gwei-sensei/issues) on our GitHub repository.
