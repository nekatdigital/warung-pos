import { Trash2, Plus, Minus } from 'lucide-react';
import type { CartItem } from '../../types';

interface CartPanelProps {
    items: CartItem[];
    onUpdateQuantity: (productId: string, delta: number) => void;
    onRemoveItem: (productId: string) => void;
    onClearCart: () => void;
    onCheckout: () => void;
}

export function CartPanel({
    items,
    onUpdateQuantity,
    onRemoveItem,
    onClearCart,
    onCheckout,
}: CartPanelProps) {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Pesanan Baru</h2>
                    <p className="text-slate-500">{itemCount} item</p>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={onClearCart}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-semibold px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                        <Trash2 size={20} />
                        Hapus
                    </button>
                )}
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <span className="text-6xl mb-4">🛒</span>
                        <span className="text-lg">Keranjang kosong</span>
                        <span className="text-sm mt-2">Pilih menu di sebelah kiri</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Emoji */}
                                    <div className="w-14 h-14 flex-shrink-0 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">
                                        {item.emoji || '🍽️'}
                                    </div>

                                    {/* Item Info - Name and Price */}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 truncate">{item.name}</p>
                                        <p className="text-sm text-slate-500">
                                            Rp {item.price.toLocaleString('id-ID')}
                                        </p>
                                        {item.product_type === 'CONSIGNMENT' && item.vendor_name && (
                                            <span className="badge-consignment text-xs">
                                                {item.vendor_name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Bottom Row - Quantity Controls and Subtotal */}
                                <div className="flex items-center justify-between gap-3 pl-2">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, -1)}
                                            className="qty-btn text-red-500"
                                        >
                                            <Minus size={20} />
                                        </button>
                                        <span className="w-8 text-center font-bold text-lg">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => onUpdateQuantity(item.id, 1)}
                                            className="qty-btn text-green-500"
                                        >
                                            <Plus size={20} />
                                        </button>
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-slate-800">
                                            Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer - Total & Checkout */}
            <div className="border-t border-slate-200 p-4 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-slate-600">Total</span>
                    <span className="text-3xl font-bold text-slate-800">
                        Rp {total.toLocaleString('id-ID')}
                    </span>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={onCheckout}
                    disabled={items.length === 0}
                    className={`btn-primary ${items.length === 0
                        ? 'opacity-50 cursor-not-allowed bg-slate-400'
                        : ''
                        }`}
                >
                    💵 BAYAR
                </button>
            </div>
        </div>
    );
}
