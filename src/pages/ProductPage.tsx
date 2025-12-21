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
      setSuccessMessage(null);
      const [prods, cats, vends] = await Promise.all([
        getProducts(),
        getCategories(),
        getVendors(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setVendors(vends);
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

  const handleFormSave = async (product: Product) => {
    try {
      setError(null);

      if (selectedProduct) {
        // Edit mode - update existing product
        const updated = await updateProduct(selectedProduct.id, product);
        if (updated) {
          setSuccessMessage(`✅ Produk "${product.name}" berhasil diperbarui`);
        }
      } else {
        // Add mode - create new product
        const created = await createProduct({
          name: product.name,
          price: product.price,
          emoji: product.emoji,
          product_type: product.product_type,
          category_id: product.category_id,
          vendor_id: product.vendor_id,
          is_active: product.is_active,
        });
        if (created) {
          setSuccessMessage(`✅ Produk "${product.name}" berhasil ditambahkan`);
        }
      }

      // Reload data and close form
      await loadData();
      handleFormClose();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan produk';
      setError(errorMsg);
      console.error('❌ Error saving product:', err);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmDelete = confirm(
      `Hapus produk "${product.name}"?\n\nProduk akan dinonaktifkan dan tidak akan muncul di kasir.`
    );

    if (!confirmDelete) return;

    try {
      setError(null);
      const deleted = await deleteProduct(product.id);
      if (deleted) {
        setSuccessMessage(`✅ Produk "${product.name}" berhasil dihapus`);
        await loadData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(errorMsg);
      console.error('❌ Error deleting product:', err);
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800 animate-in fade-in">
            <p className="font-semibold">⚠️ {error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-300 p-4 rounded-lg text-green-800 animate-in fade-in">
            <p className="font-semibold">{successMessage}</p>
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
