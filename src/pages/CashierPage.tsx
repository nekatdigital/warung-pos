import { useState, useCallback, useEffect } from 'react';
import { MenuGrid } from '../components/cashier/MenuGrid';
import { CartPanel } from '../components/cashier/CartPanel';
import { PaymentModal } from '../components/cashier/PaymentModal';
import { createOrder, getProducts, getCategories } from '../services/data';
import type { Product, CartItem, Category } from '../types';

export function CashierPage() {
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
            setError('An error occurred while loading data.');
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
            const order = await createOrder(cashReceived, cart);

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
            setError('An error occurred during payment processing.');
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
        <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F9F7F5' }}>
            {/* Left side - Menu Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {error && (
                    <div className="bg-red-100 border-b border-red-300 p-4 text-red-800">
                        <p className="font-semibold">⚠️ Error: {error}</p>
                    </div>
                )}
                <MenuGrid
                    products={products}
                    onAddToCart={addToCart}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={categories}
                />
            </div>

            {/* Right side - Cart Panel */}
            <div className="w-96 flex-shrink-0 border-l border-slate-200 shadow-lg">
                <CartPanel
                    items={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemoveItem={removeItem}
                    onClearCart={clearCart}
                    onCheckout={handleCheckout}
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
        </div>
    );
}
