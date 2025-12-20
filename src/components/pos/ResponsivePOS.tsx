import type { Product, Category } from '../../types';
import { MobilePOS } from './MobilePOS';
import { TabletPOS } from './TabletPOS';
import './pos.css';

interface ResponsivePOSProps {
    products: Product[];
    categories: Category[];
    tableNumber?: string;
}

/**
 * ResponsivePOS - Automatically switches between Mobile and Tablet layouts
 * 
 * Mobile (<768px): Vertical flow with bottom bar
 * Tablet (>=768px): Split screen with menu on left, bill on right
 * 
 * Both layouts are rendered but CSS hides the inappropriate one.
 * This ensures smooth transitions and no layout shift.
 */
export function ResponsivePOS({ products, categories, tableNumber = "Meja 1" }: ResponsivePOSProps) {
    return (
        <>
            {/* Mobile Layout - Hidden at >= 768px */}
            <MobilePOS
                products={products}
                tableNumber={tableNumber}
            />

            {/* Tablet Layout - Hidden at < 768px */}
            <TabletPOS
                products={products}
                categories={categories}
                tableNumber={tableNumber}
            />
        </>
    );
}
