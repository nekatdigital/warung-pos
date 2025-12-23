import type { Category } from '../../types';

interface ProductFiltersProps {
  categories: Category[];
  filterCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  filterType: string | null;
  onTypeChange: (type: string | null) => void;
  filterStatus: 'all' | 'active' | 'inactive';
  onStatusChange: (status: 'all' | 'active' | 'inactive') => void;
}

export function ProductFilters({
  categories,
  filterCategory,
  onCategoryChange,
  filterType,
  onTypeChange,
  filterStatus,
  onStatusChange,
}: ProductFiltersProps) {
  return (
    <aside className="w-64 card p-6 space-y-6 h-fit sticky top-20">
      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-lg">📋 Kategori</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${
              filterCategory === null
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${
                filterCategory === cat.id
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-lg">🏷️ Tipe Produk</h3>
        <div className="space-y-2">
          <button
            onClick={() => onTypeChange(null)}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${
              filterType === null
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Tipe
          </button>
          <button
            onClick={() => onTypeChange('OWN_PRODUCTION')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filterType === 'OWN_PRODUCTION'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">🍳</span> Produksi
          </button>
          <button
            onClick={() => onTypeChange('RESELL')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filterType === 'RESELL'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">📦</span> Kulakan
          </button>
          <button
            onClick={() => onTypeChange('CONSIGNMENT')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filterType === 'CONSIGNMENT'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="text-lg">🤝</span> Titipan
          </button>
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <h3 className="font-bold text-slate-800 mb-3 text-lg">✓ Status</h3>
        <div className="space-y-2">
          <button
            onClick={() => onStatusChange('all')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors ${
              filterStatus === 'all'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Semua Status
          </button>
          <button
            onClick={() => onStatusChange('active')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filterStatus === 'active'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span> Aktif
          </button>
          <button
            onClick={() => onStatusChange('inactive')}
            className={`w-full text-left px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              filterStatus === 'inactive'
                ? 'bg-orange-100 text-orange-700'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span> Nonaktif
          </button>
        </div>
      </div>
    </aside>
  );
}
