import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Vendor } from '../../types';

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vendor: Vendor) => void;
  initialData: Vendor | null;
}

interface FormData {
  name: string;
  phone: string;
}

export function VendorForm({
  isOpen,
  onClose,
  onSave,
  initialData,
}: VendorFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form ketika modal dibuka atau initialData berubah
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Mode Edit - isi form dengan data existing
        setFormData({
          name: initialData.name,
          phone: initialData.phone || '',
        });
      } else {
        // Mode Tambah - reset ke default
        setFormData({
          name: '',
          phone: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error untuk field yang sedang diubah
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validasi Nama Vendor
    if (!formData.name.trim()) {
      newErrors.name = 'Nama vendor harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Construct Vendor object to save
      const vendorToSave: Vendor = {
        ...(initialData || {}),
        name: formData.name,
        phone: formData.phone || undefined,
        id: initialData?.id || `vendor_${Date.now()}`,
        created_at: initialData?.created_at || new Date().toISOString(),
      } as Vendor;

      // Call onSave dengan vendor object
      await onSave(vendorToSave);

      // Close modal after successful save
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Gagal menyimpan vendor';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return null jika modal tidak terbuka
  if (!isOpen) return null;

  const isEditMode = !!initialData;
  const isFormValid = !isSubmitting && Object.keys(errors).length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-auto">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 rounded-t-2xl bg-white">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditMode ? '✏️ Edit Vendor' : '➕ Tambah Vendor Baru'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* ===== FORM CONTENT ===== */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Submit Error Alert */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
              <p className="font-semibold">⚠️ {errors.submit}</p>
            </div>
          )}

          {/* ===== NAMA VENDOR ===== */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
              Nama Vendor <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Bu Siti, Pak Budi"
              className={`w-full px-4 py-3 border rounded-lg font-semibold focus:outline-none focus:ring-2 transition-all ${
                errors.name
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-slate-300 focus:ring-orange-500'
              }`}
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.name}</p>
            )}
          </div>

          {/* ===== NOMOR TELEPON ===== */}
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
              Nomor Telepon <span className="text-slate-400">(Opsional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <p className="text-slate-500 text-xs mt-1">
              Gunakan untuk menghubungi vendor terkait pembayaran/masalah.
            </p>
          </div>

          {/* ===== BUTTON ACTIONS ===== */}
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span> Menyimpan...
                </>
              ) : (
                <>💾 {isEditMode ? 'Perbarui Vendor' : 'Tambah Vendor'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
