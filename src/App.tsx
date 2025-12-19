import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { TransactionPage } from './pages/TransactionPage';
import { ReportPage } from './pages/ReportPage';
import { ShoppingCart, BarChart3, Settings } from 'lucide-react';

function Navigation() {
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SettingsPage() {
  return (
    <div className="min-h-screen py-6" style={{ backgroundColor: '#F9F7F5' }}>
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-slate-800 mb-6">⚙️ Pengaturan</h1>

        <div className="card space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h2 className="font-bold text-lg text-slate-800">Kelola Produk</h2>
            <p className="text-slate-500">Tambah, edit, atau hapus menu makanan</p>
            <button className="btn-secondary mt-3">Buka</button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h2 className="font-bold text-lg text-slate-800">Kelola Vendor</h2>
            <p className="text-slate-500">Atur daftar vendor titip jual</p>
            <button className="btn-secondary mt-3">Buka</button>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h2 className="font-bold text-lg text-slate-800">Kelola Kategori</h2>
            <p className="text-slate-500">Atur kategori menu (Makanan, Minuman, dll)</p>
            <button className="btn-secondary mt-3">Buka</button>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h2 className="font-bold text-lg text-amber-800">🔗 Hubungkan Supabase</h2>
            <p className="text-amber-700">Saat ini menggunakan data demo. Hubungkan ke database untuk data nyata.</p>
            <div className="mt-3 space-y-2">
              <input
                type="text"
                placeholder="Supabase URL"
                className="w-full p-3 border border-amber-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Supabase Anon Key"
                className="w-full p-3 border border-amber-300 rounded-lg"
              />
              <button className="btn-secondary bg-amber-100 border-amber-300">
                Simpan Koneksi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="pb-20 md:pb-0 md:pt-16">
        <Navigation />
        <Routes>
          <Route path="/" element={<TransactionPage />} />
          <Route path="/laporan" element={<ReportPage />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
