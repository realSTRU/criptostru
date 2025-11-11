import { useState, useEffect } from 'react';
import { Wallet, TrendingUp, TrendingDown, PlusCircle, Eye, EyeOff } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { coinGeckoAPI } from '../Services/coinGeckoAPI';

const Portfolio = () => {
  // Portfolio holdings - puedes modificar estos valores o agregar funcionalidad para editarlos
  const [holdings] = useState([
    { id: 'bitcoin', symbol: 'BTC', amount: 0.5, name: 'Bitcoin' },
    { id: 'ethereum', symbol: 'ETH', amount: 3.2, name: 'Ethereum' },
    { id: 'cardano', symbol: 'ADA', amount: 1500, name: 'Cardano' },
  ]);
  
  const [prices, setPrices] = useState({});
  const [charts, setCharts] = useState({});
  const [loading, setLoading] = useState(true);
  const [hideBalance, setHideBalance] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const coinIds = holdings.map(h => h.id);
        
        // Obtener precios
        const priceData = await coinGeckoAPI.getSimplePrices(coinIds);
        setPrices(priceData);

        // Obtener datos de gráficos para cada coin
        const chartPromises = coinIds.map(id => 
          coinGeckoAPI.getMarketChart(id, 7)
        );
        const chartData = await Promise.all(chartPromises);
        
        const chartsObj = {};
        coinIds.forEach((id, index) => {
          chartsObj[id] = chartData[index].prices.map(([timestamp, price]) => ({
            time: timestamp,
            value: price
          }));
        });
        setCharts(chartsObj);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    // Actualizar cada 60 segundos
    const interval = setInterval(fetchPortfolioData, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateTotalBalance = () => {
    return holdings.reduce((total, holding) => {
      const price = prices[holding.id]?.usd || 0;
      return total + (holding.amount * price);
    }, 0);
  };

  const calculateTotalChange = () => {
    let totalValue = 0;
    let totalChange = 0;
    
    holdings.forEach(holding => {
      const price = prices[holding.id]?.usd || 0;
      const change = prices[holding.id]?.usd_24h_change || 0;
      const value = holding.amount * price;
      totalValue += value;
      totalChange += (value * change) / 100;
    });

    return {
      amount: totalChange,
      percentage: totalValue > 0 ? (totalChange / totalValue) * 100 : 0
    };
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const totalBalance = calculateTotalBalance();
  const totalChange = calculateTotalChange();
  const isPositive = totalChange.percentage >= 0;

  if (loading) {
    return (
      <div className="card p-6">
        <div className="skeleton h-32 w-full rounded-xl mb-4"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mi Portfolio
        </h2>
        <button className="btn-primary flex items-center space-x-2">
          <PlusCircle className="w-5 h-5" />
          <span>Agregar Crypto</span>
        </button>
      </div>

      {/* Balance Card */}
      <div className="card p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="w-5 h-5" />
              <p className="text-sm opacity-90">Balance Total</p>
            </div>
            <div className="flex items-center space-x-3">
              <h3 className="text-4xl font-bold">
                {hideBalance ? '••••••' : formatCurrency(totalBalance)}
              </h3>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {hideBalance ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm opacity-90 mb-1">Cambio 24h</p>
            <div className={`flex items-center space-x-1 text-lg font-semibold ${
              isPositive ? 'text-green-300' : 'text-red-300'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-5 h-5" />
              ) : (
                <TrendingDown className="w-5 h-5" />
              )}
              <span>{isPositive ? '+' : ''}{totalChange.percentage.toFixed(2)}%</span>
            </div>
            <p className="text-sm opacity-75 mt-1">
              {isPositive ? '+' : ''}{formatCurrency(totalChange.amount)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/20">
          <div>
            <p className="text-xs opacity-75 mb-1">Activos</p>
            <p className="text-lg font-semibold">{holdings.length}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-75 mb-1">Mayor ganancia</p>
            <p className="text-lg font-semibold">BTC</p>
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Mis Activos
        </h3>
        
        <div className="space-y-3">
          {holdings.map((holding) => {
            const priceData = prices[holding.id] || {};
            const currentPrice = priceData.usd || 0;
            const change24h = priceData.usd_24h_change || 0;
            const holdingValue = holding.amount * currentPrice;
            const isPositive = change24h >= 0;
            const chartData = charts[holding.id] || [];

            return (
              <div
                key={holding.id}
                className="p-4 rounded-xl border border-gray-200 dark:border-dark-border 
                  hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 
                      flex items-center justify-center text-white font-bold text-lg">
                      {holding.symbol.slice(0, 1)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {holding.name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                          {holding.symbol}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {holding.amount} {holding.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Mini Chart */}
                  <div className="hidden lg:block w-24 h-12 mx-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData.slice(-20)}>
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

                  {/* Value and Change */}
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(holdingValue)}
                    </p>
                    <div className={`flex items-center justify-end space-x-1 text-sm font-medium ${
                      isPositive 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{isPositive ? '+' : ''}{change24h.toFixed(2)}%</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatCurrency(currentPrice)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;