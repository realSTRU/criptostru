import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, Search, Filter } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { coinGeckoAPI } from '../Services/coinGeckoAPI';

const WatchList = ({ searchFromHeader = '' }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, favorites, gainers, losers
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : ['bitcoin', 'ethereum', 'cardano'];
  });

  // Sincronizar búsqueda del header con la local
  useEffect(() => {
    if (searchFromHeader) {
      setSearchTerm(searchFromHeader);
    }
  }, [searchFromHeader]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await coinGeckoAPI.getMarketData(1, 50);
        setCoins(data);
      } catch (error) {
        console.error('Error fetching coins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleFavorite = (coinId) => {
    const newFavorites = favorites.includes(coinId)
      ? favorites.filter(id => id !== coinId)
      : [...favorites, coinId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const getFilteredCoins = () => {
    let filtered = coins;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(coin =>
        coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    switch (filter) {
      case 'favorites':
        filtered = filtered.filter(coin => favorites.includes(coin.id));
        break;
      case 'gainers':
        filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0);
        filtered.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        break;
      case 'losers':
        filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0);
        filtered.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        break;
    }

    return filtered.slice(0, 20);
  };

  const formatCurrency = (value) => {
    if (value >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 8
      }).format(value);
    }
  };

  const formatMarketCap = (value) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return formatCurrency(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-effect px-3 py-2 rounded-lg shadow-lg">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const filteredCoins = getFilteredCoins();

  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-10 w-64 mb-6 rounded"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="watchlist-section" className="space-y-6 animate-fadeIn scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Watch List
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {filteredCoins.length} criptomonedas
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar crypto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-dark-card 
              border border-gray-200 dark:border-dark-border focus:outline-none 
              focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {['all', 'favorites', 'gainers', 'losers'].map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
              filter === filterOption
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-glow-sm'
                : 'bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {filterOption === 'all' && '📊 Todas'}
            {filterOption === 'favorites' && '⭐ Favoritas'}
            {filterOption === 'gainers' && '🚀 Top Gainers'}
            {filterOption === 'losers' && '📉 Top Losers'}
          </button>
        ))}
      </div>

      {/* Coins List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-dark-border">
                <th className="text-left p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  #
                </th>
                <th className="text-left p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Nombre
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Precio
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  24h
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">
                  Market Cap
                </th>
                <th className="text-center p-4 text-sm font-semibold text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  Últimos 7 días
                </th>
                <th className="text-center p-4 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => {
                const isPositive = coin.price_change_percentage_24h >= 0;
                const isFavorite = favorites.includes(coin.id);
                
                // Preparar datos para el gráfico
                const chartData = coin.sparkline_in_7d?.price?.map((price, index) => ({
                  value: price,
                  index
                })) || [];

                return (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 
                      dark:hover:bg-dark-card/50 transition-colors"
                  >
                    <td className="p-4">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        {coin.market_cap_rank}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {coin.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(coin.current_price)}
                      </p>
                    </td>

                    <td className="p-4 text-right">
                      <div className={`flex items-center justify-end space-x-1 font-semibold ${
                        isPositive
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>
                          {isPositive ? '+' : ''}
                          {coin.price_change_percentage_24h?.toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-right hidden md:table-cell">
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {formatMarketCap(coin.market_cap)}
                      </p>
                    </td>

                    <td className="p-4 hidden lg:table-cell">
                      <div className="w-32 h-12 mx-auto">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="value"
                              stroke={isPositive ? '#10b981' : '#ef4444'}
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleFavorite(coin.id)}
                        className={`p-2 rounded-lg transition-all hover:scale-110 ${
                          isFavorite
                            ? 'text-yellow-500 hover:text-yellow-600'
                            : 'text-gray-300 dark:text-gray-600 hover:text-yellow-500'
                        }`}
                      >
                        <Star
                          className="w-5 h-5"
                          fill={isFavorite ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCoins.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron criptomonedas
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchList;