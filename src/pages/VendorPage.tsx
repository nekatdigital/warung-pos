import { useState, useEffect } from 'react';
import { VendorList } from '../components/vendors/VendorList';
import { VendorForm } from '../components/vendors/VendorForm';
import { getVendors, createVendor, updateVendor, deleteVendor, getProducts } from '../services/data';
import type { Vendor, Product } from '../types';

export function VendorPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      const [vends, prods] = await Promise.all([
        getVendors(),
        getProducts(),
      ]);
      setVendors(vends);
      setProducts(prods);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load vendors';
      setError(errorMsg);
      console.error('❌ Error loading vendors:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedVendor(null);
  };

  const handleFormSave = async (vendor: Vendor) => {
    try {
      setError(null);

      if (selectedVendor) {
        // Edit mode - update existing vendor
        const updated = await updateVendor(selectedVendor.id, vendor);
        if (updated) {
          setSuccessMessage(`✅ Vendor "${vendor.name}" berhasil diperbarui`);
        }
      } else {
        // Add mode - create new vendor
        const created = await createVendor(vendor.name, vendor.phone);
        if (created) {
          setSuccessMessage(`✅ Vendor "${vendor.name}" berhasil ditambahkan`);
        }
      }

      // Reload data and close form
      await loadData();
      handleFormClose();

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan vendor';
      setError(errorMsg);
      console.error('❌ Error saving vendor:', err);
    }
  };

  const handleDelete = async (vendor: Vendor) => {
    // Check if vendor has active products
    const vendorProducts = products.filter(
      (p) => p.vendor_id === vendor.id && p.is_active
    );

    if (vendorProducts.length > 0) {
      setError(
        `❌ Tidak bisa menghapus vendor karena masih memiliki ${vendorProducts.length} produk aktif. Silakan edit produk terlebih dahulu.`
      );
      return;
    }

    const confirmDelete = confirm(
      `Hapus vendor "${vendor.name}"?\n\nTindakan ini tidak dapat dibatalkan.`
    );

    if (!confirmDelete) return;

    try {
      setError(null);
      const deleted = await deleteVendor(vendor.id);
      if (deleted) {
        setSuccessMessage(`✅ Vendor "${vendor.name}" berhasil dihapus`);
        await loadData();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete vendor';
      setError(errorMsg);
      console.error('❌ Error deleting vendor:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ backgroundColor: '#F9F7F5' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🤝</div>
          <p className="text-lg font-semibold text-slate-600">Loading vendor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6" style={{ backgroundColor: '#F9F7F5' }}>
      <div className="max-w-2xl mx-auto px-4 space-y-4">
        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800 animate-in fade-in">
            <p className="font-semibold">{error}</p>
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
          <h1 className="text-3xl font-bold text-slate-800">🤝 Kelola Vendor</h1>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors text-lg"
          >
            ➕ Tambah Vendor
          </button>
        </div>

        {/* Vendor List */}
        <VendorList
          vendors={vendors}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Form Modal */}
        {isFormOpen && (
          <VendorForm
            vendor={selectedVendor}
            onClose={handleFormClose}
            onSave={handleFormSave}
          />
        )}
      </div>
    </div>
  );
}
