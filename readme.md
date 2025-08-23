# API Setup Guide

## LiveCoinWatch API Key (Recommended)

**Why LiveCoinWatch?**
- ✅ **10,000 daily credits** (much better than CoinGecko's 30/min)
- ✅ **FREE tier** with no time limit
- ✅ **Reliable data** directly from exchanges
- ✅ **Better rate limits** for multiple crypto tracking

### Step 1: Get Your FREE API Key

1. Go to [livecoinwatch.com/tools/api](https://www.livecoinwatch.com/tools/api)
2. Click "Get API Key" 
3. Sign up with email (free account)
4. Copy your API key

### Step 2: Add API Key to .env File

**Option A: Use .env File (Recommended)**

1. Copy the `.env` file to your project root
2. Edit the `.env` file and replace `your_api_key_here` with your actual API key:
```bash
LIVECOINWATCH_API_KEY=your_actual_api_key_here
REFETCH_TIME=60000
```

**Option B: Environment Variable**
```bash
export LIVECOINWATCH_API_KEY="your_api_key_here"
```

### Step 3: Restart the App
```bash
npm start
```

## Fallback System

**The app automatically falls back to:**
1. **LiveCoinWatch** (primary) - 10,000 daily credits
2. **CoinGecko** (fallback) - 30 calls/min if LiveCoinWatch fails

## Rate Limit Comparison

| API | Free Tier Limit | Monthly Calls | Notes |
|-----|----------------|---------------|--------|
| **LiveCoinWatch** | 10,000/day | ~300,000/month | ✅ Best for multiple cryptos |
| CoinGecko | 30/min | 10,000/month | ❌ Too restrictive |
| CoinMarketCap | 333/day | 10,000/month | ⚠️ Requires separate setup |

## Supported Cryptocurrencies

Currently mapped:
- Bitcoin (BTC)
- Ethereum (ETH)
- Cardano (ADA)
- Solana (SOL)
- Polygon (MATIC)
- Chainlink (LINK)

## Troubleshooting

**"Failed to fetch data" error:**
1. Check your API key is correct
2. Verify internet connection
3. Check if you've exceeded daily limits
4. App will automatically try CoinGecko fallback

**Rate limiting:**
- Reduced refresh to 60 seconds (from 30s)
- Each crypto card fetches independently
- LiveCoinWatch allows batch requests (more efficient)

## Adding More Cryptocurrencies

To add more cryptos, update the `cryptoNameMap` in `CryptoData.js`:

```javascript
const cryptoNameMap = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'your-new-crypto': 'SYMBOL'  // Add here
};
```

Find the correct symbols at [livecoinwatch.com](https://www.livecoinwatch.com)