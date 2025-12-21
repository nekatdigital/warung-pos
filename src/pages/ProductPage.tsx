import { useState, useEffect } from 'react';
import { ProductList } from '../components/products/ProductList';
import { ProductForm } from '../components/products/ProductForm';
import { ProductFilters } from '../components/products/ProductFilters';
import { getProducts, getCategories, getVendors, createProduct, updateProduct, deleteProduct } from '../services/data';
import type { Product, Category, Vendor } from '../types';

export function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [prods, cats] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMsg);
      console.error('❌ Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSave = async () => {
    await loadData();
    handleFormClose();
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Hapus produk "${product.name}"?`)) {
      try {
        // Delete logic will be here
        setError('Delete functionality coming soon');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
        setError(errorMsg);
      }
    }
  };

  // Apply filters
  const filteredProducts = products.filter((p) => {
    if (filterCategory && p.category_id !== filterCategory) return false;
    if (filterType && p.product_type !== filterType) return false;
    if (filterStatus === 'active' && !p.is_active) return false;
    if (filterStatus === 'inactive' && p.is_active) return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F9F7F5' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-lg font-semibold text-slate-600">Loading produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" style={{ backgroundColor: '#F9F7F5' }}>
      <div className="max-w-full mx-auto px-4 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
            <p className="font-semibold">⚠️ Error: {error}</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-800">📦 Kelola Produk</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors text-lg"
          >
            ➕ Tambah Produk
          </button>
        </div>

        {/* Main Layout: 2-column (Filter | List) */}
        <div className="flex gap-4">
          {/* Left: Filters */}
          <ProductFilters
            categories={categories}
            filterCategory={filterCategory}
            onCategoryChange={setFilterCategory}
            filterType={filterType}
            onTypeChange={setFilterType}
            filterStatus={filterStatus}
            onStatusChange={setFilterStatus}
          />

          {/* Right: Product List */}
          <ProductList
            products={filteredProducts}
            categories={categories}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Form Modal */}
        {isFormOpen && (
          <ProductForm
            product={selectedProduct}
            categories={categories}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </div>
    </div>
  );
}
