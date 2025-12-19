import { useState, useCallback } from 'react';
import { DesktopLayout } from '../components/transaction/DesktopLayout';
import { TabletLayout } from '../components/transaction/TabletLayout';
import { MobileLayout } from '../components/transaction/MobileLayout';
import { PaymentModal } from '../components/cashier/PaymentModal';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../services/supabase';
import type { Product, CartItem } from '../types';

export function TransactionPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  // For demo, use static data. In production, fetch from Supabase
  const products = DEMO_PRODUCTS;
  const categories = DEMO_CATEGORIES;

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
  const handlePaymentConfirm = (cashReceived: number) => {
    const change = cashReceived - total;

    // In production, save order to Supabase here
    console.log('Order completed:', {
      items: cart,
      total,
      cashReceived,
      change,
      timestamp: new Date().toISOString(),
    });

    // Show success message
    alert(
      `✅ Transaksi Berhasil!\n\n` +
      `Total: Rp ${total.toLocaleString('id-ID')}\n` +
      `Diterima: Rp ${cashReceived.toLocaleString('id-ID')}\n` +
      `Kembalian: Rp ${change.toLocaleString('id-ID')}`
    );

    // Clear cart and close modal
    clearCart();
    setIsPaymentOpen(false);
  };

  return (
    <>
      {/* Desktop Layout - Visible on lg and above (1024px+) */}
      <div className="hidden lg:block h-screen overflow-hidden">
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
      <div className="hidden md:block lg:hidden h-screen overflow-hidden">
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
      <div className="md:hidden h-screen overflow-hidden flex flex-col">
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
