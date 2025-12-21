import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product, Category, Vendor } from '../../types';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialData: Product | null;
  categories: Category[];
  vendors: Vendor[];
}

interface FormData {
  name: string;
  price: number;
  emoji: string;
  category_id: string;
  product_type: 'OWN_PRODUCTION' | 'RESELL' | 'CONSIGNMENT';
  vendor_id: string;
  is_active: boolean;
}

export function ProductForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  categories,
  vendors,
}: ProductFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    price: 0,
    emoji: '📦',
    category_id: '',
    product_type: 'OWN_PRODUCTION',
    vendor_id: '',
    is_active: true,
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
          price: initialData.price,
          emoji: initialData.emoji || '📦',
          category_id: initialData.category_id || '',
          product_type: initialData.product_type,
          vendor_id: initialData.vendor_id || '',
          is_active: initialData.is_active,
        });
      } else {
        // Mode Tambah - reset ke default
        setFormData({
          name: '',
          price: 0,
          emoji: '📦',
          category_id: '',
          product_type: 'OWN_PRODUCTION',
          vendor_id: '',
          is_active: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Auto reset vendor_id jika tipe produk berubah dari CONSIGNMENT ke tipe lain
  useEffect(() => {
    if (formData.product_type !== 'CONSIGNMENT') {
      setFormData((prev) => ({
        ...prev,
        vendor_id: '',
      }));
    }
  }, [formData.product_type]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price'
          ? parseFloat(value) || 0
          : newValue,
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

    // Validasi Nama Produk
    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk harus diisi';
    }

    // Validasi Harga
    if (formData.price < 0) {
      newErrors.price = 'Harga tidak boleh negatif';
    }

    // Validasi Kategori
    if (!formData.category_id) {
      newErrors.category_id = 'Kategori harus dipilih';
    }

    // Validasi Vendor (hanya jika CONSIGNMENT)
    if (formData.product_type === 'CONSIGNMENT') {
      if (!formData.vendor_id) {
        newErrors.vendor_id = 'Vendor harus dipilih untuk tipe Titipan';
      }
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
      // Construct Product object to save
      const productToSave: Product = {
        ...(initialData || {}),
        name: formData.name,
        price: formData.price,
        emoji: formData.emoji || '📦',
        category_id: formData.category_id,
        product_type: formData.product_type,
        vendor_id: formData.product_type === 'CONSIGNMENT' ? formData.vendor_id : undefined,
        is_active: formData.is_active,
        id: initialData?.id || `prod_${Date.now()}`,
        created_at: initialData?.created_at || new Date().toISOString(),
      } as Product;

      // Call onSave dengan product object
      await onSave(productToSave);

      // Close modal after successful save
      onClose();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Gagal menyimpan produk';
      setErrors({ submit: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Return null jika modal tidak terbuka
  if (!isOpen) return null;

  const isEditMode = !!initialData;
  const showVendorField = formData.product_type === 'CONSIGNMENT';
  const isFormValid = !isSubmitting && Object.keys(errors).length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto py-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-auto">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-slate-800">
            {isEditMode ? '✏️ Edit Produk' : '➕ Tambah Produk Baru'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Submit Error Alert */}
          {errors.submit && (
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
              <p className="font-semibold">⚠️ {errors.submit}</p>
            </div>
          )}

          {/* ===== NAMA PRODUK ===== */}
          <div>
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Contoh: Nasi Goreng"
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

          {/* ===== HARGA ===== */}
          <div>
            <label htmlFor="price" className="block text-sm font-bold text-slate-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-semibold">Rp</span>
              <input
                id="price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="1000"
                placeholder="0"
                className={`flex-1 px-4 py-3 border rounded-lg font-semibold focus:outline-none focus:ring-2 transition-all ${
                  errors.price
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-slate-300 focus:ring-orange-500'
                }`}
              />
            </div>
            {errors.price && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.price}</p>
            )}
            {formData.price > 0 && (
              <p className="text-slate-500 text-xs mt-1">
                Rp {formData.price.toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {/* ===== EMOJI ===== */}
          <div>
            <label htmlFor="emoji" className="block text-sm font-bold text-slate-700 mb-2">
              Emoji <span className="text-slate-400">(Opsional)</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="emoji"
                type="text"
                name="emoji"
                value={formData.emoji}
                onChange={handleInputChange}
                maxLength="2"
                placeholder="📦"
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg font-semibold text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-4xl">{formData.emoji || '📦'}</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">
              Masukkan satu emoji. Jika kosong akan menggunakan 📦
            </p>
          </div>

          {/* ===== KATEGORI ===== */}
          <div>
            <label htmlFor="category_id" className="block text-sm font-bold text-slate-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg font-semibold focus:outline-none focus:ring-2 transition-all ${
                errors.category_id
                  ? 'border-red-300 focus:ring-red-500 bg-red-50'
                  : 'border-slate-300 focus:ring-orange-500'
              }`}
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category_id && (
              <p className="text-red-600 text-xs mt-1 font-semibold">{errors.category_id}</p>
            )}
          </div>

          {/* ===== TIPE PRODUK ===== */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Tipe Produk <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2.5 bg-slate-50 p-4 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="product_type"
                  value="OWN_PRODUCTION"
                  checked={formData.product_type === 'OWN_PRODUCTION'}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer accent-orange-600"
                />
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">🍳</span> Produksi Sendiri
                </span>
                <span className="text-xs text-slate-500 ml-auto">Warung membuat sendiri</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="product_type"
                  value="RESELL"
                  checked={formData.product_type === 'RESELL'}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer accent-orange-600"
                />
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">📦</span> Kulakan / Resell
                </span>
                <span className="text-xs text-slate-500 ml-auto">Warung membeli untuk dijual</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
                <input
                  type="radio"
                  name="product_type"
                  value="CONSIGNMENT"
                  checked={formData.product_type === 'CONSIGNMENT'}
                  onChange={handleInputChange}
                  className="w-4 h-4 cursor-pointer accent-orange-600"
                />
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span className="text-lg">🤝</span> Titip Jual
                </span>
                <span className="text-xs text-slate-500 ml-auto">Milik vendor, warung jual aja</span>
              </label>
            </div>
          </div>

          {/* ===== VENDOR (Conditional - hanya untuk CONSIGNMENT) ===== */}
          {showVendorField && (
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <label htmlFor="vendor_id" className="block text-sm font-bold text-slate-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg font-semibold focus:outline-none focus:ring-2 transition-all ${
                  errors.vendor_id
                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                    : 'border-amber-300 focus:ring-orange-500'
                }`}
              >
                <option value="">-- Pilih Vendor --</option>
                {vendors.length === 0 ? (
                  <option disabled>Tidak ada vendor tersedia</option>
                ) : (
                  vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} {v.phone ? `(${v.phone})` : ''}
                    </option>
                  ))
                )}
              </select>
              {errors.vendor_id && (
                <p className="text-red-600 text-xs mt-1 font-semibold">{errors.vendor_id}</p>
              )}
              <p className="text-amber-700 text-xs mt-2 font-semibold">
                💡 Produk ini milik vendor. Pastikan vendor sudah terdaftar di Kelola Vendor.
              </p>
            </div>
          )}

          {/* ===== STATUS ===== */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="w-4 h-4 cursor-pointer accent-orange-600"
              />
              <span className="text-sm font-semibold text-slate-700">
                Produk Aktif{' '}
                <span className="text-slate-500 font-normal">
                  (dapat dijual di kasir)
                </span>
              </span>
            </label>
            {!formData.is_active && (
              <p className="text-amber-700 text-xs mt-2 font-semibold">
                ⚠️ Produk nonaktif tidak akan muncul di halaman Kasir.
              </p>
            )}
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
                <>💾 {isEditMode ? 'Perbarui Produk' : 'Tambah Produk'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
