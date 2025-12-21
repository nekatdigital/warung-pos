import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product, Category } from '../../types';
import { getVendors } from '../../services/data';
import type { Vendor } from '../../types';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: () => void;
}

export function ProductForm({
  product,
  categories,
  onClose,
  onSave,
}: ProductFormProps) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    emoji: '🍽️',
    category_id: '',
    product_type: 'OWN_PRODUCTION' as 'OWN_PRODUCTION' | 'RESELL' | 'CONSIGNMENT',
    vendor_id: '',
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      try {
        const vends = await getVendors();
        setVendors(vends);
      } catch (err) {
        console.error('Error loading vendors:', err);
      }
    };
    loadVendors();
  }, []);

  // Pre-fill form if editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        emoji: product.emoji || '🍽️',
        category_id: product.category_id || '',
        product_type: product.product_type,
        vendor_id: product.vendor_id || '',
        is_active: product.is_active,
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError('Nama produk harus diisi');
      return;
    }

    if (formData.price < 0) {
      setError('Harga tidak boleh negatif');
      return;
    }

    if (!formData.category_id) {
      setError('Kategori harus dipilih');
      return;
    }

    if (formData.product_type === 'CONSIGNMENT' && !formData.vendor_id) {
      setError('Vendor harus dipilih untuk tipe Titipan');
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement save logic
      console.log('Save form:', formData);
      // await createProduct/updateProduct
      onSave();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal menyimpan produk';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-slate-800">
            {product ? '✏️ Edit Produk' : '➕ Tambah Produk'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800">
              <p className="font-semibold">⚠️ {error}</p>
            </div>
          )}

          {/* Nama Produk */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Nasi Goreng"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Harga */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Harga (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              placeholder="Contoh: 15000"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Emoji */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Emoji</label>
            <input
              type="text"
              name="emoji"
              value={formData.emoji}
              onChange={handleChange}
              maxLength="2"
              placeholder="🍛"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold text-center text-4xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tipe Produk */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-3">
              Tipe Produk <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="product_type"
                  value="OWN_PRODUCTION"
                  checked={formData.product_type === 'OWN_PRODUCTION'}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-slate-700">
                  🍳 Produksi Sendiri
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="product_type"
                  value="RESELL"
                  checked={formData.product_type === 'RESELL'}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-slate-700">
                  📦 Kulakan / Resell
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="product_type"
                  value="CONSIGNMENT"
                  checked={formData.product_type === 'CONSIGNMENT'}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold text-slate-700">
                  🤝 Titip Jual
                </span>
              </label>
            </div>
          </div>

          {/* Vendor - Show only if CONSIGNMENT */}
          {formData.product_type === 'CONSIGNMENT' && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Vendor <span className="text-red-500">*</span>
              </label>
              <select
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">-- Pilih Vendor --</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="w-5 h-5"
              />
              <span className="text-sm font-semibold text-slate-700">Aktif</span>
            </label>
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
