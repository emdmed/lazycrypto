import crypto from 'crypto-js'
import { v4 as uuidv4 } from  'uuid'
import axios from 'axios'
import  { DateTime } from 'luxon';
import { loadCredentials } from '../utils/credentials.js';

const environment = process.env.ENVIRONMENT; 

const coin = process.argv[2]
const stable = process.argv[3]
const SYMBOL = coin && stable ? `${coin}-${stable}` : process.env.SYMBOL;
const kucoinAccount = process.argv[5] || "main"

function createSignature(timestamp, method, endpoint, body = '', credentials) {
    const strToSign = timestamp + method + endpoint + body;
    const signature = crypto.HmacSHA256(strToSign, credentials.apiSecret).toString(crypto.enc.Base64);
    return signature;
}

const baseUrl = environment === 'sandbox'
    ? 'https://openapi-sandbox.kucoin.com'
    : 'https://api.kucoin.com';

var countDecimals = function (value) {
    if (Number.isInteger(Number(value))) return 0
    if (Math.floor(value) === value) return 0;
    return value.toString().split(".")[1].length || 0;
}

const fetchHistoricalData = async (symbol, interval) => {
    const weeksBefore = (60 * 60 * 24 * 7) * 2
    const start = Math.floor(Date.now() / 1000) - (weeksBefore)
    const end = Math.floor(Date.now() / 1000)

    const url = `https://api.kucoin.com/api/v1/market/candles?type=${interval}&symbol=${symbol}&startAt=${start}&endAt=${end}`;
    try {
        const response = await axios.get(url);
        return response.data.data.reverse();
    } catch (e) {
        console.log(e)
    }
}

const fetchHistoricalDataOneWeekFromDate = async (symbol, interval, endDate) => {
    const start = DateTime.fromISO(endDate).minus({ weeks: 1 }).toSeconds()
    const end = DateTime.fromISO(endDate).toSeconds()

    const url = `https://api.kucoin.com/api/v1/market/candles?type=${interval}&symbol=${symbol}&startAt=${start}&endAt=${end}`;
    const response = await axios.get(url);
    return response.data.data.reverse();
};

const fetchHistoricalDataOneForwardWeekFromDate = async (symbol, interval, endDate) => {
    const start = DateTime.fromISO(endDate).toSeconds()
    const end = DateTime.fromISO(endDate).plus({ weeks: 1 }).toSeconds()

    const url = `https://api.kucoin.com/api/v1/market/candles?type=${interval}&symbol=${symbol}&startAt=${start}&endAt=${end}`;
    const response = await axios.get(url);
    return response.data.data.reverse();
};

const fetchHistoricalDataWithParams = async (symbol, interval, startDate, endDate) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate).getTime() / 1000 : new Date().getTime()

    const earlierStart = DateTime.fromJSDate(start).minus({ hours: 30 }).toSeconds()

    const url = `https://api.kucoin.com/api/v1/market/candles?type=${interval}&symbol=${symbol}&startAt=${earlierStart.toFixed(0)}&endAt=${end.toFixed(0)}`;
    const response = await axios.get(url);
    return response.data.data.toReversed();
};

function removeDecimalsWithoutRounding(num, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.floor(num * factor) / factor;
}

async function placeOrder(side = "buy", price, availableFunds, symbolParams, symbol) {
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'POST';
    const endpoint = '/api/v1/orders';

    const { quoteIncrement, baseIncrement, priceIncrement } = symbolParams

    const sizeDecimalPlaces = countDecimals(side === "buy" ? baseIncrement : quoteIncrement)

    let size

    if (side === "buy") {
        size = availableFunds / price
    } else {
        size = availableFunds
    }

    const order = {
        clientOid: uuidv4(),
        side,
        symbol,
        type: 'market',
        size: sizeDecimalPlaces === 0 ? Number(size).toFixed(0) : removeDecimalsWithoutRounding(size, sizeDecimalPlaces).toString(),
    };

    const body = JSON.stringify(order);

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, body, credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(`${baseUrl}${endpoint}`, order, { headers });
        return response.data
    } catch (error) {
        console.error('Error placing order:', error.response ? error.response.data : error.message);
        return false
    }
}

async function placeStopOrder({ side = "buy", price, availableFunds, symbolParams, symbol, stopType = null, stopPrice = null }) {
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'POST';
    const endpoint = '/api/v1/orders';

    const { quoteIncrement, baseIncrement, priceIncrement } = symbolParams

    const sizeDecimalPlaces = countDecimals(side === "buy" ? baseIncrement : quoteIncrement)

    let size = side === "buy" ? availableFunds / price : availableFunds;

    size = sizeDecimalPlaces === 0 ? Number(size).toFixed(0) : removeDecimalsWithoutRounding(size, sizeDecimalPlaces).toString();

    const order = {
        clientOid: uuidv4(),
        side,
        symbol,
        type: 'market',
        size
    };

    if (stopType && stopPrice) {
        order.stop = stopType;
        order.stopPrice = stopPrice;
    }

    const body = JSON.stringify(order);

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, body, credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(`${baseUrl}${endpoint}`, order, { headers });
        return response.data
    } catch (error) {
        console.error('Error placing order:', error.response ? error.response.data : error.message);
        return false
    }
}

async function getAccountBalance(currency) {
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'GET';
    const endpoint = `/api/v1/accounts?type=trade&currency=${currency}`;

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, '', credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
        return parseFloat(response.data.data[0]?.available || 0);
    } catch (error) {
        console.error('Error fetching account balance:', error.response ? error.response.data : error.message);
        return 0;
    }
}

const fetchCurrentPrice = async (symbol) => {
    const url = `https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=${symbol || SYMBOL}`;
    const response = await axios.get(url);
    return response.data.data
}

const checkOrderIsFilled = async (orderId) => {
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'GET';
    const endpoint = `/api/v1/limit/fills`;

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, '', credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
        const fillList = response.data.data

        const isOrderFilled = fillList.filter(order => order.orderId === orderId)[0] || false

        if (isOrderFilled) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Error fetching fills:', error.response ? error.response.data : error.message);
        return false
    }
}

const getSymbolParams = async (symbol) => {
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'GET';
    const endpoint = `/api/v2/symbols/${symbol || SYMBOL}`;

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, '', credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
        return response.data.data
    } catch (error) {
        console.error('Error fetching symbol params:', error.response ? error.response.data : error.message);
        return false
    }
}

async function getKucoinTradingBalanceInUSDT() {
    const credentials = await loadCredentials();
    const baseURL = 'https://api.kucoin.com';
    const timestamp = Date.now();

    const signatureStr = timestamp + 'GET' + '/api/v1/accounts';
    const signature = crypto.HmacSHA256(signatureStr, credentials.apiSecret).toString(crypto.enc.Base64);

    try {
        const accountResponse = await axios.get(`${baseURL}/api/v1/accounts`, {
            headers: {
                'KC-API-KEY': credentials.apiKey,
                'KC-API-SIGN': signature,
                'KC-API-TIMESTAMP': timestamp,
                'KC-API-PASSPHRASE': credentials.apiPassphrase,
                'KC-API-KEY-VERSION': '1',
            },
            params: {
                type: 'trade',
            },
        });

        const balances = accountResponse.data.data;

        const tickerResponse = await axios.get(`${baseURL}/api/v1/market/allTickers`);
        const tickers = tickerResponse.data.data.ticker;

        const priceMap = {};
        tickers.forEach(ticker => {
            priceMap[ticker.symbol] = parseFloat(ticker.last);
        });

        let totalBalanceInUSDT = 0;

        for (let balance of balances) {
            const { currency, available } = balance;
            if (currency === 'USDT') {
                totalBalanceInUSDT += parseFloat(available);
            } else {
                const tradingPair = `${currency}-USDT`;
                const priceInUSDT = priceMap[tradingPair] || 0;
                totalBalanceInUSDT += parseFloat(available) * priceInUSDT;
            }
        }

        return totalBalanceInUSDT;
    } catch (error) {
        console.error('Error fetching balance in USDT:', error.response ? error.response.data : error.message);
        return 0;
    }
}

async function getOrderDetailsById(orderId) {
  console.log("orderId", orderId)
    const credentials = await loadCredentials();
    const timestamp = Date.now().toString();
    const method = 'GET';
    const endpoint = `/api/v1/orders/${orderId}`;

    const headers = {
        'KC-API-KEY': credentials.apiKey,
        'KC-API-SIGN': createSignature(timestamp, method, endpoint, '', credentials),
        'KC-API-TIMESTAMP': timestamp,
        'KC-API-PASSPHRASE': credentials.apiPassphrase,
        'KC-API-KEY-VERSION': '1',
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching order details:', error.response ? error.response.data : error.message);
        return false;
    }
}

const kucoin = {
    placeOrder,
    placeStopOrder,
    getAccountBalance,
    checkOrderIsFilled,
    getSymbolParams,
    fetchHistoricalData,
    fetchHistoricalDataWithParams,
    fetchCurrentPrice,
    fetchHistoricalDataOneWeekFromDate,
    fetchHistoricalDataOneForwardWeekFromDate,
    getKucoinTradingBalanceInUSDT,
    getOrderDetailsById
}

export default kucoin