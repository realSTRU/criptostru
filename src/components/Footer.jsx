import { Heart, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-dark-border">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold gradient-text">CryptoTracker</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tu plataforma de seguimiento de criptomonedas en tiempo real. 
              Datos confiables powered by CoinGecko API.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Mercado
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Watchlist
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
              Síguenos
            </h4>
            <div className="flex space-x-3">
              <a
                href="https://github.com/realSTRU"
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-blue-600 hover:text-white transition-all"
                aria-label="Github"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/cesar-reynoso-492254205/"
                className="p-2 rounded-lg bg-gray-100 dark:bg-dark-card hover:bg-blue-600 hover:text-white transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              
 
            
              
            </div>
          </div>
        </div>
         {/* Logo personal */}
            <div className="pt-3 flex justify-center">
              <img
                src="public\Stru.png"
                alt="Stru Logo"
                className="h-20 w-20 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
                

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* realSTRU dev signature */}
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>Hecho con</span>
              <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
              <span>por</span>
              <span className="font-semibold gradient-text">realSTRU dev</span>
            </div>

            {/* CoinGecko Attribution */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Powered by
              </span>
              <a
                href="https://www.coingecko.com/en/api?utm_source=cryptotracker-realstru&utm_medium=referral"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src="https://static.coingecko.com/s/coingecko-logo-8903d34ce19ca4be1c81f0db30e924154750d208683fad7ae6f2ce06c76d0a56.png"
                  alt="CoinGecko"
                  className="h-6"
                />
              </a>
            </div>
            
            {/* Copyright */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} CryptoTracker
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;