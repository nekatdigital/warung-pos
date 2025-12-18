import type { Product } from '../../types';

interface MenuGridProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
    selectedCategory: string | null;
    onCategoryChange: (categoryId: string | null) => void;
    categories: { id: string; name: string }[];
}

export function MenuGrid({
    products,
    onAddToCart,
    selectedCategory,
    onCategoryChange,
    categories,
}: MenuGridProps) {
    // Filter products by category
    const filteredProducts = selectedCategory
        ? products.filter((p) => p.category_id === selectedCategory)
        : products;

    // Play beep sound on click
    const playBeep = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp+XjHlwa3SDkZaUi35yamV0gIqQj4Z6bmRodICJjo2Ee29maGyAiIyKgXdtZWlugIeLiX93bGVpcYCGiYd9dGtkaXF/hYeEenFpZGpyf4SFgndvZ2VrdH+DhIB1bmZlbHV/goN/c21lZm53f4GCfXFsZWZueX+Bgntwa2VnbnqAgX97b2plZ297gICAfm5qZWdwfICAgH1uamVocX2AgH99bmplZ3J+gYB+fW5qZWhzfoCAfnxuamVodH6AgH58bWplZ3V+gX99fG1qZWh1f4F/fXxsamZndX+Bf318bGpmZ3Z/gX99fGxqZWd2f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZmd4f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZmd4f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZmd4f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZmd4f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZmd4f4F/fXxramZneH+Bf318a2pmZ3h/gX99fGtqZg==');
        audio.volume = 0.3;
        audio.play().catch(() => { }); // Ignore errors if audio is blocked
    };

    const handleClick = (product: Product) => {
        playBeep();
        onAddToCart(product);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Category Tabs */}
            <div className="flex gap-2 p-4 border-b border-slate-200 bg-white overflow-x-auto">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`category-tab whitespace-nowrap ${selectedCategory === null ? 'active' : ''
                        }`}
                >
                    Semua
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={`category-tab whitespace-nowrap ${selectedCategory === cat.id ? 'active' : ''
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: '#F9F7F5' }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredProducts.map((product) => (
                        <button
                            key={product.id}
                            onClick={() => handleClick(product)}
                            className="menu-item"
                        >
                            {/* Emoji or Image */}
                            <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-5xl mb-3">
                                {product.emoji || '🍽️'}
                            </div>

                            {/* Product Name */}
                            <span className="font-bold text-lg text-center text-slate-800 leading-tight">
                                {product.name}
                            </span>

                            {/* Price */}
                            <span className="text-slate-500 font-medium mt-1">
                                Rp {product.price.toLocaleString('id-ID')}
                            </span>

                            {/* Consignment Badge */}
                            {product.product_type === 'CONSIGNMENT' && product.vendor_name && (
                                <span className="badge-consignment mt-2">
                                    Titipan {product.vendor_name}
                                </span>
                            )}

                            {/* Resell Badge */}
                            {product.product_type === 'RESELL' && (
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 font-semibold">
                                    Kulakan
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                        <span className="text-6xl mb-4">🍽️</span>
                        <span className="text-xl">Tidak ada produk</span>
                    </div>
                )}
            </div>
        </div>
    );
}
