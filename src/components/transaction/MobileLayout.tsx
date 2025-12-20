import { useState } from 'react';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import type { Product, CartItem } from '../../types';

interface MobileLayoutProps {
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

export function MobileLayout({
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
}: MobileLayoutProps) {
  const [isCartSheetOpen, setIsCartSheetOpen] = useState(false);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Category emoji mapping for mobile icons
  const getCategoryEmoji = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      '1': '🍲',
      '2': '🥤',
      '3': '🍘',
    };
    return categoryMap[categoryId] || '📦';
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 shadow-md p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">🍛 Warung</h1>
            <p className="text-xs text-slate-500">Sistem Pesanan</p>
          </div>
          <div className="text-right px-3 py-2 rounded-lg bg-page-zebra">
            <p className="text-xs text-slate-500">Total Pesanan</p>
            <p className="font-bold text-lg text-slate-800">{itemCount} item</p>
          </div>
        </div>

        {/* Category Tabs (Horizontal Scroll) */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          <button
            onClick={() => onCategoryChange(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-colors flex-shrink-0 ${
              selectedCategory === null
                ? 'bg-orange-100 text-orange-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            Semua
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-colors flex-shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {getCategoryEmoji(cat.id)} {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content - Products List */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-8">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
            <span className="text-5xl mb-3">🍽️</span>
            <span className="text-lg font-semibold">Tidak ada produk</span>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <button
              key={product.id}
              onClick={() => onAddToCart(product)}
              className="w-full bg-white rounded-xl p-4 shadow-md hover:shadow-lg active:scale-95 transition-all flex gap-4 text-left border-2 border-transparent hover:border-orange-200"
            >
              {/* Product Emoji */}
              <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center text-4xl flex-shrink-0 shadow-sm">
                {product.emoji || '🍽️'}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">
                  {product.name}
                </h3>
                <p className="text-orange-600 font-bold text-lg mt-1">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                {product.category_name && (
                  <p className="text-xs text-slate-500 mt-1">
                    {product.category_name}
                  </p>
                )}
                {product.product_type === 'CONSIGNMENT' && product.vendor_name && (
                  <span className="badge-consignment inline-block mt-2">
                    Dari {product.vendor_name}
                  </span>
                )}
              </div>

              {/* Add Button */}
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl shadow-md">
                  +
                </div>
              </div>
            </button>
          ))
        )}
      </main>

      {/* Cart Full Screen Modal */}
      {isCartSheetOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden md:hidden">
          {/* Modal Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white">
            <h2 className="text-3xl font-bold text-slate-800">🛒 Pesanan Anda</h2>
            <button
              onClick={() => setIsCartSheetOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close cart"
            >
              <X size={28} />
            </button>
          </div>

          {/* Modal Content - Scrollable */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-20">
              <span className="text-7xl mb-4">🛒</span>
              <span className="text-2xl font-semibold">Keranjang kosong</span>
              <span className="text-lg mt-3">Pilih menu di atas untuk menambah pesanan</span>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border-2 border-slate-200 space-y-3 bg-card-item"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-4xl flex-shrink-0">
                        {item.emoji || '🍽️'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-lg">
                          {item.name}
                        </p>
                        <p className="text-slate-500 text-base mt-1">
                          Rp {item.price.toLocaleString('id-ID')}
                        </p>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-2 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-10 h-10 rounded-full border-3 border-red-300 bg-white flex items-center justify-center text-red-600 font-bold hover:bg-red-50 transition-colors"
                          aria-label={`Decrease ${item.name} quantity`}
                        >
                          <Minus size={18} />
                        </button>
                        <span className="w-8 text-center font-bold text-base">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-10 h-10 rounded-full border-3 border-green-300 bg-white flex items-center justify-center text-green-600 font-bold hover:bg-green-50 transition-colors"
                          aria-label={`Increase ${item.name} quantity`}
                        >
                          <Plus size={18} />
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
                ))}
              </div>

              {/* Modal Footer */}
              <div className="flex-shrink-0 border-t border-slate-200 p-6 bg-white space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600 text-lg">Total Pesanan</span>
                  <span className="text-3xl font-bold text-slate-800">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full btn-primary text-lg py-4 font-bold"
                >
                  💵 BAYAR
                </button>

                {cart.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold px-4 py-3 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={20} />
                    Hapus Semua Pesanan
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
