import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import 'leaflet/dist/leaflet.css';
import { LanguageProvider } from './lib/LanguageContext.tsx';
import { queryD1 } from './lib/cloudflare-client';

const originalFetch = window.fetch;

const fetchCache = new Map<string, { jsonString: string, timestamp: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes default
const REALTIME_FILES = ['schedules.json', 'transactions.json', 'broadcasts.json']; // bypass cache

function getIndonesianPageName(pathname: string): string {
  if (pathname === '/' || pathname === '/index.html') return 'Landing Page';
  if (pathname === '/dashboard' || pathname === '/dashboard/') return 'Beranda';
  if (pathname.includes('/dashboard/transactions')) return 'Transaksi';
  if (pathname.includes('/dashboard/partners')) return 'Mitra';
  if (pathname.includes('/dashboard/sales')) return 'Sales';
  if (pathname.includes('/dashboard/products')) return 'Produk';
  if (pathname.includes('/dashboard/targeting')) return 'Targeting';
  if (pathname.includes('/dashboard/schedule')) return 'Jadwal';
  if (pathname.includes('/dashboard/broadcast')) return 'Broadcast';
  if (pathname.includes('/dashboard/access')) return 'Akses';
  if (pathname.includes('/login')) return 'Login';
  if (pathname.includes('/appointment')) return 'Janji Temu';
  if (pathname.includes('/client')) return 'Detail Klien';
  return 'Aplikasi';
}

function getEntityName(filename: string): string {
  switch (filename) {
    case 'broadcasts.json': return 'Broadcasts';
    case 'schedules.json': return 'Schedules';
    case 'users.json': return 'Users';
    case 'products.json': return 'Products';
    case 'targeting.json': return 'Targeting';
    case 'transactions.json': return 'Transactions';
    case 'landing.json': return 'LandingConfig';
    case 'sales.json': return 'Sales';
    case 'partners.json': return 'Partners';
    default: return filename;
  }
}

(window as any).clearAppCache = () => {
  console.log('[Cache] Mengosongkan cache aplikasi karena ada perubahan data.');
  fetchCache.clear();
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
     const key = localStorage.key(i);
     if (key && key.startsWith('local_cache_')) {
        keysToRemove.push(key);
     }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
};

function tryParseJSON(val: any) {
  if (typeof val === 'string' && (val.startsWith('{') || val.startsWith('['))) {
    try { return JSON.parse(val); } catch (e) { return val; }
  }
  return val;
}

Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable: true,
  value: async (...args: Parameters<typeof originalFetch>) => {
    const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
    
    if (url.includes('/data/')) {
      const filename = url.split('/').pop()?.split('?')[0];
      if (!filename) return originalFetch.apply(window, args);
      
      // Map filename to SQL table
      let query = '';
      let isLanding = false;
      
      switch (filename) {
        case 'broadcasts.json': query = 'SELECT * FROM broadcasts'; break;
        case 'schedules.json': query = 'SELECT * FROM schedules'; break;
        case 'users.json': query = 'SELECT * FROM users'; break;
        case 'products.json': query = 'SELECT * FROM products'; break;
        case 'targeting.json': query = 'SELECT * FROM targets'; break;
        case 'transactions.json': query = 'SELECT * FROM transactions'; break;
        case 'landing.json': query = 'SELECT * FROM landing_config'; isLanding = true; break;
        case 'sales.json': query = "SELECT * FROM clients WHERE tipe = 'Sales'"; break;
        case 'partners.json': query = "SELECT * FROM clients WHERE tipe != 'Sales'"; break;
      }
      
      if (query) {
        const isRealtime = REALTIME_FILES.includes(filename);
        const cached = fetchCache.get(filename);
        const now = Date.now();
        
        // Use cache if available, valid, and not purely real-time
        if (!isRealtime && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
          const pageName = getIndonesianPageName(window.location.pathname);
          const entityName = getEntityName(filename);
          console.log(`[Cache Memori] Menyajikan ${entityName} di halaman ${pageName}`);
          return new Response(cached.jsonString, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }

        const pageName = getIndonesianPageName(window.location.pathname);
        const entityName = getEntityName(filename);
        
        // Cek LocalStorage sebagai fallback cache tingkat dua
        const localCacheKey = `local_cache_${filename}`;
        const localCached = localStorage.getItem(localCacheKey);
        const localCacheTime = localStorage.getItem(`${localCacheKey}_time`);
        if (!isRealtime && localCached && localCacheTime && (now - Number(localCacheTime) < CACHE_TTL_MS)) {
           console.log(`[Cache Storage] Menyajikan ${entityName} di halaman ${pageName}`);
           // Pindahkan ke memory cache agar akses selanjutnya lebih cepat
           fetchCache.set(filename, { jsonString: localCached, timestamp: Number(localCacheTime) });
           return new Response(localCached, {
             status: 200,
             headers: { 'Content-Type': 'application/json' }
           });
        }

        console.log(`[Permintaan] Mengambil data ${entityName} di halaman ${pageName}`);
        
        try {
          let rawData = await queryD1(query);
          
          if (rawData && typeof rawData === 'object' && !Array.isArray(rawData)) {
            if (Array.isArray(rawData.results)) {
              rawData = rawData.results;
            } else if (Array.isArray(rawData.result)) {
              rawData = rawData.result;
            } else if (Array.isArray(rawData.data)) {
              rawData = rawData.data;
            } else {
              rawData = [];
            }
          }

          let parsed: any = (Array.isArray(rawData) ? rawData : []).map((item: any) => {
             const newItem = { ...item };
             for (const key in newItem) {
               newItem[key] = tryParseJSON(newItem[key]);
             }
             return newItem;
          });
          
          if (isLanding) {
             if (parsed.length > 0) {
               parsed = parsed[0].config_json; 
             } else {
               parsed = {};
             }
          }
          
          console.log(`[Sukses] D1 SQL ${entityName} di halaman ${pageName}`);
          
          const jsonResponse = JSON.stringify(parsed);
          
          // Save to memory cache limit to prevent bloat (max 20 keys)
          if (fetchCache.size > 20) {
             const firstKey = fetchCache.keys().next().value;
             // @ts-ignore
             fetchCache.delete(firstKey);
          }
          fetchCache.set(filename, { jsonString: jsonResponse, timestamp: now });

          // Save to localStorage
          try {
            if (!isRealtime) {
              localStorage.setItem(localCacheKey, jsonResponse);
              localStorage.setItem(`${localCacheKey}_time`, now.toString());
            }
          } catch(e) {
             console.warn("Local storage quota exceeded, clearing old caches");
             // Minimal garbage collection manually for our keys
             const keysToRemove = [];
             for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('local_cache_')) {
                   keysToRemove.push(key);
                }
             }
             keysToRemove.forEach(k => localStorage.removeItem(k));
             // Try to save again after clearing
             try {
                localStorage.setItem(localCacheKey, jsonResponse);
                localStorage.setItem(`${localCacheKey}_time`, now.toString());
             } catch(e2) {
                // If it still fails, the single response is larger than the whole quota
                console.warn("Payload size exceeds LocalStorage limits entirely.");
             }
          }
          
          parsed = null; // Help Garbage Collection
          rawData = null;
          
          return new Response(jsonResponse, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (err) {
          console.warn(`[Fallback] file lokal ${filename} di halaman ${pageName}`);
        }
      }
    }

    // Capture standard fetch requests for custom fallback or tracking if needed
    // We can also clear cache if there is a modify request, assuming they might use fetch to save later
    const fetchArgsUrl = typeof args[0] === 'string' ? args[0] : (args[0] && (args[0] as Request).url ? (args[0] as Request).url : '');
    const isD1Query = fetchArgsUrl.includes('/api/query') || fetchArgsUrl.includes('nominatim') || fetchArgsUrl.includes('bigdatacloud');
    
    if (!isD1Query && args[1] && args[1].method && !['GET', 'HEAD'].includes(args[1].method.toUpperCase())) {
      console.log(`[Mutasi] Mengosongkan cache karena ada perubahan data`);
      fetchCache.clear();
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
         const key = localStorage.key(i);
         if (key && key.startsWith('local_cache_')) {
            keysToRemove.push(key);
         }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    }

    return originalFetch.apply(window, args);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
