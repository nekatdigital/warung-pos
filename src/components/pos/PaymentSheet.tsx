import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../../types';

interface PaymentSheetProps {
    isOpen: boolean;
    total: number;
    items: CartItem[];
    onClose: () => void;
    onSuccess: () => void;
}

// Quick cash options
const QUICK_CASH_OPTIONS = [
    { label: 'UANG PAS', value: 'exact' },
    { label: 'Rp 20.000', value: 20000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
] as const;

// Numeric keypad layout
const KEYPAD_LAYOUT = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['C', '0', '⌫'],
];

export function PaymentSheet({ isOpen, total, items, onClose, onSuccess }: PaymentSheetProps) {
    const [inputValue, setInputValue] = useState<string>('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setInputValue('');
            setShowSuccess(false);
        }
    }, [isOpen]);

    // Parse input to number
    const cashReceived = parseInt(inputValue) || 0;
    const change = cashReceived - total;
    const isValid = cashReceived >= total && cashReceived > 0;

    // Play success sound
    const playSuccessSound = useCallback(() => {
        // Create a pleasant "ding" sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Second higher note for pleasant "ding-ding"
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = 1000;
            osc2.type = 'sine';
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.5);
        }, 150);
    }, []);

    // Handle quick cash selection
    const handleQuickCash = (option: typeof QUICK_CASH_OPTIONS[number]) => {
        if (option.value === 'exact') {
            setInputValue(total.toString());
        } else {
            setInputValue(option.value.toString());
        }
    };

    // Handle keypad press
    const handleKeyPress = (key: string) => {
        if (key === 'C') {
            // Clear all
            setInputValue('');
        } else if (key === '⌫') {
            // Backspace
            setInputValue(prev => prev.slice(0, -1));
        } else {
            // Add digit (max 8 digits)
            if (inputValue.length < 8) {
                setInputValue(prev => prev + key);
            }
        }
    };

    // Handle payment confirmation
    const handleConfirmPayment = () => {
        if (isValid) {
            // Show success overlay
            setShowSuccess(true);
            playSuccessSound();

            // Log transaction
            console.log('💵 Transaksi Berhasil:', {
                items,
                total,
                cashReceived,
                change,
                timestamp: new Date().toISOString(),
            });

            // Auto close after 2 seconds
            setTimeout(() => {
                onSuccess();
            }, 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="payment-sheet-overlay">
            {/* ========== SUCCESS OVERLAY ========== */}
            {showSuccess && (
                <div className="payment-success-overlay">
                    <div className="payment-success-content">
                        <div className="payment-success-icon">✓</div>
                        <h2 className="payment-success-title">BERHASIL!</h2>
                        <p className="payment-success-change">
                            Kembalian: <strong>Rp {change.toLocaleString('id-ID')}</strong>
                        </p>
                    </div>
                </div>
            )}

            {/* ========== PAYMENT MODAL ========== */}
            <div className="payment-sheet-modal">
                {/* Header */}
                <div className="payment-sheet-header">
                    <h1 className="payment-sheet-title">PEMBAYARAN</h1>
                    <button
                        onClick={onClose}
                        className="payment-close-btn"
                        aria-label="Tutup"
                    >
                        TUTUP
                    </button>
                </div>

                {/* Total Display */}
                <div className="payment-total-display">
                    <span className="payment-total-label">Total Bayar</span>
                    <span className="payment-total-amount">
                        Rp {total.toLocaleString('id-ID')}
                    </span>
                </div>

                {/* Quick Cash Buttons */}
                <div className="payment-quick-cash">
                    {QUICK_CASH_OPTIONS.map((option, index) => {
                        const value = option.value === 'exact' ? total : option.value;
                        const isDisabled = option.value !== 'exact' && option.value < total;
                        const isSelected = cashReceived === value;

                        return (
                            <button
                                key={index}
                                onClick={() => handleQuickCash(option)}
                                disabled={isDisabled}
                                className={`payment-quick-btn ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                {/* Cash Input Display */}
                <div className="payment-input-section">
                    <span className="payment-input-label">Uang Diterima</span>
                    <div className="payment-input-display">
                        <span className="payment-input-prefix">Rp</span>
                        <span className="payment-input-value">
                            {cashReceived > 0 ? cashReceived.toLocaleString('id-ID') : '0'}
                        </span>
                    </div>
                </div>

                {/* Numeric Keypad (Calculator Style) */}
                <div className="payment-keypad">
                    {KEYPAD_LAYOUT.map((row, rowIndex) => (
                        <div key={rowIndex} className="payment-keypad-row">
                            {row.map((key) => (
                                <button
                                    key={key}
                                    onClick={() => handleKeyPress(key)}
                                    className={`payment-keypad-btn ${key === 'C' ? 'clear' : ''} ${key === '⌫' ? 'backspace' : ''}`}
                                    aria-label={key === 'C' ? 'Hapus semua' : key === '⌫' ? 'Hapus satu' : key}
                                >
                                    {key}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Change Display */}
                {cashReceived > 0 && (
                    <div className={`payment-change-display ${isValid ? 'valid' : 'invalid'}`}>
                        <span className="payment-change-label">
                            {isValid ? 'Kembalian' : 'Kurang'}
                        </span>
                        <span className="payment-change-amount">
                            Rp {Math.abs(change).toLocaleString('id-ID')}
                        </span>
                    </div>
                )}

                {/* Confirm Button */}
                <button
                    onClick={handleConfirmPayment}
                    disabled={!isValid}
                    className="payment-confirm-btn"
                    aria-label="Konfirmasi pembayaran"
                >
                    SELESAI - CETAK STRUK
                </button>
            </div>
        </div>
    );
}
