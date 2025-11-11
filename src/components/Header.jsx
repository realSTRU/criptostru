import { useState } from 'react';
import { TrendingUp, Search, Bell, X } from 'lucide-react';

const Header = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    if (onSearch) {
      onSearch('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Scroll to WatchList section
    const watchListSection = document.getElementById('watchlist-section');
    if (watchListSection) {
      watchListSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header className="sticky top-0 z-40 glass-effect border-b border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-center gap-8">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-glow-sm">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">
                CryptoTracker
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                by realSTRU dev
              </p>
            </div>
          </div>

          {/* Search Bar */}
          
        <div className="hidden md:flex items-center flex-1 max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Buscar criptomoneda..."
                className="w-full pl-10 pr-10 py-2 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          {/* Actions */}
          
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSubmit} className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar..."
              className="w-full pl-10 pr-10 py-2 rounded-xl bg-gray-100 dark:bg-dark-card border border-gray-200 dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;