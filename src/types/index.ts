// Product Types
export type ProductType = 'OWN_PRODUCTION' | 'RESELL' | 'CONSIGNMENT';

// Database Tables
export interface Vendor {
    id: string;
    name: string;
    phone?: string;
    created_at: string;
}

export interface Category {
    id: string;
    name: string;
    sort_order: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    image_url?: string;
    emoji?: string; // Fallback jika tidak ada gambar
    product_type: ProductType;
    vendor_id?: string;
    vendor_name?: string; // Joined from vendors table
    category_id?: string;
    category_name?: string; // Joined from categories table
    is_active: boolean;
    created_at: string;
}

export interface Order {
    id: string;
    total_amount: number;
    cash_received?: number;
    change_amount?: number;
    order_date: string;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id?: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    product_type: ProductType;
    vendor_name?: string;
    created_at: string;
}

// Cart (Frontend State)
export interface CartItem extends Omit<Product, 'is_active' | 'created_at'> {
    quantity: number;
}

// Daily Report
export interface DailyReportSummary {
    date: string;
    total_revenue: number;
    total_transactions: number;
    own_production_total: number;
    resell_total: number;
    consignment_total: number;
    vendor_payouts: VendorPayout[];
}

export interface VendorPayout {
    vendor_name: string;
    total_amount: number;
    item_count: number;
}

// UI State
export interface PaymentState {
    isOpen: boolean;
    cashReceived: number;
    change: number;
}

// Input Validation Types
export interface ProductInput {
    name?: string;
    price?: number;
    product_type?: ProductType;
    vendor_id?: string;
}

export interface CategoryInput {
    name?: string;
}

export interface VendorInput {
    name?: string;
    phone?: string;
}

export interface OrderInput {
    total_amount?: number;
    cash_received?: number;
    items?: unknown[];
}
