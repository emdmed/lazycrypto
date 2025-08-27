# Crypto Dashboard

A CLI cryptocurrency tracking dashboard with real-time data and technical indicators.

## Quick Start

### 1. Installation

```bash
npx lazycrypto-cli@latest
```

### 2. Launch and Setup

You will be prompted to add your free LiveCoinWatch api key
<img width="914" height="468" alt="image" src="https://github.com/user-attachments/assets/f030f201-df5c-4b16-9fe7-91097e3e2fc3" />

It will be saved in .config/lazycrypto/config.json

You can use the "mini" arg if you are using tmux or zellij to make the terminal split automatically and see a minified version of the price and indicators on top and continue working on the bottom section.

```
npx lazycrypto-cli@latest mini
```

### 3. Indicators

/ / / = going up

\ \ \ = going down

<img width="761" height="181" alt="image" src="https://github.com/user-attachments/assets/dc45248a-c619-4288-b6b2-68e9a43bb7fa" />

## Supported Cryptocurrencies

Currently configured cryptocurrencies:
- Bitcoin (BTC)
- Monero (XMR)
- Ethereum (ETH)
- Cardano (ADA)
- Solana (SOL)
- Polygon (MATIC)
- Chainlink (LINK)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**⚠️ Disclaimer**: This application is for informational purposes only. Cryptocurrency investments carry risk. Always do your own research before making investment decisions.
