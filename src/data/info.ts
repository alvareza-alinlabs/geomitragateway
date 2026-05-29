export const infoData = {
  appVersion: '1.0.0',
  releaseDate: '23 Mei 2026',
  developer: 'AlinLabs Indonesia',
  website: 'www.alinlabs.biz.id',
  email: 'office.alincorporation@gmail.com',
  phone: '081-00-70000-54',
  githubRepo: 'https://github.com/alvareza-alinlabs/geomitragateway/',
  productionDomain: 'geomitragateway.com',
  vercelDomain: 'https://geomitragateway.vercel.app',
  techStack: [
    { name: 'Frontend Framework', value: 'React 18 + Vite' },
    { name: 'Language', value: 'TypeScript' },
    { name: 'Styling', value: 'Tailwind CSS' },
    { name: 'Animations', value: 'Framer Motion' },
    { name: 'Routing', value: 'React Router v6' },
    { name: 'Icons', value: 'Lucide React' },
    { name: 'PDF Handling', value: 'React PDF' },
    { name: 'Map Rendering', value: 'Leaflet (React Leaflet)' },
  ],
  infrastructure: [
    { name: 'Version Control', value: 'GitHub Integration' },
    { name: 'Large File Storage', value: 'GitHub LFS (Gambar & Video Statis)' },
    { name: 'Hosting / Compute', value: 'Vercel Pro (Serverless)' },
    { name: 'Content Delivery / Edge', value: 'Cloudflare CDN' },
    { name: 'Primary Database', value: 'SQL Database (Cloud)' },
    { name: 'Fallback System', value: 'Local JSON Storage' },
    { name: 'File & Asset Storage', value: 'Cloudflare R2 Bucket' },
  ],
  deploymentFlow: [
    { 
      step: '1. Version Control', 
      detail: 'Pengembangan dilakukan secara berkala dan kode sumber push (git) ke repositori GitHub Private/Public.' 
    },
    { 
      step: '2. Continuous Integration', 
      detail: 'Vercel mendeteksi perubahan terbaru dari main branch GitHub dan memicu proses build secara otomatis.' 
    },
    { 
      step: '3. Build & Deploy', 
      detail: 'Vercel Pro melakukan instalasi dependensi, optimasi kode, dan mendistribusikan situs ke seluruh node serverless mereka.' 
    },
    { 
      step: '4. Edge & Domain', 
      detail: 'Aplikasi ter-routing melalui domain geomitragateway.vercel.app dan point ke domain utama geomitragateway.com via Cloudflare.' 
    }
  ],
  description: 'Aplikasi Geo Mitra Gateway adalah platform komprehensif yang dikembangkan oleh AlinLabs Indonesia untuk manajemen kemitraan, penjualan, dan penargetan. Dilengkapi dengan dasbor interaktif, manajemen pengguna, transaksi, dan e-kontrak, sistem ini dirancang untuk memaksimalkan produktivitas dan efisiensi operasional yang dikelola secara cloud-native terdistribusi.',
  features: [
    'Manajemen Mitra dan Klien Secara Real-Time',
    'Pelacakan Penjualan dan Pencapaian Target',
    'Pembuatan dan Pengelolaan Invoice Cerdas',
    'Penjadwalan Otomatis Appoinments Terintegrasi Peta',
    'Manajemen E-Kontrak Elektronik Berbasis Tanda Tangan Digital',
    'Penyimpanan Terdistribusi & Cadangan Data Multi-Lapisan',
    'Visualisasi Data Geospasial Interaktif',
    'Siaran Pesan (Broadcast) Terjadwal'
  ],
  databaseMechanisms: {
    title: 'Arsitektur Basis Data',
    details: [
      'Pendekatan Hybrid Database: Sistem mengimplementasikan strategi failover untuk menjamin kehandalan data.',
      'Primary SQL Database: Digunakan untuk struktur relasional dengan performa tinggi yang menangani modul pengguna, kontrak, dan operasional finansial secara cloud.',
      'JSON Fallback Recovery: Jika terdapat latensi transmisi atau konektivitas database yang terganggu, sistem memiliki mode fallback otomatis yang menulis data sebagai file JSON terstruktur serta melakukan sinkronisasi asinkron ketika jaringan pulih.',
      'Platform Pengiriman Cepat: Didukung oleh Vercel Pro untuk render compute node, sementara aset statis (seperti PDF Kontrak) ditangani oleh Cloudflare.'
    ]
  },
  emailAutomations: {
    title: 'Sistem Surat Elektronik Otomatis (EmailJS)',
    description: 'Aplikasi memanfaatkan EmailJS sebagai mesin otomasi pengiriman surel secara langsung dari klien tanpa memerlukan backend spesifik. Konfigurasi telah disesuaikan dengan infrastruktur komunikasi agar pesan bersifat interaktif, dua arah, dan tidak dianggap sebagai spam (bukan no-reply murni).',
    accounts: [
      {
        email: 'gmg.verifikasi@gmail.com',
        usage: 'Pengiriman OTP, konfirmasi pengajuan, notifikasi keamanan, & peringatan sistem operasional.'
      },
      {
        email: 'broadcast.gmg@gmail.com',
        usage: 'Pengiriman pesan massal (broadcast), buletin informasi mitra, & pengumuman terpusat.'
      }
    ],
    note: 'Kedua alamat email di atas berfungsi sebagai "Gateway Pengirim Dasar", namun integrasi balasan (Reply-to) telah dipetakan ke email utama (administrator pribadi) sehingga memastikan komunikasi tetap 2 arah secara organik.'
  },
  license: 'Hak Cipta © 2026 AlinLabs Indonesia. Semua Hak Dilindungi.',
};
