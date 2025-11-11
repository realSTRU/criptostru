import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import Header from './components/Header';
import MarketOverview from './components/MarketOverview';
import WatchList from './components/WatchList';
import Footer from './components/Footer';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const [globalSearch, setGlobalSearch] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen">
      {/* Toggle Dark Mode - Botón flotante */}
      <button
        onClick={toggleDarkMode}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass-effect shadow-lg hover:scale-110 transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-yellow-400" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600" />
        )}
      </button>

      {/* Header */}
      <Header onSearch={setGlobalSearch} />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Market Overview */}
          <MarketOverview />

          {/* Watch List */}
          <WatchList searchFromHeader={globalSearch} />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;