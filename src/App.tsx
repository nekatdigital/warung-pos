import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { TransactionPage } from './pages/TransactionPage';
import { ReportPage } from './pages/ReportPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ShoppingCart, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { authService } from './services/storage';

// Import POS styles
import './components/pos/pos.css';

function Navigation({ itemCount, onCartClick, onLogout }: { itemCount: number; onCartClick: () => void; onLogout: () => void }) {
  const user = authService.getUser();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-3xl">🍛</span>
            <div>
              <h1 className="font-bold text-slate-800 text-lg">Warung POS</h1>
              <p className="text-xs text-slate-500">Sistem Kasir Warung Makan</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 flex justify-center md:justify-end">
            <div className="flex gap-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <ShoppingCart size={24} />
                <span className="text-sm md:text-base">Kasir</span>
              </NavLink>

              <NavLink
                to="/laporan"
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <BarChart3 size={24} />
                <span className="text-sm md:text-base">Laporan</span>
              </NavLink>

              <NavLink
                to="/pengaturan"
                className={({ isActive }) =>
                  `flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl font-semibold transition-colors ${isActive
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <Settings size={24} />
                <span className="text-sm md:text-base">Pengaturan</span>
              </NavLink>

              {user && (
                <>
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-600 border-l border-slate-200 ml-2">
                    <User size={20} />
                    <span className="text-sm font-semibold">{user.username}</span>
                  </div>

                  <button
                    onClick={onLogout}
                    className="flex flex-col md:flex-row items-center gap-1 md:gap-2 px-4 py-2 rounded-xl font-semibold transition-colors text-slate-600 hover:bg-red-50 hover:text-red-600"
                    title="Logout"
                  >
                    <LogOut size={24} />
                    <span className="text-sm md:text-base hidden md:inline">Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function LoginPage({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [username, setUsername] = useState('kasir');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const user = authService.login(username, password);
      if (user) {
        onLoginSuccess();
      } else {
        setError('Username atau password salah');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9F7F5' }}>
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🍛</span>
          <h1 className="text-3xl font-bold text-slate-800">Warung POS</h1>
          <p className="text-slate-500 mt-2">Sistem Kasir Warung Makan</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-slate-500 mt-1">Demo: kasir</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-xs text-slate-500 mt-1">Demo: 1234</p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          💡 Gunakan demo credentials untuk testing
        </p>
      </div>
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="min-h-screen py-6 bg-page">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">⚙️ Pengaturan</h1>

        <div className="card space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h2 className="font-bold text-lg text-slate-800">📊 PWA Status</h2>
            <p className="text-slate-500">Progressive Web App Status</p>
            <div className="mt-3 space-y-2 text-sm">
              <p>
                ✅ <strong>Offline Mode:</strong> Enabled - Aplikasi dapat digunakan tanpa internet
              </p>
              <p>
                ✅ <strong>Local Database:</strong> IndexedDB - Data tersimpan secara lokal
              </p>
              <p>
                ✅ <strong>Service Worker:</strong> Registered - Automatic offline caching
              </p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <h2 className="font-bold text-lg text-blue-800">💾 Data Management</h2>
            <p className="text-blue-700 text-sm mb-3">Kelola data lokal Anda</p>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors">
                📥 Export Data
              </button>
              <button className="w-full px-4 py-2 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors">
                📤 Import Data
              </button>
              <button className="w-full px-4 py-2 bg-red-100 text-red-800 font-semibold rounded-lg hover:bg-red-200 transition-colors">
                🗑️ Clear All Data
              </button>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <h2 className="font-bold text-lg text-green-800">✨ Info Sistem</h2>
            <div className="mt-3 space-y-2 text-sm text-green-800">
              <p>
                <strong>Version:</strong> 1.0.0 PWA
              </p>
              <p>
                <strong>Database:</strong> IndexedDB + localStorage
              </p>
              <p>
                <strong>Architecture:</strong> Offline-First PWA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      setIsAuthenticated(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F9F7F5' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🍛</div>
          <p className="text-lg font-semibold text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Navigation
          itemCount={0}
          onCartClick={() => setIsCartSheetOpen(true)}
          onLogout={handleLogout}
        />
        {/* Container utama dengan padding agar tidak tertutup Navbar */}
        <div className="md:pb-0 md:pt-16 min-h-screen">
          <Routes>
            {/* Route '/' menggunakan TransactionPage yang baru (Adaptive Layout) */}
            <Route path="/" element={<TransactionPage isCartSheetOpen={isCartSheetOpen} onCartSheetOpenChange={setIsCartSheetOpen} />} />
            <Route path="/laporan" element={<ReportPage />} />
            <Route path="/pengaturan" element={<SettingsPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
