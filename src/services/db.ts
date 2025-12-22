import Dexie from 'dexie';
import type { Table } from 'dexie';
import type { Product, Category, Vendor, Order, OrderItem } from '../types';

/**
 * IndexedDB Database using Dexie ORM
 * Provides local-first data persistence for PWA
 */
export class WarungDB extends Dexie {
  products!: Table<Product>;
  categories!: Table<Category>;
  vendors!: Table<Vendor>;
  orders!: Table<Order>;
  orderItems!: Table<OrderItem>;

  constructor() {
    super('WarungPOS');
    this.version(1).stores({
      products: '++id, is_active, category_id, vendor_id',
      categories: '++id, sort_order',
      vendors: '++id, name',
      orders: '++id, order_date, created_at',
      orderItems: '++id, order_id, product_id, product_type',
    });
  }
}

// Create database instance
export const db = new WarungDB();

/**
 * Initialize database with demo data if empty
 */
export async function initializeDatabase() {
  try {
    const categoryCount = await db.categories.count();

    if (categoryCount === 0) {
      // Add demo categories
      await db.categories.bulkAdd([
        { id: '1', name: 'Makanan', sort_order: 1 },
        { id: '2', name: 'Minuman', sort_order: 2 },
        { id: '3', name: 'Camilan', sort_order: 3 },
      ]);

      // Add demo vendors
      await db.vendors.bulkAdd([
        { id: 'v1', name: 'Bu Siti', phone: '081234567890', created_at: new Date().toISOString() },
        { id: 'v2', name: 'Pak Budi', phone: '081234567891', created_at: new Date().toISOString() },
        { id: 'v3', name: 'Bu Ani', phone: '081234567892', created_at: new Date().toISOString() },
      ]);

      // Add demo products
      await db.products.bulkAdd([
        // Makanan - Produksi Sendiri
        { id: '1', name: 'Nasi Goreng', price: 15000, emoji: '🍛', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: new Date().toISOString() },
        { id: '2', name: 'Mie Goreng', price: 13000, emoji: '🍜', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: new Date().toISOString() },
        { id: '3', name: 'Nasi Ayam', price: 18000, emoji: '🍗', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: new Date().toISOString() },
        { id: '4', name: 'Soto Ayam', price: 15000, emoji: '🍲', product_type: 'OWN_PRODUCTION', category_id: '1', category_name: 'Makanan', is_active: true, created_at: new Date().toISOString() },

        // Minuman - Produksi Sendiri
        { id: '5', name: 'Es Teh Manis', price: 4000, emoji: '🥤', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },
        { id: '6', name: 'Es Jeruk', price: 5000, emoji: '🍊', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },
        { id: '7', name: 'Kopi Hitam', price: 5000, emoji: '☕', product_type: 'OWN_PRODUCTION', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },

        // Minuman - Kulakan/Resell
        { id: '8', name: 'Aqua Botol', price: 5000, emoji: '💧', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },
        { id: '9', name: 'Teh Pucuk', price: 5000, emoji: '🍵', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },
        { id: '10', name: 'Sprite', price: 6000, emoji: '🥤', product_type: 'RESELL', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },

        // Camilan - Titip Jual
        { id: '11', name: 'Kerupuk Kaleng', price: 2000, emoji: '🍘', product_type: 'CONSIGNMENT', vendor_id: 'v1', vendor_name: 'Bu Siti', category_id: '3', category_name: 'Camilan', is_active: true, created_at: new Date().toISOString() },
        { id: '12', name: 'Gorengan', price: 1000, emoji: '🥟', product_type: 'CONSIGNMENT', vendor_id: 'v2', vendor_name: 'Pak Budi', category_id: '3', category_name: 'Camilan', is_active: true, created_at: new Date().toISOString() },
        { id: '13', name: 'Peyek Kacang', price: 2000, emoji: '🥜', product_type: 'CONSIGNMENT', vendor_id: 'v1', vendor_name: 'Bu Siti', category_id: '3', category_name: 'Camilan', is_active: true, created_at: new Date().toISOString() },
        { id: '14', name: 'Kopi Sachet', price: 3000, emoji: '☕', product_type: 'CONSIGNMENT', vendor_id: 'v3', vendor_name: 'Bu Ani', category_id: '2', category_name: 'Minuman', is_active: true, created_at: new Date().toISOString() },
      ]);

      console.log('✅ Database initialized with demo data');
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      // Log detailed error in development for debugging
      console.error('❌ Error initializing database:', error);
    } else {
      // Log generic error in production to avoid leaking sensitive info
      console.error('❌ An error occurred during database initialization.');
    }
    throw error;
  }
}

/**
 * Clear all database tables (for testing/reset)
 */
export async function clearDatabase() {
  try {
    await db.delete();
    console.log('✅ Database cleared');
  } catch (error) {
    if (import.meta.env.DEV) {
      // Log detailed error in development for debugging
      console.error('❌ Error clearing database:', error);
    } else {
      // Log generic error in production to avoid leaking sensitive info
      console.error('❌ An error occurred while clearing the database.');
    }
    throw error;
  }
}

/**
 * Get database stats
 */
export async function getDatabaseStats() {
  return {
    products: await db.products.count(),
    categories: await db.categories.count(),
    vendors: await db.vendors.count(),
    orders: await db.orders.count(),
    orderItems: await db.orderItems.count(),
  };
}
