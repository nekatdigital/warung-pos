import { createClient } from '@supabase/supabase-js';
import type { Product, Category, Order, OrderItem, CartItem, DailyReportSummary, VendorPayout, Vendor } from '../types';

// Supabase configuration
// TODO: Replace dengan environment variables untuk production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================== PRODUCTS ====================

export async function getProducts(categoryId?: string): Promise<Product[]> {
    let query = supabase
        .from('products')
        .select(`
      *,
      vendors(name),
      categories(name)
    `)
        .eq('is_active', true)
        .order('name');

    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return (data || []).map((p: any) => ({
        ...p,
        vendor_name: p.vendors?.name,
        category_name: p.categories?.name,
    }));
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

    if (error) {
        console.error('Error creating product:', error);
        return null;
    }

    return data;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
    const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating product:', error);
        return null;
    }

    return data;
}

export async function deleteProduct(id: string): Promise<boolean> {
    // Soft delete - just set is_active to false
    const { error } = await supabase
        .from('products')
        .update({ is_active: false })
        .eq('id', id);

    if (error) {
        console.error('Error deleting product:', error);
        return false;
    }

    return true;
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

export async function createCategory(name: string, sortOrder: number = 0): Promise<Category | null> {
    const { data, error } = await supabase
        .from('categories')
        .insert({ name, sort_order: sortOrder })
        .select()
        .single();

    if (error) {
        console.error('Error creating category:', error);
        return null;
    }

    return data;
}

// ==================== VENDORS ====================

export async function getVendors(): Promise<Vendor[]> {
    const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('name');

    if (error) {
        console.error('Error fetching vendors:', error);
        return [];
    }

    return data || [];
}

export async function createVendor(name: string, phone?: string): Promise<Vendor | null> {
    const { data, error } = await supabase
        .from('vendors')
        .insert({ name, phone })
        .select()
        .single();

    if (error) {
        console.error('Error creating vendor:', error);
        return null;
    }

    return data;
}

// ==================== ORDERS ====================

export async function createOrder(
    totalAmount: number,
    cashReceived: number,
    changeAmount: number,
    cartItems: CartItem[]
): Promise<Order | null> {
    // Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            total_amount: totalAmount,
            cash_received: cashReceived,
            change_amount: changeAmount,
            order_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

    if (orderError || !order) {
        console.error('Error creating order:', orderError);
        return null;
    }

    // Create order items
    const orderItems: Omit<OrderItem, 'id' | 'created_at'>[] = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        product_type: item.product_type,
        vendor_name: item.vendor_name,
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) {
        console.error('Error creating order items:', itemsError);
        // Rollback order if items failed
        await supabase.from('orders').delete().eq('id', order.id);
        return null;
    }

    return order;
}

export async function getOrdersForDate(date: string): Promise<Order[]> {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_date', date)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
}

// ==================== REPORTS ====================

export async function getDailyReport(date: string): Promise<DailyReportSummary> {
    // Get all order items for the date
    const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('order_date', date);

    if (ordersError) {
        console.error('Error fetching orders for report:', ordersError);
        return createEmptyReport(date);
    }

    if (!orders || orders.length === 0) {
        return createEmptyReport(date);
    }

    const orderIds = orders.map((o) => o.id);

    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .in('order_id', orderIds);

    if (itemsError) {
        console.error('Error fetching order items for report:', itemsError);
        return createEmptyReport(date);
    }

    // Calculate totals by product type
    let ownProductionTotal = 0;
    let resellTotal = 0;
    let consignmentTotal = 0;
    const vendorTotals: Record<string, { amount: number; count: number }> = {};

    (items || []).forEach((item: OrderItem) => {
        switch (item.product_type) {
            case 'OWN_PRODUCTION':
                ownProductionTotal += item.subtotal;
                break;
            case 'RESELL':
                resellTotal += item.subtotal;
                break;
            case 'CONSIGNMENT':
                consignmentTotal += item.subtotal;
                if (item.vendor_name) {
                    if (!vendorTotals[item.vendor_name]) {
                        vendorTotals[item.vendor_name] = { amount: 0, count: 0 };
                    }
                    vendorTotals[item.vendor_name].amount += item.subtotal;
                    vendorTotals[item.vendor_name].count += item.quantity;
                }
                break;
        }
    });

    const vendorPayouts: VendorPayout[] = Object.entries(vendorTotals).map(
        ([vendor_name, data]) => ({
            vendor_name,
            total_amount: data.amount,
            item_count: data.count,
        })
    );

    return {
        date,
        total_revenue: orders.reduce((sum, o) => sum + o.total_amount, 0),
        total_transactions: orders.length,
        own_production_total: ownProductionTotal,
        resell_total: resellTotal,
        consignment_total: consignmentTotal,
        vendor_payouts: vendorPayouts.sort((a, b) => b.total_amount - a.total_amount),
    };
}

function createEmptyReport(date: string): DailyReportSummary {
    return {
        date,
        total_revenue: 0,
        total_transactions: 0,
        own_production_total: 0,
        resell_total: 0,
        consignment_total: 0,
        vendor_payouts: [],
    };
}

// ==================== DEMO DATA ====================

// Demo data untuk testing tanpa Supabase
export const DEMO_CATEGORIES: Category[] = [
    { id: '1', name: 'Makanan', sort_order: 1 },
    { id: '2', name: 'Minuman', sort_order: 2 },
    { id: '3', name: 'Camilan', sort_order: 3 },
];

export const DEMO_PRODUCTS: Product[] = [
    // Makanan - Produksi Sendiri
    { id: '1', name: 'Nasi Goreng', price: 15000, emoji: '🍛', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: '' },
    { id: '2', name: 'Mie Goreng', price: 13000, emoji: '🍜', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: '' },
    { id: '3', name: 'Nasi Ayam', price: 18000, emoji: '🍗', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: '' },
    { id: '4', name: 'Soto Ayam', price: 15000, emoji: '🍲', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: '' },

    // Minuman - Produksi Sendiri
    { id: '5', name: 'Es Teh Manis', price: 4000, emoji: '🥤', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },
    { id: '6', name: 'Es Jeruk', price: 5000, emoji: '🍊', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },
    { id: '7', name: 'Kopi Hitam', price: 5000, emoji: '☕', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },

    // Minuman - Kulakan/Resell
    { id: '8', name: 'Aqua Botol', price: 5000, emoji: '💧', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },
    { id: '9', name: 'Teh Pucuk', price: 5000, emoji: '🍵', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },
    { id: '10', name: 'Sprite', price: 6000, emoji: '🥤', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },

    // Camilan - Titip Jual
    { id: '11', name: 'Kerupuk Kaleng', price: 2000, emoji: '🍘', product_type: 'CONSIGNMENT', vendor_id: 'v1', vendor_name: 'Bu Siti', category_id: '3', category_name: 'Camilan', is_active: true, created_at: '' },
    { id: '12', name: 'Gorengan', price: 1000, emoji: '🥟', product_type: 'CONSIGNMENT', vendor_id: 'v2', vendor_name: 'Pak Budi', category_id: '3', category_name: 'Camilan', is_active: true, created_at: '' },
    { id: '13', name: 'Peyek Kacang', price: 2000, emoji: '🥜', product_type: 'CONSIGNMENT', vendor_id: 'v1', vendor_name: 'Bu Siti', category_id: '3', category_name: 'Camilan', is_active: true, created_at: '' },
    { id: '14', name: 'Kopi Sachet', price: 3000, emoji: '☕', product_type: 'CONSIGNMENT', vendor_id: 'v3', vendor_name: 'Bu Ani', category_id: '2', category_name: 'Minuman', is_active: true, created_at: '' },
];
