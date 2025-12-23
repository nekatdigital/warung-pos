import { Trash2, Edit2, Eye } from 'lucide-react';
import type { Vendor } from '../../types';

interface VendorListProps {
  vendors: Vendor[];
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendor: Vendor) => void;
}

export function VendorList({
  vendors,
  onEdit,
  onDelete,
}: VendorListProps) {
  return (
    <div className="card overflow-hidden">
      {vendors.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <span className="text-6xl mb-4">🤝</span>
          <span className="text-xl font-semibold">Tidak ada vendor</span>
          <p className="text-sm mt-2">Klik tombol "Tambah Vendor" untuk membuat vendor baru</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="text-left px-6 py-4 font-bold text-slate-800">Nama Vendor</th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">
                  Nomor Telepon
                </th>
                <th className="text-center px-6 py-4 font-bold text-slate-800">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr
                  key={vendor.id}
                  className={`border-b border-slate-200 transition-colors hover:bg-orange-50 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                  }`}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-800">{vendor.name}</p>
                      <p className="text-xs text-slate-500">ID: {vendor.id}</p>
                    </div>
                  </td>
                  <td className="text-center px-6 py-4">
                    <p className="text-slate-700 font-semibold">
                      {vendor.phone || '-'}
                    </p>
                  </td>
                  <td className="text-center px-6 py-4 space-x-2">
                    <button
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors font-semibold text-sm"
                      title="Lihat produk vendor"
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button
                      onClick={() => onEdit(vendor)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors font-semibold text-sm"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(vendor)}
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
