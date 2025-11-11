import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users } from 'lucide-react';
import { coinGeckoAPI } from '../Services/coinGeckoAPI';

const MarketOverview = () => {
  const [globalData, setGlobalData] = useState(null);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [global, trendingData] = await Promise.all([
          coinGeckoAPI.getGlobalData(),
          coinGeckoAPI.getTrending()
        ]);
        
        setGlobalData(global.data);
        setTrending(trendingData.coins.slice(0, 5));
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num?.toFixed(2)}`;
  };

  const formatPercent = (num) => {
    return num?.toFixed(2);
  };

  if (loading) {
    return (
      <div className="animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="skeleton h-4 w-24 mb-2 rounded"></div>
              <div className="skeleton h-8 w-32 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const marketStats = [
    {
      icon: DollarSign,
      label: 'Market Cap Total',
      value: formatNumber(globalData?.total_market_cap?.usd),
      change: formatPercent(globalData?.market_cap_change_percentage_24h_usd),
      isPositive: globalData?.market_cap_change_percentage_24h_usd > 0,
      color: 'blue'
    },
    {
      icon: Activity,
      label: 'Volumen 24h',
      value: formatNumber(globalData?.total_volume?.usd),
      change: null,
      color: 'indigo'
    },
    {
      icon: TrendingUp,
      label: 'BTC Dominance',
      value: `${globalData?.market_cap_percentage?.btc?.toFixed(1)}%`,
      change: null,
      color: 'orange'
    },
    {
      icon: Users,
      label: 'Criptomonedas',
      value: globalData?.active_cryptocurrencies?.toLocaleString(),
      change: null,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Resumen del Mercado
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Datos globales en tiempo real
          </p>
        </div>
        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">En vivo</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card card-hover p-6 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </p>
                  {stat.change !== null && (
                    <div className={`flex items-center space-x-1 text-sm font-medium ${
                      stat.isPositive 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {stat.isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 
                  group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trending Coins */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">🔥</span>
            Trending
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Top 5 más buscadas
          </span>
        </div>
        
        <div className="space-y-3">
          {trending.map((coin, index) => (
            <div
              key={coin.item.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 
                dark:hover:bg-dark-card transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 w-6">
                  #{index + 1}
                </span>
                <img 
                  src={coin.item.small} 
                  alt={coin.item.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {coin.item.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                    {coin.item.symbol}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    #{coin.item.market_cap_rank}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Rank
                  </p>
                </div>
                <TrendingUp className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;