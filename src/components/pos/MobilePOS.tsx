import { useState } from 'react';
import type { Product, CartItem } from '../../types';
import { PaymentSheet } from './PaymentSheet';

interface MobilePOSProps {
    products: Product[];
    tableNumber?: string;
}

export function MobilePOS({ products, tableNumber = "Meja 1" }: MobilePOSProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Get quantity of item in cart
    const getQuantity = (productId: string): number => {
        const item = cart.find(i => i.id === productId);
        return item?.quantity || 0;
    };

    // Add item to cart
    const addItem = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, {
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
            }];
        });
    };

    // Update quantity
    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            return prev
                .map(item => {
                    if (item.id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty <= 0 ? null : { ...item, quantity: newQty };
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[];
        });
    };

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Handle payment success
    const handlePaymentSuccess = () => {
        setCart([]);
        setIsPaymentOpen(false);
    };

    return (
        <div className="mobile-pos-container">
            {/* ========== TOP BAR (Sticky) ========== */}
            <header className="mobile-topbar">
                <div className="mobile-logo">
                    <span className="mobile-logo-icon">🍛</span>
                    <span className="mobile-logo-text">Warung POS</span>
                </div>
                <div className="mobile-table-badge">
                    {tableNumber}
                </div>
            </header>

            {/* ========== PRODUCT LIST ========== */}
            <main className="mobile-content">
                {products.map(product => {
                    const qty = getQuantity(product.id);
                    const isInCart = qty > 0;

                    return (
                        <div key={product.id} className="mobile-product-row">
                            {/* Product Image */}
                            <div className="mobile-product-image">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} />
                                ) : (
                                    <span className="mobile-product-emoji">{product.emoji || '🍽️'}</span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="mobile-product-info">
                                <span className="mobile-product-name">{product.name}</span>
                                <span className="mobile-product-price">
                                    Rp {product.price.toLocaleString('id-ID')}
                                </span>
                            </div>

                            {/* Add Button OR Quantity Control */}
                            <div className="mobile-product-action">
                                {!isInCart ? (
                                    <button
                                        onClick={() => addItem(product)}
                                        className="mobile-add-btn"
                                        aria-label={`Tambah ${product.name}`}
                                    >
                                        TAMBAH
                                    </button>
                                ) : (
                                    <div className="mobile-qty-control">
                                        <button
                                            onClick={() => updateQuantity(product.id, -1)}
                                            className="mobile-qty-btn mobile-qty-minus"
                                            aria-label="Kurangi"
                                        >
                                            −
                                        </button>
                                        <span className="mobile-qty-value">{qty}</span>
                                        <button
                                            onClick={() => updateQuantity(product.id, 1)}
                                            className="mobile-qty-btn mobile-qty-plus"
                                            aria-label="Tambah"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </main>

            {/* ========== BOTTOM BAR (Sticky, 15% height) ========== */}
            <footer className="mobile-bottombar">
                <div className="mobile-total">
                    <span className="mobile-total-label">Total</span>
                    <span className="mobile-total-amount">
                        Rp {total.toLocaleString('id-ID')}
                    </span>
                </div>
                <button
                    onClick={() => setIsPaymentOpen(true)}
                    disabled={cart.length === 0}
                    className="mobile-pay-btn"
                    aria-label="Bayar sekarang"
                >
                    BAYAR SEKARANG
                </button>
            </footer>

            {/* ========== PAYMENT SHEET ========== */}
            <PaymentSheet
                isOpen={isPaymentOpen}
                total={total}
                items={cart}
                onClose={() => setIsPaymentOpen(false)}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
}
