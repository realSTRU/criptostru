const API_KEY = 'CG-q6iNd3Atvz3Eve1PyyVsCBiA'; // Tu API key aquí
const BASE_URL = 'https://api.coingecko.com/api/v3';

// Cache simple para reducir llamadas a la API
const cache = new Map();
const CACHE_DURATION = 60000; // 1 minuto

const getCacheKey = (endpoint, params) => {
  return `${endpoint}-${JSON.stringify(params)}`;
};

const getFromCache = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCache = (key, data) => {
  cache.set(key, { data, timestamp: Date.now() });
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  
  // Agregar API key
  params.x_cg_demo_api_key = API_KEY;
  
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  
  return url.toString();
};

const fetchWithCache = async (endpoint, params = {}) => {
  const cacheKey = getCacheKey(endpoint, params);
  const cached = getFromCache(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  try {
    const url = buildUrl(endpoint, params);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error);
    throw error;
  }
};

export const coinGeckoAPI = {
  // Obtener lista de cryptos con datos de mercado
  getMarketData: async (page = 1, perPage = 50) => {
    return fetchWithCache('/coins/markets', {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: perPage,
      page: page,
      sparkline: true,
      price_change_percentage: '24h,7d'
    });
  },

  // Obtener precio simple de múltiples cryptos
  getSimplePrices: async (coinIds = ['bitcoin', 'ethereum', 'litecoin']) => {
    return fetchWithCache('/simple/price', {
      ids: coinIds.join(','),
      vs_currencies: 'usd',
      include_24hr_change: true,
      include_market_cap: true,
      include_24hr_vol: true
    });
  },

  // Obtener trending coins
  getTrending: async () => {
    return fetchWithCache('/search/trending', {});
  },

  // Obtener datos históricos de una coin
  getMarketChart: async (coinId, days = 7) => {
    return fetchWithCache(`/coins/${coinId}/market_chart`, {
      vs_currency: 'usd',
      days: days
    });
  },

  // Obtener detalles completos de una coin
  getCoinDetails: async (coinId) => {
    return fetchWithCache(`/coins/${coinId}`, {
      localization: false,
      tickers: false,
      community_data: false,
      developer_data: false
    });
  },

  // Obtener datos OHLC para gráficos de velas
  getOHLC: async (coinId, days = 7) => {
    return fetchWithCache(`/coins/${coinId}/ohlc`, {
      vs_currency: 'usd',
      days: days
    });
  },

  // Obtener top gainers y losers
  getTopGainersLosers: async () => {
    return fetchWithCache('/coins/top_gainers_losers', {
      vs_currency: 'usd'
    });
  },

  // Obtener datos globales del mercado
  getGlobalData: async () => {
    return fetchWithCache('/global', {});
  },

  // Búsqueda de cryptos
  searchCoins: async (query) => {
    return fetchWithCache('/search', { query });
  }
};