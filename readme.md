# Crypto Dashboard

A modern cryptocurrency tracking dashboard with real-time data, technical indicators, and both web and CLI interfaces.

## Features

- 📊 **Real-time crypto data** with automatic refresh
- 📈 **Technical indicators** (RSI, MACD, Moving Averages)
- 💻 **CLI interface** for terminal users
- ⚡ **High rate limits** with LiveCoinWatch API

## Quick Start

### 1. Installation

```bash
npx lazycrypto-cli
```

### 2. API Setup

You will be prompted to add your free LiveCoinWatch api key
<img width="914" height="468" alt="image" src="https://github.com/user-attachments/assets/f030f201-df5c-4b16-9fe7-91097e3e2fc3" />

It will be saved in .config/lazycrypto/config.json

### 4. Launch the App

**Web Interface:**
```bash
npm start
```

**CLI Interface:**
```bash
# If installed globally
lazycrypto

# Or locally
npm run cli
```

## API Configuration

### LiveCoinWatch (Recommended - Primary)

**Why LiveCoinWatch?**
- ✅ **10,000 daily requests** (333x more than CoinGecko)
- ✅ **FREE tier** with no expiration
- ✅ **Reliable exchange data**
- ✅ **Historical data support**
- ✅ **Technical indicators calculation**

### Automatic Fallback System

The app intelligently handles API failures:

1. **Primary**: LiveCoinWatch API (10,000 daily requests)
2. **Fallback**: CoinGecko API (30 requests/minute)
3. **Error handling**: Graceful degradation with user notifications

## Supported Cryptocurrencies

Currently configured cryptocurrencies:
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Solana (SOL)
- Polygon (MATIC)
- Chainlink (LINK)

*Additional cryptocurrencies can be added by updating the `cryptoOptions.js` configuration file.*

## Technical Features

### Real-time Data
- **Automatic refresh**: Configurable intervals (default: 15 minutes)
- **Live price updates**: Current rates with 24h change indicators
- **Volume tracking**: Trading volume for each cryptocurrency
- **Market data**: Market cap, supply, and ranking information

### Technical Analysis
- **RSI (Relative Strength Index)**: Momentum oscillator
- **MACD**: Moving Average Convergence Divergence
- **Moving Averages**: SMA and EMA calculations
- **Historical charts**: 7-day price history visualization
- **Indicators require**: Minimum 100 data points for accuracy

### Error Handling
- **API key validation**: Clear error messages for authentication issues
- **Rate limit protection**: Automatic backoff and fallback systems
- **Network resilience**: Retry logic for failed requests
- **User-friendly errors**: Helpful troubleshooting messages

## Rate Limits & Performance

| API Provider | Free Tier Limit | Monthly Capacity | Status |
|-------------|----------------|------------------|---------|
| **LiveCoinWatch** | 10,000/day | ~300,000/month | ✅ Primary |
| CoinGecko | 30/minute | ~43,000/month | 🔄 Fallback |
| CoinMarketCap | 333/day | ~10,000/month | ❌ Not used |

## Project Structure

```
├── src/
│   ├── components/          # React components
│   │   ├── App.js          # Main web application
│   │   ├── MultiCryptoDashboard.js
│   │   └── ConfigPanel.js
│   ├── hooks/              # Custom React hooks
│   │   └── useCryptoData.js # Main data fetching logic
│   ├── utils/              # Utility functions
│   │   ├── indicators/     # Technical analysis
│   │   └── readJsonFile.js
│   └── constants/
│       └── cryptoOptions.js # Cryptocurrency configuration
├── cli.js                  # CLI entry point
└── package.json
```

## CLI Features

The CLI interface provides:
- **Configuration management**: Setup API keys interactively
- **Config storage**: Saves settings in `~/.config/lazycrypto/config.json`
- **Auto-updates**: Built-in update notifications
- **Terminal dashboard**: Real-time data in your terminal

## Adding New Cryptocurrencies

1. **Find the API code** at [livecoinwatch.com](https://www.livecoinwatch.com)
2. **Update configuration** in `src/constants/cryptoOptions.js`:

```javascript
export const cryptoOptions = [
  // Existing options...
  {
    value: 'your-crypto-id',
    label: 'Your Crypto Name',
    apiCode: 'SYMBOL'  // API symbol from LiveCoinWatch
  }
];
```

## Troubleshooting

### Common Issues

**❌ "Please set your LiveCoinWatch api key"**
- Check your `.env` file exists and contains the correct API key
- Restart the application after adding the API key

**❌ "API rate limit exceeded"**
- You've exceeded 10,000 daily requests
- App will automatically use CoinGecko fallback
- Consider reducing refresh frequency in production

**❌ "Invalid API key"**
- Verify your API key is correct
- Check for extra spaces or characters
- Regenerate key from LiveCoinWatch dashboard

**❌ "Failed to fetch crypto data"**
- Check internet connection
- Verify the cryptocurrency symbol is supported
- Check API service status

### Performance Optimization

**For high-frequency usage:**
- Increase `REFETCH_TIME` in `.env` (default: 60000ms)
- Consider caching strategies for production deployments
- Monitor API usage to stay within limits

**For multiple cryptocurrencies:**
- LiveCoinWatch supports batch requests
- Consider implementing request batching for efficiency
- Monitor memory usage with large datasets

## Development

### Running in Development

```bash
# Start web development server
npm run dev

# Run CLI in development
npm run cli:dev

# Build for production
npm run build
```

### Environment Variables

```bash
# Required
LIVECOINWATCH_API_KEY=your_api_key

# Optional
REFETCH_TIME=60000              # Refresh interval (ms)
NODE_ENV=development            # Environment
PORT=3000                       # Web server port
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- 📧 **Email**: [your-email@domain.com]
- 🐛 **Issues**: [GitHub Issues](link-to-issues)
- 📖 **Documentation**: [Wiki](link-to-wiki)

---

**⚠️ Disclaimer**: This application is for informational purposes only. Cryptocurrency investments carry risk. Always do your own research before making investment decisions.
