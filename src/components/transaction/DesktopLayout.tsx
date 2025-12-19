import { Trash2, Plus, Minus } from 'lucide-react';
import type { Product, CartItem } from '../../types';

interface DesktopLayoutProps {
  products: Product[];
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  total: number;
}

export function DesktopLayout({
  products,
  categories,
  selectedCategory,
  onCategoryChange,
  onAddToCart,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  total,
}: DesktopLayoutProps) {
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex h-full bg-page">
      {/* Left Sidebar - Categories (Fixed 240px) */}
      <aside className="w-60 border-r border-slate-200 bg-white shadow-lg flex flex-col p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-800 mb-6">📋 Kategori</h3>
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
              selectedCategory === null
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Produk
          </button>
        </div>

        <div className="space-y-2 flex-1 overflow-y-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-lg font-semibold transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content - Products Table */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h1 className="text-3xl font-bold text-slate-800">🍛 Menu Produk</h1>
          <p className="text-slate-500 text-lg mt-2">
            {filteredProducts.length} produk tersedia
          </p>
        </div>

        {/* Products Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-7xl mb-4">🍽️</span>
              <span className="text-2xl font-semibold">Tidak ada produk</span>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left px-6 py-4 font-bold text-slate-800 text-lg">
                      Produk
                    </th>
                    <th className="text-center px-6 py-4 font-bold text-slate-800 text-lg">
                      Harga
                    </th>
                    <th className="text-center px-6 py-4 font-bold text-slate-800 text-lg">
                      Kategori
                    </th>
                    <th className="text-center px-6 py-4 font-bold text-slate-800 text-lg">
                      Tipe
                    </th>
                    <th className="text-center px-6 py-4 font-bold text-slate-800 text-lg">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`border-b border-slate-200 transition-colors hover:bg-orange-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl">{product.emoji || '🍽️'}</span>
                          <div>
                            <p className="font-bold text-slate-800 text-lg">
                              {product.name}
                            </p>
                            {product.vendor_name && (
                              <p className="text-sm text-slate-500">
                                dari {product.vendor_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center px-6 py-4">
                        <p className="font-bold text-slate-800 text-lg">
                          Rp {product.price.toLocaleString('id-ID')}
                        </p>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span className="text-slate-600 text-lg">
                          {product.category_name}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                            product.product_type === 'OWN_PRODUCTION'
                              ? 'bg-green-100 text-green-800'
                              : product.product_type === 'RESELL'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {product.product_type === 'OWN_PRODUCTION'
                            ? 'Produksi'
                            : product.product_type === 'RESELL'
                            ? 'Kulakan'
                            : 'Titipan'}
                        </span>
                      </td>
                      <td className="text-center px-6 py-4">
                        <button
                          onClick={() => onAddToCart(product)}
                          className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white font-bold text-lg px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors min-w-fit"
                        >
                          ➕ Tambah
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Cart Panel */}
      <aside className="w-96 border-l border-slate-200 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">🛒 Pesanan</h2>
            <p className="text-slate-500 text-lg">{itemCount} item</p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold px-4 py-3 rounded-lg hover:bg-red-50 transition-colors text-lg"
            >
              <Trash2 size={24} />
              Hapus
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-6xl mb-4">🛒</span>
              <span className="text-xl">Keranjang kosong</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 space-y-3"
                style={{ backgroundColor: '#FFF8F1' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-4xl flex-shrink-0">
                    {item.emoji || '🍽️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 truncate text-lg">
                      {item.name}
                    </p>
                    <p className="text-slate-500 text-lg">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-2 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-12 h-12 rounded-full border-2 border-red-300 bg-white flex items-center justify-center text-red-600 font-bold hover:bg-red-50"
                    >
                      <Minus size={24} />
                    </button>
                    <span className="w-8 text-center font-bold text-2xl">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-12 h-12 rounded-full border-2 border-green-300 bg-white flex items-center justify-center text-green-600 font-bold hover:bg-green-50"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800 text-lg">
                      Rp{' '}
                      {(item.price * item.quantity).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Total & Checkout */}
        <div className="border-t border-slate-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-slate-600">Total</span>
            <span className="text-3xl font-bold text-slate-800">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={`w-full btn-primary text-2xl py-4 ${
              cart.length === 0
                ? 'opacity-50 cursor-not-allowed bg-slate-400'
                : ''
            }`}
          >
            💵 BAYAR
          </button>
        </div>
      </aside>
    </div>
  );
}
