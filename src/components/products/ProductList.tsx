import { Trash2, Edit2 } from 'lucide-react';
import type { Product, Category } from '../../types';

interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductList({
  products,
  categories,
  onEdit,
  onDelete,
}: ProductListProps) {
  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) return '-';
    return categories.find((c) => c.id === categoryId)?.name || '-';
  };

  const getProductTypeLabel = (type: string): string => {
    switch (type) {
      case 'OWN_PRODUCTION':
        return 'Produksi';
      case 'RESELL':
        return 'Kulakan';
      case 'CONSIGNMENT':
        return 'Titipan';
      default:
        return type;
    }
  };

  const getProductTypeBadgeColor = (type: string): string => {
    switch (type) {
      case 'OWN_PRODUCTION':
        return 'bg-green-100 text-green-800';
      case 'RESELL':
        return 'bg-blue-100 text-blue-800';
      case 'CONSIGNMENT':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="flex-1 card overflow-hidden">
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-6xl mb-4">🍽️</span>
          <span className="text-xl font-semibold">Tidak ada produk</span>
          <p className="text-sm mt-2">Klik tombol "Tambah Produk" untuk membuat produk baru</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-bold text-slate-800">Produk</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Harga</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Kategori</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Tipe</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Status</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b border-slate-200 transition-colors hover:bg-orange-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{product.emoji || '🍽️'}</span>
                      <div>
                        <p className="font-bold text-slate-800">{product.name}</p>
                        {product.vendor_name && (
                          <p className="text-xs text-slate-500">dari {product.vendor_name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center px-6 py-4">
                    <p className="font-semibold text-slate-800">
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span className="text-slate-600 text-sm">
                      {getCategoryName(product.category_id)}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getProductTypeBadgeColor(
                        product.product_type
                      )}`}
                    >
                      {getProductTypeLabel(product.product_type)}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4 space-x-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-semibold text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(product)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors font-semibold text-sm"
                    >
                      <Trash2 size={16} />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
