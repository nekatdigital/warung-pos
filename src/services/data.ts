/**
 * Local-First Data Service
 * Replaces Supabase with IndexedDB + localStorage
 * Provides same API interface for seamless migration
 */

import { db } from './db';
import { syncService } from './storage';
import type { Product, Category, Order, OrderItem, CartItem, DailyReportSummary, VendorPayout, Vendor } from '../types';

// ==================== PRODUCTS ====================

export async function getProducts(categoryId?: string): Promise<Product[]> {
  try {
    // Dexie doesn't index boolean fields, so filter in memory
    let products = await db.products.toArray();
    products = products.filter((p: Product) => p.is_active === true);

    if (categoryId) {
      products = products.filter((p: Product) => p.category_id === categoryId);
    }

    return products;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return [];
  }
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product | null> {
  try {
    const newProduct: Product = {
      ...product,
      id: `prod_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    await db.products.add(newProduct);
    syncService.markPendingSync('products', newProduct.id);
    console.log('✅ Product created:', newProduct.id);
    return newProduct;
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product | null> {
  try {
    await db.products.update(id, product);
    syncService.markPendingSync('products', id);
    console.log('✅ Product updated:', id);
    
    const updated = await db.products.get(id);
    return updated || null;
  } catch (error) {
    console.error('❌ Error updating product:', error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    // Soft delete
    await db.products.update(id, { is_active: false });
    syncService.markPendingSync('products', id);
    console.log('✅ Product deleted:', id);
    return true;
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return false;
  }
}

// ==================== CATEGORIES ====================

export async function getCategories(): Promise<Category[]> {
  try {
    return await db.categories.toArray();
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return [];
  }
}

export async function createCategory(name: string, sortOrder: number = 0): Promise<Category | null> {
  try {
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name,
      sort_order: sortOrder,
    };

    await db.categories.add(newCategory);
    syncService.markPendingSync('categories', newCategory.id);
    console.log('✅ Category created:', newCategory.id);
    return newCategory;
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return null;
  }
}

// ==================== VENDORS ====================

export async function getVendors(): Promise<Vendor[]> {
  try {
    return await db.vendors.toArray();
  } catch (error) {
    console.error('❌ Error fetching vendors:', error);
    return [];
  }
}

export async function createVendor(name: string, phone?: string): Promise<Vendor | null> {
  try {
    const newVendor: Vendor = {
      id: `vendor_${Date.now()}`,
      name,
      phone,
      created_at: new Date().toISOString(),
    };

    await db.vendors.add(newVendor);
    console.log('✅ Vendor created:', newVendor.id);
    return newVendor;
  } catch (error) {
    console.error('❌ Error creating vendor:', error);
    return null;
  }
}

// ==================== ORDERS ====================

export async function createOrder(
  totalAmount: number,
  cashReceived: number,
  changeAmount: number,
  cartItems: CartItem[]
): Promise<Order | null> {
  try {
    // Validate inputs
    if (totalAmount <= 0) {
      throw new Error('Total amount must be greater than 0');
    }
    if (cartItems.length === 0) {
      throw new Error('Cart cannot be empty');
    }

    // Create order
    const newOrder: Order = {
      id: `order_${Date.now()}`,
      total_amount: totalAmount,
      cash_received: cashReceived,
      change_amount: changeAmount,
      order_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    await db.orders.add(newOrder);

    // Create order items
    const orderItems: OrderItem[] = cartItems.map((item) => ({
      id: `item_${Date.now()}_${Math.random()}`,
      order_id: newOrder.id,
      product_id: item.id,
      product_name: item.name,
      unit_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      product_type: item.product_type,
      vendor_name: item.vendor_name,
      created_at: new Date().toISOString(),
    }));

    await db.orderItems.bulkAdd(orderItems);
    syncService.markPendingSync('orders', newOrder.id);

    console.log('✅ Order created:', newOrder.id);
    return newOrder;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw error;
  }
}

export async function getOrdersForDate(date: string): Promise<Order[]> {
  try {
    const orders = await db.orders.where('order_date').equals(date).toArray();
    return orders.sort((a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    return [];
  }
}

export async function getAllOrders(): Promise<Order[]> {
  try {
    return await db.orders.toArray();
  } catch (error) {
    console.error('❌ Error fetching all orders:', error);
    return [];
  }
}

// ==================== REPORTS ====================

export async function getDailyReport(date: string): Promise<DailyReportSummary> {
  try {
    // Get all orders for the date
    const orders = await db.orders.where('order_date').equals(date).toArray();

    if (orders.length === 0) {
      return createEmptyReport(date);
    }

    const orderIds = orders.map((o: Order) => o.id);

    // Get all order items for these orders
    const items = await db.orderItems.where('order_id').anyOf(orderIds).toArray();

    // Calculate totals by product type
    let ownProductionTotal = 0;
    let resellTotal = 0;
    let consignmentTotal = 0;
    const vendorTotals: Record<string, { amount: number; count: number }> = {};

    items.forEach((item: OrderItem) => {
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

    const vendorPayouts: VendorPayout[] = Object.entries(vendorTotals)
      .map(([vendor_name, data]) => ({
        vendor_name,
        total_amount: data.amount,
        item_count: data.count,
      }))
      .sort((a, b) => b.total_amount - a.total_amount);

    return {
      date,
      total_revenue: orders.reduce((sum: number, o: Order) => sum + o.total_amount, 0),
      total_transactions: orders.length,
      own_production_total: ownProductionTotal,
      resell_total: resellTotal,
      consignment_total: consignmentTotal,
      vendor_payouts: vendorPayouts,
    };
  } catch (error) {
    console.error('❌ Error fetching daily report:', error);
    return createEmptyReport(date);
  }
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

/**
 * Get summary stats for dashboard
 */
export async function getStatistics() {
  try {
    // Filter boolean fields in memory since Dexie doesn't index them
    const allProducts = await db.products.toArray();
    const products = allProducts.filter((p: Product) => p.is_active === true).length;
    const orders = await db.orders.count();
    const categories = await db.categories.count();
    const vendors = await db.vendors.count();

    // Calculate total revenue
    const allOrders = await db.orders.toArray();
    const totalRevenue = allOrders.reduce((sum: number, o: Order) => sum + o.total_amount, 0);

    return {
      products,
      orders,
      categories,
      vendors,
      totalRevenue,
    };
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    return {
      products: 0,
      orders: 0,
      categories: 0,
      vendors: 0,
      totalRevenue: 0,
    };
  }
}

/**
 * Export all data as JSON (for backup)
 */
export async function exportData() {
  try {
    const [products, categories, vendors, orders, orderItems] = await Promise.all([
      db.products.toArray(),
      db.categories.toArray(),
      db.vendors.toArray(),
      db.orders.toArray(),
      db.orderItems.toArray(),
    ]);

    const data = {
      exportDate: new Date().toISOString(),
      products,
      categories,
      vendors,
      orders,
      orderItems,
    };

    return data;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
}

/**
 * Import data from JSON (for restore)
 */
export async function importData(data: any) {
  try {
    const { products, categories, vendors, orders, orderItems } = data;

    if (categories) await db.categories.bulkAdd(categories);
    if (vendors) await db.vendors.bulkAdd(vendors);
    if (products) await db.products.bulkAdd(products);
    if (orders) await db.orders.bulkAdd(orders);
    if (orderItems) await db.orderItems.bulkAdd(orderItems);

    console.log('✅ Data imported successfully');
  } catch (error) {
    console.error('❌ Error importing data:', error);
    throw error;
  }
}
