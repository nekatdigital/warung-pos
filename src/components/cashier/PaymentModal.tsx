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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b text-white" style={{ backgroundColor: '#E05D34' }}>
                    <h2 className="text-xl sm:text-2xl font-bold">💵 Pembayaran</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
                    {/* Order Summary */}
                    <div className="bg-slate-50 rounded-xl p-3 sm:p-4">
                        <p className="text-slate-500 text-sm mb-2">Ringkasan Pesanan</p>
                        <div className="max-h-24 sm:max-h-32 overflow-y-auto space-y-1">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span>
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span className="font-medium">
                                        Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Display */}
                    <div className="text-center">
                        <p className="text-slate-500 text-base sm:text-lg">Total Bayar</p>
                        <p className="text-2xl sm:text-4xl font-bold text-slate-800">
                            Rp {total.toLocaleString('id-ID')}
                        </p>
                    </div>

                    {/* Cash Input */}
                    <div>
                        <label className="block text-slate-600 text-sm sm:text-base font-medium mb-2">
                            Uang Diterima
                        </label>
                        <input
                            type="text"
                            value={`Rp ${parseInt(inputValue || '0').toLocaleString('id-ID')}`}
                            onChange={handleInputChange}
                            className="w-full text-xl sm:text-3xl font-bold text-center p-3 sm:p-4 border-2 border-slate-300 rounded-xl focus:border-green-500 focus:outline-none"
                        />
                    </div>

                    {/* Quick Cash Buttons */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                            onClick={handleExactCash}
                            className="money-btn text-sm sm:text-base" style={{ backgroundColor: '#FCE8D0', borderColor: '#E5C4A0', color: '#E05D34' }}
                        >
                            🎯 Uang Pas
                        </button>
                        {QUICK_CASH_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleQuickCash(option.value)}
                                className="money-btn text-sm sm:text-base"
                                disabled={option.value < total}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Change Display */}
                    {cashReceived > 0 && (
                        <div
                            className={`text-center p-3 sm:p-4 rounded-xl ${isValid
                                ? 'bg-green-100 border-2 border-green-300'
                                : 'bg-red-100 border-2 border-red-300'
                                }`}
                        >
                            <p className={`text-base sm:text-lg ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                                {isValid ? 'Kembalian' : 'Kurang'}
                            </p>
                            <p
                                className={`text-xl sm:text-3xl font-bold ${isValid ? 'text-green-800' : 'text-red-800'
                                    }`}
                            >
                                Rp {Math.abs(change).toLocaleString('id-ID')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer - Sticky */}
                <div className="flex-shrink-0 p-3 sm:p-4 border-t bg-slate-50 flex gap-2 sm:gap-3">
                    <button onClick={onClose} className="flex-1 btn-secondary text-sm sm:text-base">
                        Batal
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!isValid}
                        className={`flex-1 btn-primary flex items-center justify-center gap-2 text-sm sm:text-base ${!isValid ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        <Check size={20} />
                        SELESAI
                    </button>
                </div>
            </div>
        </div>
    );
}
