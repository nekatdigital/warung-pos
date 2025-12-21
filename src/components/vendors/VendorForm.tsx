import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Vendor } from '../../types';

interface VendorFormProps {
  vendor: Vendor | null;
  onClose: () => void;
  onSave: () => void;
}

export function VendorForm({
  vendor,
  onClose,
  onSave,
}: VendorFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form if editing
  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name,
        phone: vendor.phone || '',
      });
    }
  }, [vendor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Nama vendor harus diisi');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement save logic
      console.log('Save vendor:', formData);
      // await createVendor/updateVendor
      onSave();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan vendor';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800">
            {vendor ? '✏️ Edit Vendor' : '➕ Tambah Vendor'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          {/* Nama Vendor */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nama Vendor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Bu Siti"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Nomor Telepon */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nomor Telepon (Opsional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
