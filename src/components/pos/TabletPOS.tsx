import { useState } from 'react';
import type { Product, CartItem, Category } from '../../types';
import { PaymentSheet } from './PaymentSheet';

interface TabletPOSProps {
    products: Product[];
    categories: Category[];
    tableNumber?: string;
}

export function TabletPOS({ products, categories, tableNumber = "Meja 1" }: TabletPOSProps) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    // Filter products by category
    const filteredProducts = selectedCategory
        ? products.filter(p => p.category_id === selectedCategory)
        : products;

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

    // Remove item
    const removeItem = (productId: string) => {
        setCart(prev => prev.filter(i => i.id !== productId));
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Handle payment success
    const handlePaymentSuccess = () => {
        setCart([]);
        setIsPaymentOpen(false);
    };

    return (
        <div className="tablet-pos-container">
            {/* ========== HEADER ========== */}
            <header className="tablet-header">
                <div className="tablet-logo">
                    <span className="tablet-logo-icon">🍛</span>
                    <span className="tablet-logo-text">Warung POS</span>
                </div>
                <div className="tablet-table-badge">
                    {tableNumber}
                </div>
            </header>

            {/* ========== MAIN GRID: 12 COLUMNS ========== */}
            <div className="tablet-main-grid">
                {/* ===== LEFT: MENU (8 columns) ===== */}
                <section className="tablet-menu-section">
                    {/* Category Tabs */}
                    <div className="tablet-category-tabs">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`tablet-category-tab ${selectedCategory === null ? 'active' : ''}`}
                        >
                            SEMUA
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`tablet-category-tab ${selectedCategory === cat.id ? 'active' : ''}`}
                            >
                                {cat.name.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    <div className="tablet-product-grid">
                        {filteredProducts.map(product => {
                            const qty = getQuantity(product.id);
                            const isInCart = qty > 0;

                            return (
                                <button
                                    key={product.id}
                                    onClick={() => addItem(product)}
                                    className={`tablet-product-card ${isInCart ? 'in-cart' : ''}`}
                                    aria-label={`Tambah ${product.name}`}
                                >
                                    {/* Quantity Badge */}
                                    {isInCart && (
                                        <div className="tablet-product-qty-badge">
                                            {qty}
                                        </div>
                                    )}

                                    {/* Product Image */}
                                    <div className="tablet-product-image">
                                        {product.image_url ? (
                                            <img src={product.image_url} alt={product.name} />
                                        ) : (
                                            <span className="tablet-product-emoji">{product.emoji || '🍽️'}</span>
                                        )}
                                    </div>

                                    {/* Product Name */}
                                    <span className="tablet-product-name">{product.name}</span>

                                    {/* Product Price */}
                                    <span className="tablet-product-price">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ===== RIGHT: BILL/STRUK (4 columns) ===== */}
                <aside className="tablet-bill-section">
                    <div className="tablet-bill-paper">
                        {/* Bill Header */}
                        <div className="tablet-bill-header">
                            <h2 className="tablet-bill-title">STRUK PESANAN</h2>
                            <span className="tablet-bill-count">{itemCount} item</span>
                        </div>

                        {/* Bill Items */}
                        <div className="tablet-bill-items">
                            {cart.length === 0 ? (
                                <div className="tablet-bill-empty">
                                    <span className="tablet-bill-empty-icon">🛒</span>
                                    <span className="tablet-bill-empty-text">Belum ada pesanan</span>
                                    <span className="tablet-bill-empty-hint">Pilih menu di sebelah kiri</span>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="tablet-bill-item">
                                        <div className="tablet-bill-item-info">
                                            <span className="tablet-bill-item-name">{item.name}</span>
                                            <span className="tablet-bill-item-price">
                                                Rp {item.price.toLocaleString('id-ID')} × {item.quantity}
                                            </span>
                                        </div>
                                        <div className="tablet-bill-item-actions">
                                            <span className="tablet-bill-item-subtotal">
                                                Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                            </span>
                                            <div className="tablet-bill-item-controls">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="tablet-qty-btn"
                                                    aria-label="Kurangi"
                                                >
                                                    −
                                                </button>
                                                <span className="tablet-qty-display">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="tablet-qty-btn"
                                                    aria-label="Tambah"
                                                >
                                                    +
                                                </button>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="tablet-remove-btn"
                                                    aria-label="Hapus item"
                                                >
                                                    HAPUS
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Bill Footer - Always Visible */}
                        <div className="tablet-bill-footer">
                            {cart.length > 0 && (
                                <button
                                    onClick={clearCart}
                                    className="tablet-reset-btn"
                                >
                                    BATALKAN SEMUA
                                </button>
                            )}

                            <div className="tablet-bill-total">
                                <span className="tablet-bill-total-label">TOTAL</span>
                                <span className="tablet-bill-total-amount">
                                    Rp {total.toLocaleString('id-ID')}
                                </span>
                            </div>

                            <button
                                onClick={() => setIsPaymentOpen(true)}
                                disabled={cart.length === 0}
                                className="tablet-pay-btn"
                                aria-label="Bayar"
                            >
                                BAYAR
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

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
