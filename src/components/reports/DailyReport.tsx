import type { DailyReportSummary } from '../../types';
import { Printer, RefreshCw } from 'lucide-react';

interface DailyReportProps {
    report: DailyReportSummary;
    onRefresh: () => void;
    isLoading: boolean;
}

export function DailyReport({ report, onRefresh, isLoading }: DailyReportProps) {
    const formatCurrency = (amount: number) => {
        return `Rp ${amount.toLocaleString('id-ID')}`;
    };

    const handlePrint = () => {
        window.print();
    };

    // Calculate ownership amounts
    const warungOwned = report.own_production_total + report.resell_total;
    const vendorOwed = report.consignment_total;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">📊 Laporan Hari Ini</h1>
                    <p className="text-slate-500 text-lg">
                        {new Date(report.date).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button
                        onClick={handlePrint}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <Printer size={20} />
                        Cetak
                    </button>
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                {/* Total Revenue */}
                <div className="card text-white col-span-2" style={{ background: 'linear-gradient(to bottom right, #E05D34, #C84A24)' }}>
                    <p className="text-black font-bold text-xl">💰 TOTAL UANG DI KASIR</p>
                    <p className="text-5xl font-bold mt-2 text-black">
                        {formatCurrency(report.total_revenue)}
                    </p>
                    <p className="text-black font-semibold mt-2">
                        {report.total_transactions} transaksi
                    </p>
                </div>

                {/* Warung Owned */}
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <p className="text-black font-bold text-lg">🏠 Milik Warung</p>
                    <p className="text-3xl font-bold mt-2 text-black">{formatCurrency(warungOwned)}</p>
                    <p className="text-black text-sm mt-1 font-semibold">Bisa diambil</p>
                </div>

                {/* Vendor Owed */}
                <div className="card bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <p className="text-black font-bold text-lg">🤝 Uang Titipan</p>
                    <p className="text-3xl font-bold mt-2 text-black">{formatCurrency(vendorOwed)}</p>
                    <p className="text-black text-sm mt-1 font-semibold">Wajib setor vendor</p>
                </div>
            </div>

            {/* Sales Breakdown */}
            <div className="card">
                <h2 className="text-xl font-bold text-slate-800 mb-4">
                    📋 Rincian Penjualan
                </h2>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🍳</span>
                            <div>
                                <p className="font-bold text-slate-800">Produksi Sendiri</p>
                                <p className="text-sm text-slate-500">Nasi Goreng, Es Teh, dll</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                            {formatCurrency(report.own_production_total)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📦</span>
                            <div>
                                <p className="font-bold text-slate-800">Kulakan / Resell</p>
                                <p className="text-sm text-slate-500">Aqua, Teh Pucuk, dll</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-slate-600">
                            {formatCurrency(report.resell_total)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-amber-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🤝</span>
                            <div>
                                <p className="font-bold text-slate-800">Titip Jual</p>
                                <p className="text-sm text-slate-500">Kerupuk, Gorengan, dll</p>
                            </div>
                        </div>
                        <span className="text-xl font-bold text-amber-600">
                            {formatCurrency(report.consignment_total)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Vendor Payouts */}
            {report.vendor_payouts.length > 0 && (
                <div className="card border-2 border-amber-300 bg-amber-50">
                    <h2 className="text-xl font-bold text-amber-800 mb-4 flex items-center gap-2">
                        ⚠️ Wajib Setor ke Vendor
                    </h2>
                    <div className="space-y-3">
                        {report.vendor_payouts.map((payout) => (
                            <div
                                key={payout.vendor_name}
                                className="flex justify-between items-center p-3 bg-white rounded-xl"
                            >
                                <div>
                                    <p className="font-bold text-slate-800">{payout.vendor_name}</p>
                                    <p className="text-sm text-slate-500">
                                        {payout.item_count} item terjual
                                    </p>
                                </div>
                                <span className="text-xl font-bold text-amber-600">
                                    {formatCurrency(payout.total_amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center p-3 mt-3 bg-amber-200 rounded-xl">
                        <span className="font-bold text-amber-800">TOTAL SETOR</span>
                        <span className="text-2xl font-bold text-amber-800">
                            {formatCurrency(vendorOwed)}
                        </span>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {report.total_transactions === 0 && (
                <div className="card text-center py-12">
                    <span className="text-6xl">📭</span>
                    <p className="text-xl text-slate-500 mt-4">Belum ada transaksi hari ini</p>
                    <p className="text-slate-400">Mulai dari halaman Kasir</p>
                </div>
            )}
        </div>
    );
}
