# 🚀 Quick Start Guide - Warung POS PWA

## Installation & Setup (5 menit)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Start development server
npm run dev
```

Aplikasi akan open di `http://localhost:5173`

---

## 🔐 Login

Gunakan demo credentials:
- **Username:** `kasir`
- **Password:** `1234`

---

## 💡 Demo Features

### Kasir (POS)
1. Klik produk untuk add ke keranjang
2. Update kuantitas dengan tombol +/-
3. Klik "Bayar" untuk checkout
4. Input jumlah uang tunai
5. Sistem hitung kembalian otomatis

### Laporan
1. Pilih tanggal laporan
2. Lihat breakdown revenue:
   - 🏠 Milik Warung (Produksi + Kulakan)
   - 🤝 Uang Titipan (untuk vendor)
3. Detail vendor payouts

### Pengaturan
- PWA Status
- Data Management (export/import)
- System Info

---

## 🗂️ Demo Data

Sudah pre-loaded di database:

### Products (14)
- **Makanan:** Nasi Goreng, Mie Goreng, Nasi Ayam, Soto Ayam
- **Minuman:** Es Teh, Es Jeruk, Kopi, Aqua, Teh Pucuk, Sprite
- **Camilan:** Kerupuk, Gorengan, Peyek, Kopi Sachet

### Vendors (3)
- Bu Siti
- Pak Budi
- Bu Ani

---

## 📱 Test Features

### Mobile View
1. Reduce browser width < 768px
2. Lihat bottom navigation
3. Click "Pesoran" untuk open cart sheet

### Tablet View
1. Set width 768-1023px
2. Lihat collapsed sidebar
3. Grid products dengan 3 columns

### Desktop View
1. Set width > 1024px
2. Full sidebar + table layout
3. Professional POS interface

---

## 🌐 Offline Testing

### Simulate Offline
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh page
5. App tetap berfungsi!

### Create Offline Order
1. While offline: Add products & checkout
2. Order saved ke IndexedDB
3. Go back online
4. Check laporan → order tetap ada

---

## 🛠️ Development

### File Structure Key
```
src/
├── pages/           # Main pages
├── components/      # React components
├── services/        # Business logic
│   ├── db.ts       # IndexedDB
│   ├── data.ts     # Data layer
│   ├── storage.ts  # Auth
│   └── validation.ts
├── types/          # TypeScript types
└── App.tsx         # Main app
```

### Common Tasks

#### Add New Product
```typescript
import { createProduct } from '@/services/data';

const newProduct = await createProduct({
  name: 'Bakso',
  price: 10000,
  emoji: '🍡',
  product_type: 'OWN_PRODUCTION',
  category_id: '1',
  is_active: true,
});
```

#### Get Products
```typescript
import { getProducts } from '@/services/data';

const products = await getProducts();
const makan = await getProducts('1'); // By category
```

#### Create Order
```typescript
import { createOrder } from '@/services/data';

const order = await createOrder(
  totalAmount,
  cashReceived,
  changeAmount,
  cartItems
);
```

#### Get Daily Report
```typescript
import { getDailyReport } from '@/services/data';

const report = await getDailyReport('2025-12-20');
```

---

## 🔍 Debugging

### Check IndexedDB
1. DevTools → Application → IndexedDB
2. Click "WarungPOS" database
3. Explore tables (products, orders, etc)

### Check localStorage
1. DevTools → Application → Local Storage
2. Find `http://localhost:5173`
3. View keys:
   - `warung_auth_token`
   - `warung_user`
   - `warung_settings`
   - `warung_sync_status`

### Check Service Worker
1. DevTools → Application → Service Workers
2. Should see registered SW
3. Check "Offline" checkbox to test

### Console Logs
Semua operations log ke console:
```
✅ Database initialized with demo data
✅ Product created: prod_1234567890
✅ Order created: order_1234567890
✅ User kasir logged in
```

---

## 🎨 Customization

### Change Colors
Edit `src/index.css` CSS variables:
```css
:root {
  --color-primary: #E05D34;      /* Orange */
  --color-secondary: #2D3748;    /* Dark */
  --color-danger: #C0392B;       /* Red */
}
```

### Add New Category
```typescript
import { createCategory } from '@/services/data';

const category = await createCategory('Dessert', 4);
```

### Change Demo Credentials
Edit `src/App.tsx` LoginPage defaults:
```typescript
const [username, setUsername] = useState('kasir');  // Change this
const [password, setPassword] = useState('1234');    // Change this
```

---

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

Output: `dist/` folder ready to deploy

### Preview Production
```bash
npm run preview
```

### Deploy Steps
1. Run `npm run build`
2. Upload `dist/` folder to hosting:
   - Vercel: `vercel deploy`
   - Netlify: `netlify deploy`
   - Manual: FTP/SFTP `dist/` files

---

## ⚡ Performance Tips

### Faster Loading
```bash
# Build optimized
npm run build

# Use preview to test
npm run preview
```

### Reduce Bundle Size
- Tree-shake unused imports
- Lazy load heavy components
- Optimize images

### Offline Performance
- First load takes 30-60s (caches assets)
- Subsequent loads instant (< 2s)
- Offline fully instant

---

## 🐛 Troubleshooting

### App won't load
```bash
# Clear browser storage
DevTools → Application → Storage → Delete All

# Hard refresh
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

### Data not showing
```bash
# Check IndexedDB exists
DevTools → Application → IndexedDB → WarungPOS

# Check console for errors
DevTools → Console (look for ❌)
```

### Offline not working
```bash
# Verify Service Worker registered
DevTools → Application → Service Workers

# Check vite-plugin-pwa config
cat vite.config.ts
```

### Authentication failed
```bash
# Clear auth token
localStorage.removeItem('warung_auth_token');
localStorage.removeItem('warung_user');

# Refresh & try login again
```

---

## 📚 Additional Resources

- [README_PWA.md](./README_PWA.md) - Full PWA documentation
- [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) - Architecture details
- [Dexie.js Docs](https://dexie.org) - IndexedDB ORM
- [vite-plugin-pwa](https://vite-plugin-pwa.netlify.app/) - PWA plugin

---

## ✅ What's Working

- ✅ Login/Logout
- ✅ Add products to cart
- ✅ Checkout & payment
- ✅ Order history
- ✅ Daily reports
- ✅ Offline mode
- ✅ Responsive design
- ✅ Error handling
- ✅ Data persistence
- ✅ PWA installation

---

## 🎯 Next Steps

1. **Test offline mode** - Disconnect internet & use app
2. **Try mobile** - Open in phone & "Add to Home Screen"
3. **Create orders** - Test full checkout flow
4. **Check reports** - View laporan with your test data
5. **Customize** - Adjust colors, credentials, etc

---

## 📞 Support

Found a bug? Have a question?
- Check console (F12 → Console tab)
- Read error messages carefully
- Check IndexedDB data
- Review Service Worker status

---

**Ready to use Warung POS? Let's go! 🚀**

Happy cashiering! 🍛
