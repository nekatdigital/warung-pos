import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import type { CartItem } from '../../types';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (cashReceived: number) => void;
    total: number;
    items: CartItem[];
}

const QUICK_CASH_OPTIONS = [
    { label: 'Rp 10.000', value: 10000 },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
];

export function PaymentModal({
    isOpen,
    onClose,
    onConfirm,
    total,
    items,
}: PaymentModalProps) {
    const [cashReceived, setCashReceived] = useState<number>(total);
    const [inputValue, setInputValue] = useState<string>(total.toString());

    // BUG FIX: Reset state when modal opens with new total
    useEffect(() => {
        if (isOpen) {
            setCashReceived(total);
            setInputValue(total.toString());
        }
    }, [isOpen, total]);

    const change = cashReceived - total;
    const isValid = cashReceived >= total;

    // Play success sound
    const playSuccess = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRl4FAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YToFAABKANz/xP/q/xsAOABbAHsAmQC2AM8A5QD1AAEBCQEMAQsBBQH6AOUA0QC4AJwAewBYADMA/v/R/7D/fP9c/z7/J/8T/wT/+f7z/vL+9P75/gL/D/8d/yz/Ov9L/1v/a/96/4j/lP+f/6b/rP+u/67/rP+o/6D/l/+L/33/b/9h/1P/Rv87/zH/Kf8j/x//H/8h/yb/Lv84/0T/Uf9g/3D/gP+Q/6D/sP+//83/2f/l//D/+P8AAAYACgAMAAwACQAEAP7/9//t/+L/1//L/8D/tP+q/6D/mP+S/43/iv+J/4r/jP+R/5f/n/+o/7P/vv/K/9f/4//v//n/AgAKABAAFAAWABYAFAAPAAoAAwD8//P/6v/g/9b/zf/F/73/uP+z/7D/rv+u/7D/tP+4/77/xf/N/9X/3//o//D/+P//AAUACgANAA4ADgAMAAgABAD//+7/5P+V/07/9v+Q/93/6f9JAND/YwBPAA0Aq/9M/2//7v/r/yoAlQDIAMwAogBDANf/ef89/xr/DP8O/yP/SP97/7T/7v8pAGMAmwDPAAEBLAFSAXMBjQGiAbEBuQG7AbcBrAGcAYUBaQFHASAB9QDGAJQAXwAoAPH/uv+D/03/Gv/p/rz+kv5t/k3+M/4f/hL+C/4L/hL+IP41/lH+c/6b/sj++f4u/2j/pP/i/yEAYgCjAOMAIgFfAZkB0AEEAjMCXgKEAqUCwQLWAuYC7wLyAu4C5ALTAr0CogKAAloC'
        );
        audio.volume = 0.5;
        audio.play().catch(() => { });
    };

    const handleQuickCash = (value: number) => {
        setCashReceived(value);
        setInputValue(value.toString());
    };

    const handleExactCash = () => {
        setCashReceived(total);
        setInputValue(total.toString());
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // BUG FIX: Better input handling - strip "Rp " prefix and non-digits
        const rawValue = e.target.value.replace(/[^\d]/g, '');
        setInputValue(rawValue);
        setCashReceived(parseInt(rawValue) || 0);
    };

    const handleConfirm = () => {
        if (isValid) {
            playSuccess();
            onConfirm(cashReceived);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-slate-200 bg-white" style={{ backgroundColor: '#FFF' }}>
                <button
                    onClick={onClose}
                    className="flex items-center gap-2 text-lg font-bold text-slate-700 hover:text-slate-900 transition-colors"
                >
                    <X size={28} />
                    <span>Kembali</span>
                </button>
                <h2 className="text-3xl font-bold text-slate-800">💵 Pembayaran</h2>
                <div className="w-20"></div>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8">
                {/* Total Amount - Extra Large Display */}
                <div className="text-center space-y-3">
                    <p className="text-lg text-slate-600 font-medium">Total Bayar</p>
                    <p className="text-7xl font-bold text-slate-800 tracking-tight">
                        Rp {total.toLocaleString('id-ID')}
                    </p>
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                    <p className="text-slate-700 text-lg font-semibold">Ringkasan Pesanan</p>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-slate-700 text-base">
                                <span className="font-medium">
                                    {item.quantity}x {item.name}
                                </span>
                                <span className="font-semibold">
                                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cash Input */}
                <div className="space-y-3">
                    <label className="block text-slate-700 text-lg font-semibold">
                        Uang Diterima
                    </label>
                    <input
                        type="text"
                        value={`Rp ${parseInt(inputValue || '0').toLocaleString('id-ID')}`}
                        onChange={handleInputChange}
                        className="w-full text-5xl font-bold text-center p-6 border-3 border-slate-300 rounded-2xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
                        autoFocus
                    />
                </div>

                {/* Quick Cash Buttons */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleExactCash}
                        className="py-5 px-6 rounded-xl font-bold text-lg transition-all active:scale-95"
                        style={{ backgroundColor: '#FCE8D0', color: '#E05D34' }}
                    >
                        🎯 Uang Pas
                    </button>
                    {QUICK_CASH_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleQuickCash(option.value)}
                            className="py-5 px-6 rounded-xl font-bold text-lg transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed bg-slate-100 text-slate-700 hover:bg-slate-200"
                            disabled={option.value < total}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Change Display */}
                {cashReceived > 0 && (
                    <div
                        className="text-center p-6 rounded-2xl border-3 space-y-2"
                        style={isValid ? { backgroundColor: '#E8F8F5', borderColor: '#27AE60' } : { backgroundColor: '#FADBD8', borderColor: '#C0392B' }}
                    >
                        <p className="text-lg font-semibold" style={isValid ? { color: '#27AE60' } : { color: '#C0392B' }}>
                            {isValid ? '✓ Kembalian' : '✗ Kurang'}
                        </p>
                        <p
                            className="text-5xl font-bold"
                            style={isValid ? { color: '#27AE60' } : { color: '#C0392B' }}
                        >
                            Rp {Math.abs(change).toLocaleString('id-ID')}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer - Full Width Button */}
            <div className="flex-shrink-0 p-6 border-t border-slate-200 bg-white flex gap-4">
                <button
                    onClick={onClose}
                    className="flex-1 py-5 px-6 rounded-xl font-bold text-lg text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                    Batal
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className={`flex-1 py-5 px-6 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-2 transition-all active:scale-95 ${isValid ? 'bg-green-600 hover:bg-green-700' : 'bg-slate-400 cursor-not-allowed'
                        }`}
                >
                    <Check size={24} />
                    KONFIRMASI BAYAR
                </button>
            </div>
        </div>
    );
}
