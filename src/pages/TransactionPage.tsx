import { useState, useCallback, useEffect } from 'react';
import { DesktopLayout } from '../components/transaction/DesktopLayout';
import { TabletLayout } from '../components/transaction/TabletLayout';
import { MobileLayout } from '../components/transaction/MobileLayout';
import { PaymentModal } from '../components/cashier/PaymentModal';
import { createOrder, getProducts, getCategories } from '../services/data';
import type { Product, CartItem, Category } from '../types';

interface TransactionPageProps {
  isCartSheetOpen?: boolean;
  onCartSheetOpenChange?: (open: boolean) => void;
}

export function TransactionPage({ isCartSheetOpen = false, onCartSheetOpenChange = () => {} }: TransactionPageProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products and categories from IndexedDB
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMsg);
      console.error('❌ Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          image_url: product.image_url,
          product_type: product.product_type,
          vendor_id: product.vendor_id,
          vendor_name: product.vendor_name,
          category_id: product.category_id,
          category_name: product.category_name,
          quantity: 1,
        },
      ];
    });
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty <= 0 ? null : { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Handle checkout
  const handleCheckout = () => {
    if (cart.length > 0) {
      setIsPaymentOpen(true);
    }
  };

  // Handle payment confirmation
  const handlePaymentConfirm = async (cashReceived: number) => {
    try {
      const change = cashReceived - total;

      // Validate payment
      if (cashReceived < total) {
        setError('Jumlah uang tidak cukup');
        return;
      }

      // Save order to IndexedDB
      const order = await createOrder(total, cashReceived, change, cart);

      if (!order) {
        throw new Error('Gagal menyimpan pesanan');
      }

      // Show success message
      alert(
        `✅ Transaksi Berhasil!\n\n` +
        `Total: Rp ${total.toLocaleString('id-ID')}\n` +
        `Diterima: Rp ${cashReceived.toLocaleString('id-ID')}\n` +
        `Kembalian: Rp ${change.toLocaleString('id-ID')}\n\n` +
        `ID Pesanan: ${order.id}`
      );

      // Clear cart and close modal
      clearCart();
      setIsPaymentOpen(false);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memproses pembayaran';
      setError(errorMsg);
      console.error('❌ Payment error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F9F7F5' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🔄</div>
          <p className="text-lg font-semibold text-slate-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="fixed top-0 left-0 right-0 bg-red-100 border-b border-red-300 p-4 text-red-800 z-50">
          <p className="font-semibold">⚠️ Error: {error}</p>
        </div>
      )}

      {/* Desktop Layout - Visible on lg and above (1024px+) */}
      <div className="hidden lg:block h-full overflow-hidden">
        <DesktopLayout
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          total={total}
        />
      </div>

      {/* Tablet Layout - Visible on md to lg (768px - 1023px) */}
      <div className="hidden md:block lg:hidden h-full overflow-hidden">
        <TabletLayout
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          total={total}
        />
      </div>

      {/* Mobile Layout - Visible on max-md (below 768px) */}
      <div className="md:hidden h-full overflow-hidden flex flex-col">
        <MobileLayout
          products={products}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={addToCart}
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
          onCheckout={handleCheckout}
          total={total}
          isCartSheetOpen={isCartSheetOpen}
          onCartSheetOpenChange={onCartSheetOpenChange}
        />
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handlePaymentConfirm}
        total={total}
        items={cart}
      />
    </>
  );
}
