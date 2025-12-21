import { useState, useEffect } from 'react';
import { VendorList } from '../components/vendors/VendorList';
import { VendorForm } from '../components/vendors/VendorForm';
import { getVendors } from '../services/data';
import type { Vendor } from '../types';

export function VendorPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      const vends = await getVendors();
      setVendors(vends);
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

  const handleFormSave = async () => {
    await loadData();
    handleFormClose();
  };

  const handleDelete = async (vendor: Vendor) => {
    if (confirm(`Hapus vendor "${vendor.name}"?`)) {
      try {
        // Delete logic will be here
        setError('Delete functionality coming soon');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to delete vendor';
        setError(errorMsg);
      }
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
        {error && (
          <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
            <p className="font-semibold">⚠️ Error: {error}</p>
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
