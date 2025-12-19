import { Trash2, Plus, Minus } from 'lucide-react';
import type { Product, CartItem } from '../../types';

interface TabletLayoutProps {
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

export function TabletLayout({
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
}: TabletLayoutProps) {
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Category emoji mapping for icons only view
  const getCategoryEmoji = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      '1': '🍲',
      '2': '🥤',
      '3': '🍘',
    };
    return categoryMap[categoryId] || '📦';
  };

  return (
    <div className="flex h-full" style={{ backgroundColor: '#F9F7F5' }}>
      {/* Left Sidebar - Collapsed Categories (80px) */}
      <aside className="w-20 border-r border-slate-200 bg-white shadow-lg flex flex-col items-center py-4 space-y-2 overflow-y-auto">
        <button
          onClick={() => onCategoryChange(null)}
          title="Semua"
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-colors ${
            selectedCategory === null
              ? 'bg-orange-100 text-orange-700 shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📋
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            title={cat.name}
            className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl transition-colors ${
              selectedCategory === cat.id
                ? 'bg-orange-100 text-orange-700 shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {getCategoryEmoji(cat.id)}
          </button>
        ))}
      </aside>

      {/* Main Content - Products Grid */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <h1 className="text-2xl font-bold text-slate-800">🍛 Menu Cepat</h1>
          <p className="text-slate-500 text-sm mt-1">
            Klik untuk tambah ke pesanan
          </p>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-6xl mb-4">🍽️</span>
              <span className="text-xl font-semibold">Tidak ada produk</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 pb-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onAddToCart(product)}
                  className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 flex flex-col items-center text-center space-y-2"
                >
                  {/* Product Emoji */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center text-5xl shadow-md">
                    {product.emoji || '🍽️'}
                  </div>

                  {/* Product Name */}
                  <p className="font-bold text-slate-800 text-base line-clamp-2">
                    {product.name}
                  </p>

                  {/* Price */}
                  <p className="text-orange-600 font-bold text-lg">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>

                  {/* Product Type Badge */}
                  {product.product_type === 'CONSIGNMENT' && product.vendor_name && (
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#FCE8D0', color: '#92400e' }}
                    >
                      {product.vendor_name}
                    </span>
                  )}
                  {product.product_type === 'RESELL' && (
                    <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      Kulakan
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar - Cart Panel */}
      <aside className="w-96 border-l border-slate-200 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-800">🛒 Pesanan</h2>
            <p className="text-slate-500 text-sm">{itemCount} item</p>
          </div>
          {cart.length > 0 && (
            <button
              onClick={onClearCart}
              className="flex items-center gap-1 text-red-500 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={20} />
              Hapus
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="text-5xl mb-3">🛒</span>
              <span className="text-lg">Keranjang kosong</span>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-slate-200 space-y-2"
                style={{ backgroundColor: '#FFF8F1' }}
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl flex-shrink-0">
                    {item.emoji || '🍽️'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Rp {item.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full border-2 border-red-300 bg-white flex items-center justify-center text-red-600 font-bold hover:bg-red-50 text-sm"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center font-bold text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full border-2 border-green-300 bg-white flex items-center justify-center text-green-600 font-bold hover:bg-green-50 text-sm"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-slate-800 text-sm">
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
        <div className="border-t border-slate-200 p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-bold text-slate-600">Total</span>
            <span className="text-2xl font-bold text-slate-800">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>

          <button
            onClick={onCheckout}
            disabled={cart.length === 0}
            className={`w-full btn-primary text-xl py-3 ${
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
