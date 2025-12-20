import { useState, useEffect, useCallback } from 'react';
import { DailyReport } from '../components/reports/DailyReport';
import { getDailyReport } from '../services/data';
import type { DailyReportSummary } from '../types';

export function ReportPage() {
    const [report, setReport] = useState<DailyReportSummary | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState(() => {
        return new Date().toISOString().split('T')[0];
    });

    const fetchReport = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await getDailyReport(selectedDate);
            setReport(data);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to load report';
            setError(errorMsg);
            console.error('❌ Error loading report:', err);
        } finally {
            setIsLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="min-h-screen py-6" style={{ backgroundColor: '#F9F7F5' }}>
            <div className="max-w-2xl mx-auto p-4 space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
                        <p className="font-semibold">⚠️ Error: {error}</p>
                    </div>
                )}

                {/* Date Picker */}
                <div className="card">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Pilih Tanggal Laporan
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold text-lg"
                    />
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔄</div>
                            <p className="text-lg font-semibold text-slate-600">Loading report...</p>
                        </div>
                    </div>
                ) : report ? (
                    <DailyReport
                        report={report}
                        onRefresh={fetchReport}
                        isLoading={isLoading}
                    />
                ) : null}
            </div>
        </div>
    );
}
