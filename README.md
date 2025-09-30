# 🔮 Secret Market - Private Prediction Markets

A fully homomorphic encryption (FHE) powered prediction market platform that enables private betting on cryptocurrency price movements. Built with FHEVM technology, users can place encrypted bets without revealing their positions to other participants.

![Secret Market](https://img.shields.io/badge/Status-Live-brightgreen)
![FHEVM](https://img.shields.io/badge/Powered%20by-FHEVM-blue)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-orange)
![React](https://img.shields.io/badge/React-18-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)

## 🌟 Features

### 🔒 **Privacy-First Design**
- **Encrypted Betting**: All bet amounts are encrypted using FHEVM technology
- **Private Positions**: Your betting strategy remains completely private
- **No Copy Trading**: Other participants cannot see or copy your positions

### 🎯 **Multi-Market Support**
- **Bitcoin Predictions**: "Will BTC close above $100k this year?"
- **Ethereum Predictions**: "What price will Ethereum hit September 29-October 5?"
- **Extensible**: Easy to add new prediction markets

### 💫 **Professional UI/UX**
- **Dark Theme**: Sleek, modern interface inspired by Polymarket
- **Market Selection**: Click to select which market you want to bet on
- **Real-time Feedback**: Visual confirmation when bets are placed
- **Encrypted Stakes Display**: View your encrypted stake handles

### ⚡ **Real-time Functionality**
- **Instant Betting**: Place bets instantly on the blockchain
- **Live Updates**: Encrypted stakes refresh automatically
- **Gas Optimization**: Efficient smart contract design

## 🏗️ Architecture

### Smart Contract Layer
- **PredictionMarket.sol**: Core contract handling encrypted betting logic
- **FHEVM Integration**: Uses `euint128` for encrypted computations
- **Oracle Resolution**: Controlled market resolution system

### Frontend Layer
- **React/Next.js**: Modern web application
- **FHEVM React Hooks**: Seamless integration with encrypted operations
- **MetaMask Integration**: Wallet connection and transaction signing

### Development Tools
- **Hardhat**: Smart contract development and testing
- **TypeScript**: Full type safety across the stack
- **Comprehensive Tests**: Complete test coverage for all functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended: Node.js 20+)
- MetaMask wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheOnma/fhevm-project.git
   cd fhevm-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Hardhat node**
   ```bash
   npm run hardhat-node
   ```

4. **Deploy contracts** (in a new terminal)
   ```bash
   npm run deploy
   ```

5. **Start the frontend** (in a new terminal)
   ```bash
   cd packages/site
   npm run dev:mock
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

### Connect Your Wallet
1. Click "Log In" in the top right
2. Connect your MetaMask wallet
3. Switch to the localhost network (chainId: 31337)

## 🎮 How to Use

### Placing a Bet
1. **Select a Market**: Click on either the Bitcoin or Ethereum market card
2. **Choose Your Position**: Click "Bet YES" or "Bet NO"
3. **Set Amount**: Enter your bet amount (default: 1)
4. **Confirm Transaction**: Sign the transaction in MetaMask
5. **View Results**: See your encrypted stake handles update

### Viewing Your Stakes
- Your encrypted stakes are displayed in the "Your Encrypted Stakes" section
- Click "🔄 Refresh" to update your stake information
- Green "✓ Active stake detected" indicates successful bets

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd packages/fhevm-hardhat-template
npm test
```

### Test Coverage
- ✅ Contract deployment
- ✅ Encrypted betting functionality
- ✅ Market resolution
- ✅ Access control
- ✅ Error handling

## 📁 Project Structure

```
fhevm-project/
├── packages/
│   ├── fhevm-hardhat-template/     # Smart contract development
│   │   ├── contracts/
│   │   │   └── PredictionMarket.sol
│   │   ├── test/
│   │   │   └── PredictionMarket.ts
│   │   ├── tasks/
│   │   │   └── PredictionMarket.ts
│   │   └── deploy/
│   │       └── deploy.ts
│   ├── site/                       # Frontend application
│   │   ├── app/
│   │   ├── components/
│   │   │   └── PredictionMarketDemo.tsx
│   │   ├── hooks/
│   │   │   └── usePredictionMarket.tsx
│   │   └── abi/                    # Auto-generated contract interfaces
│   └── postdeploy/                 # ABI generation script
└── scripts/                        # Utility scripts
```

## 🔧 Development

### Available Scripts

#### Root Level
- `npm run hardhat-node` - Start local Hardhat node
- `npm run deploy` - Deploy contracts to localhost
- `npm run test` - Run all tests

#### Site Package
- `npm run dev:mock` - Start development server with mock data
- `npm run build` - Build for production
- `npm run start` - Start production server

#### Hardhat Package
- `npm run compile` - Compile smart contracts
- `npm run test` - Run contract tests
- `npm run deploy` - Deploy to localhost

### Adding New Markets

1. **Update the UI** in `PredictionMarketDemo.tsx`
2. **Add market data** to the component state
3. **Deploy new contract** if needed
4. **Update ABI** using the postdeploy script

## 🌐 Deployment

### Localhost Development
```bash
npm run hardhat-node
npm run deploy
npm run dev:mock
```

### Production Deployment
1. Deploy contracts to your target network
2. Update contract addresses in `packages/site/abi/`
3. Build and deploy the frontend

## 🔐 Security Features

- **Encrypted Computation**: All sensitive operations use FHEVM
- **Private Keys**: Never exposed in the application
- **Access Control**: Only authorized users can resolve markets
- **Input Validation**: Comprehensive validation on all inputs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For the FHEVM technology and development tools
- **Hardhat**: For the excellent development environment
- **Next.js**: For the powerful React framework
- **Polymarket**: For UI/UX inspiration

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/TheOnma/fhevm-project/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🚀 Roadmap

- [ ] Additional prediction markets
- [ ] Mobile-responsive design improvements
- [ ] Advanced analytics dashboard
- [ ] Multi-token support
- [ ] Governance features
- [ ] API for third-party integrations

---

**Built with ❤️ using FHEVM technology for a more private and secure DeFi future.**