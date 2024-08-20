import { json } from '@remix-run/node';

import { CoinPriceModel } from '~/models';

import dbConnect from './db.server';

export const pullCoinPrice = async () => {
  await dbConnect();

  const BASE_URL = 'https://pro-api.coinmarketcap.com';
  const EXCHANGE_RATE_URL = 'https://api.exchangerate-api.com/v4/latest/USD';

  const symbol = 'PSUB';

  try {
    const response = await fetch(`${BASE_URL}/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
      method: 'GET',
      headers: new Headers({
        'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to retrieve coin price information.');
    }
    const data = await response.json();
    const usdPrice = data.data[symbol].quote.USD.price;

    const rateResponse = await fetch(EXCHANGE_RATE_URL);

    if (!rateResponse.ok) {
      throw new Error('Failed to retrieve exchange rate information.');
    }
    const rateData = await rateResponse.json();
    const usdToCnyRate = rateData.rates['CNY'];

    await CoinPriceModel.create({
      symbol,
      USD: usdPrice,
      CNY: usdPrice * usdToCnyRate,
      createdAt: new Date(),
    });

    return { USD: usdPrice, CNY: usdPrice * usdToCnyRate };
  } catch (error) {
    console.error('getCoinPrice error:', error);
    throw error;
  }
};

export const getCoinPrice = async () => {
  await dbConnect();

  const symbol = 'PSUB';

  try {
    const coinPriceInfo = await CoinPriceModel.findOne().sort({ createdAt: -1 });

    if (!coinPriceInfo) {
      return json({ error: `Coin price information for ${symbol} is not available.` }, { status: 404 });
    }

    return coinPriceInfo;
  } catch (error) {
    console.error(`getCoinPrice error for symbol ${symbol}:`, error);
    return json({ error: `Server error occurred while fetching ${symbol} coin price.` }, { status: 500 });
  }
};
