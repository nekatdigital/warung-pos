import { useState, useRef } from 'react';
import { Trash2, Plus, Minus, X, ChevronRight } from 'lucide-react';
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
  isCartSheetOpen?: boolean;
  onCartSheetOpenChange?: (open: boolean) => void;
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
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const cartPanelRef = useRef<HTMLDivElement>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Category emoji mapping
  const getCategoryEmoji = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      '1': '🍲',
      '2': '🥤',
      '3': '🍘',
    };
    return categoryMap[categoryId] || '📦';
  };

  // Handle touch swipe for cart
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    // Swipe left to show cart
    if (diff > 50) {
      setShowCartPanel(true);
    }
    // Swipe right to hide cart
    if (diff < -50) {
      setShowCartPanel(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page">
      {/* Compact Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm p-3 space-y-2 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-xl font-bold text-slate-800">🍛 Warung</h1>
          </div>
          {/* Cart Badge Button - Always visible */}
          <button
            onClick={() => setShowCartPanel(!showCartPanel)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 font-bold hover:bg-orange-200 transition-colors"
          >
            <span>🛒</span>
            <span>{itemCount}</span>
            <ChevronRight size={18} className={`transition-transform ${showCartPanel ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-3 px-3">
          <button
            onClick={() => onCategoryChange(null)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full font-semibold text-xs transition-colors flex-shrink-0 ${
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
              className={`whitespace-nowrap px-3 py-1.5 rounded-full font-semibold text-xs transition-colors flex-shrink-0 ${
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

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Products Panel */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            showCartPanel ? 'w-0 overflow-hidden' : 'w-full'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Products List */}
          <main className="flex-1 overflow-y-auto p-3 space-y-2 pb-20">
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
                  className="w-full bg-white rounded-lg p-3 shadow-sm hover:shadow-md active:scale-95 transition-all flex gap-3 text-left border border-transparent hover:border-orange-200"
                >
                  {/* Product Emoji */}
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center text-3xl flex-shrink-0">
                    {product.emoji || '🍽️'}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-orange-600 font-bold text-sm mt-1">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                    {product.product_type === 'CONSIGNMENT' && product.vendor_name && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {product.vendor_name}
                      </p>
                    )}
                  </div>

                  {/* Add Button */}
                  <div className="flex-shrink-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                      +
                    </div>
                  </div>
                </button>
              ))
            )}
          </main>
        </div>

        {/* Cart Panel - Slide from right */}
        <div
          ref={cartPanelRef}
          className={`absolute right-0 top-0 bottom-0 w-full md:w-96 bg-white border-l border-slate-200 shadow-2xl flex flex-col transition-all duration-300 z-40 ${
            showCartPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Cart Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <h2 className="text-2xl font-bold text-slate-800">🛒 Pesanan</h2>
            <button
              onClick={() => setShowCartPanel(false)}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close cart"
            >
              <X size={24} />
            </button>
          </div>

          {/* Cart Content */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-20 px-4">
              <span className="text-6xl mb-4">🛒</span>
              <span className="text-lg font-semibold text-center">Keranjang kosong</span>
              <span className="text-sm mt-2 text-center">Tap menu untuk menambah pesanan</span>
            </div>
          ) : (
            <>
              {/* Cart Items - Scrollable */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg border border-slate-200 space-y-2 bg-gradient-to-br from-slate-50 to-white hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3 justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <span className="text-3xl flex-shrink-0">
                          {item.emoji || '🍽️'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-800 text-sm">
                            {item.name}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            Rp {item.price.toLocaleString('id-ID')}/item
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-8 h-8 rounded-full border-2 border-red-300 bg-white flex items-center justify-center text-red-600 font-bold hover:bg-red-50 transition-colors text-sm"
                          aria-label={`Decrease ${item.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-bold text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-8 h-8 rounded-full border-2 border-green-300 bg-white flex items-center justify-center text-green-600 font-bold hover:bg-green-50 transition-colors text-sm"
                          aria-label={`Increase ${item.name}`}
                        >
                          <Plus size={14} />
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
                ))}
              </div>

              {/* Cart Footer - Sticky */}
              <div className="flex-shrink-0 border-t border-slate-200 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">Total</span>
                  <span className="text-2xl font-bold text-orange-600">
                    Rp {total.toLocaleString('id-ID')}
                  </span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full btn-primary text-base py-3 font-bold rounded-lg"
                >
                  💵 BAYAR SEKARANG
                </button>

                {cart.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="w-full flex items-center justify-center gap-2 text-red-500 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm"
                  >
                    <Trash2 size={16} />
                    Hapus Semua
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Overlay when cart is open */}
        {showCartPanel && (
          <div
            className="absolute inset-0 bg-black/30 z-30"
            onClick={() => setShowCartPanel(false)}
          />
        )}
      </div>
    </div>
  );
}
