# 🍛 Warung POS - Progressive Web App (PWA)

Sistem kasir modern untuk warung makan dengan kemampuan **offline-first** menggunakan **Progressive Web App (PWA)**, **IndexedDB**, dan **localStorage**.

## ✨ Fitur Utama

### 🔌 Offline-First Architecture
- ✅ Bekerja **100% tanpa internet** setelah first load
- ✅ Data tersimpan secara **lokal** di perangkat
- ✅ Automatic sync ketika internet kembali
- ✅ Service Worker untuk caching & offline support

### 💾 Local-First Database
- **IndexedDB** untuk penyimpanan data transaksional (products, orders, categories)
- **localStorage** untuk authentication & settings
- **Dexie.js** untuk ORM yang mudah digunakan
- Export/Import data sebagai JSON backup

### 🔐 Authentication
- Login sederhana dengan localStorage
- Demo credentials: `kasir / 1234`
- User session management
- Logout dengan clear session

### 📱 Responsive Design
- **Desktop** (≥1024px) - Table layout dengan sidebar
- **Tablet** (768-1023px) - Collapsed sidebar dengan grid
- **Mobile** (<768px) - Full-screen dengan bottom sheet

### 📊 Fitur Kasir
- ✅ Add/remove/update item dari keranjang
- ✅ Filter produk per kategori
- ✅ Modal pembayaran dengan quick-pay options
- ✅ Hitung kembalian otomatis
- ✅ Sound effects untuk UX
- ✅ Order history & reporting

### 📈 Laporan & Analytics
- Laporan harian per tanggal
- Breakdown revenue by product type:
  - **Produksi Sendiri** (OWN_PRODUCTION)
  - **Kulakan** (RESELL)
  - **Titip Jual** (CONSIGNMENT)
- Vendor payout tracking
- Export laporan

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd warung-pos

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Aplikasi akan terbuka di `http://localhost:5173`

### Build untuk Production

```bash
# Build PWA
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── cashier/              # Komponen kasir
│   │   ├── CartPanel.tsx
│   │   ├── MenuGrid.tsx
│   │   └── PaymentModal.tsx
│   ├── transaction/          # Layout responsif
│   │   ├── DesktopLayout.tsx
│   │   ├── TabletLayout.tsx
│   │   └── MobileLayout.tsx
│   ├── reports/
│   │   └── DailyReport.tsx
│   ├── ErrorBoundary.tsx     # Error handling
│   └── pos/
│       └── pos.css
├── pages/
│   ├── CashierPage.tsx
│   ├── ReportPage.tsx
│   └── TransactionPage.tsx
├── services/
│   ├── db.ts                 # IndexedDB dengan Dexie
│   ├── data.ts               # Data access layer
│   ├── storage.ts            # localStorage service
│   ├── validation.ts         # Input validation
│   └── supabase.ts           # (Legacy - untuk reference)
├── types/
│   └── index.ts              # TypeScript interfaces
├── App.tsx                   # Main app dengan routing & auth
├── main.tsx                  # Entry point
└── index.css                 # Global styles

public/
├── manifest.webmanifest      # PWA manifest
├── pwa-*.png                 # PWA icons
└── sw.js                     # Service worker (auto-generated)
```

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 19.2 + TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **Build Tool** | Vite 7 |
| **Local Database** | Dexie.js (IndexedDB ORM) |
| **Storage** | localStorage (auth, settings) |
| **PWA** | vite-plugin-pwa |
| **Icons** | Lucide React |

## 🗄️ Database Schema (IndexedDB)

### Products
```typescript
{
  id: string
  name: string
  price: number
  emoji?: string
  product_type: 'OWN_PRODUCTION' | 'RESELL' | 'CONSIGNMENT'
  vendor_id?: string
  category_id?: string
  is_active: boolean
  created_at: string
}
```

### Orders
```typescript
{
  id: string
  total_amount: number
  cash_received?: number
  change_amount?: number
  order_date: string
  created_at: string
}
```

### Categories
```typescript
{
  id: string
  name: string
  sort_order: number
}
```

### Vendors
```typescript
{
  id: string
  name: string
  phone?: string
  created_at: string
}
```

## 📡 API Reference

### Data Service (`src/services/data.ts`)

#### Products
```typescript
getProducts(categoryId?: string): Promise<Product[]>
createProduct(product): Promise<Product | null>
updateProduct(id, product): Promise<Product | null>
deleteProduct(id): Promise<boolean>
```

#### Categories
```typescript
getCategories(): Promise<Category[]>
createCategory(name, sortOrder): Promise<Category | null>
```

#### Vendors
```typescript
getVendors(): Promise<Vendor[]>
createVendor(name, phone): Promise<Vendor | null>
```

#### Orders
```typescript
createOrder(totalAmount, cashReceived, changeAmount, cartItems): Promise<Order | null>
getOrdersForDate(date): Promise<Order[]>
```

#### Reports
```typescript
getDailyReport(date): Promise<DailyReportSummary>
getStatistics(): Promise<Statistics>
```

#### Data Management
```typescript
exportData(): Promise<ExportedData>
importData(data): Promise<void>
```

### Auth Service (`src/services/storage.ts`)

```typescript
authService.login(username, password): User | null
authService.logout(): void
authService.isAuthenticated(): boolean
authService.getUser(): User | null
authService.setToken(token): void
```

### Settings Service

```typescript
settingsService.getSettings(): UserSettings
settingsService.updateSetting(key, value): void
settingsService.toggleSound(): boolean
settingsService.togglePrintReceipt(): boolean
```

## 🔒 Environment Variables

Create `.env.local` from `.env.example`:

```env
# App Configuration
VITE_APP_NAME=Warung POS
VITE_APP_VERSION=1.0.0

# Database
VITE_DB_NAME=WarungPOS
VITE_DB_VERSION=1

# Feature Flags
VITE_ENABLE_OFFLINE_MODE=true
VITE_ENABLE_SOUND_EFFECTS=true
VITE_ENABLE_PRINT=true

# PWA
VITE_PWA_ENABLED=true
VITE_PWA_SCOPE=/

# Development
VITE_DEBUG=false
```

## 📱 PWA Installation

### Install on Mobile
1. Buka aplikasi di browser mobile
2. Tap menu (⋮) → "Add to Home Screen"
3. Pilih nama & icon
4. Aplikasi akan muncul di home screen seperti native app

### Install on Desktop
1. Klik icon install di address bar (Chrome)
2. Atau: Menu → "Install Warung POS"
3. Aplikasi akan terbuka di window terpisah

## 🔄 Offline Workflow

1. **First Load** → Download semua assets & service worker
2. **Offline Mode** → Aplikasi fully functional tanpa internet
3. **Data Persistence** → IndexedDB menyimpan semua transaksi
4. **Sync Queue** → Order ditandai pending ketika offline
5. **Auto-Sync** → Ketika internet kembali, auto-sync pending data

## ✅ Error Handling

Aplikasi memiliki multiple layers of error handling:

1. **Error Boundary** - Catch component errors
2. **Try-Catch** - Data operation errors
3. **Validation** - Input validation sebelum save
4. **User Feedback** - Error messages UI

## 🧪 Demo Data

Database di-initialize dengan demo data:

### Products (14 items)
- Makanan: Nasi Goreng, Mie Goreng, Nasi Ayam, Soto Ayam
- Minuman: Es Teh, Es Jeruk, Kopi, Aqua, Teh Pucuk, Sprite
- Camilan: Kerupuk, Gorengan, Peyek, Kopi Sachet

### Categories (3)
- Makanan
- Minuman
- Camilan

### Vendors (3)
- Bu Siti
- Pak Budi
- Bu Ani

### Demo Login
- **Username:** kasir
- **Password:** 1234

## 📦 Build & Deploy

### Production Build
```bash
npm run build
```

Output di `dist/` siap untuk deployment:

```bash
# Deploy ke static hosting
npm run build
# Copy dist/ ke server
```

### Environment untuk Production
```bash
cp .env.example .env.local
# Edit .env.local dengan production values
npm run build
```

## 🐛 Troubleshooting

### Database tidak terinisialisasi
```bash
# Clear browser storage
# DevTools → Application → Storage → Delete All

# Reload aplikasi
```

### Service Worker tidak update
```bash
# Clear browser cache
# Unregister service worker di DevTools
# Hard refresh (Ctrl+Shift+R atau Cmd+Shift+R)
```

### Offline mode tidak berfungsi
```bash
# Check DevTools → Network → Offline
# Check Service Worker di DevTools → Application
# Verifikasi vite-plugin-pwa configuration
```

## 📈 Roadmap

- [ ] Backend API integration (Supabase/Custom)
- [ ] Real-time sync dengan server
- [ ] Multi-user support
- [ ] Advanced inventory management
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Printer integration
- [ ] Receipt templates

## 📝 License

MIT License - Lihat LICENSE file

## 👥 Contributors

- **nekatdigital** - Original creator

## 📞 Support

Untuk issues atau suggestions, silakan buat issue di repository.

---

**Built with ❤️ for Indonesian Warung Owners**
