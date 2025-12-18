import { useState, useEffect, useCallback } from 'react';
import { DailyReport } from '../components/reports/DailyReport';
import type { DailyReportSummary } from '../types';

// Demo data for testing without Supabase
const DEMO_REPORT: DailyReportSummary = {
    date: new Date().toISOString().split('T')[0],
    total_revenue: 1500000,
    total_transactions: 45,
    own_production_total: 950000,
    resell_total: 250000,
    consignment_total: 300000,
    vendor_payouts: [
        { vendor_name: 'Bu Siti', total_amount: 150000, item_count: 25 },
        { vendor_name: 'Pak Budi', total_amount: 100000, item_count: 40 },
        { vendor_name: 'Bu Ani', total_amount: 50000, item_count: 10 },
    ],
};

export function ReportPage() {
    const [report, setReport] = useState<DailyReportSummary>(DEMO_REPORT);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReport = useCallback(async () => {
        setIsLoading(true);

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In production, use:
        // const report = await getDailyReport(new Date().toISOString().split('T')[0]);
        // setReport(report);

        // For demo, use static data
        setReport({
            ...DEMO_REPORT,
            date: new Date().toISOString().split('T')[0],
        });

        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchReport();
    }, [fetchReport]);

    return (
        <div className="min-h-screen bg-slate-100 py-6">
            <DailyReport
                report={report}
                onRefresh={fetchReport}
                isLoading={isLoading}
            />
        </div>
    );
}
