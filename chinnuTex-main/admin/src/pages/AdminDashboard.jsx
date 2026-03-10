import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    pending: 0,
    lowStock: [],
    inventorySummary: { products: 0, sizing: 0, weaving: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [bookingsRes, paymentsRes, productsRes, sizingRes, weavingRes] = await Promise.all([
          api.get('/admin/bookings'),
          api.get('/admin/payments'),
          api.get('/products'),
          api.get('/pricing/sizing/all'),
          api.get('/pricing/weaving/all')
        ]);

        const bookings = bookingsRes.data;
        const payments = paymentsRes.data;
        const products = productsRes.data;
        const sizing = sizingRes.data;
        const weaving = weavingRes.data;

        // Stats calculation
        const totalBookings = bookings.length;
        const totalRevenue = payments.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0);
        const pendingBookings = bookings.filter((b) => b.status === 'pending').length;

        // Inventory calculation
        const lowStockItems = [];
        const threshold = 10;

        products.forEach(p => { if (p.stockQuantity < threshold) lowStockItems.push({ name: p.name, stock: p.stockQuantity, type: 'Product' }); });
        sizing.forEach(s => { if (s.stockQuantity < threshold) lowStockItems.push({ name: s.yarnType, stock: s.stockQuantity, type: 'Yarn' }); });
        weaving.forEach(w => { if (w.stockQuantity < threshold) lowStockItems.push({ name: w.fabricType, stock: w.stockQuantity, type: 'Fabric' }); });

        setStats({
          bookings: totalBookings,
          revenue: totalRevenue,
          pending: pendingBookings,
          lowStock: lowStockItems,
          inventorySummary: {
            products: products.reduce((acc, p) => acc + (p.stockQuantity || 0), 0),
            sizing: sizing.reduce((acc, s) => acc + (s.stockQuantity || 0), 0),
            weaving: weaving.reduce((acc, w) => acc + (w.stockQuantity || 0), 0)
          }
        });
      } catch (err) {
        console.error('Failed to load stats', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-8 text-white/40">Loading dashboard...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-white/25 font-semibold">Admin Overview</p>
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold gradient-text">Dashboard</h1>
            <span className="bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-emerald animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]" /> LIVE
            </span>
          </div>
          <p className="text-white/40">Stock levels and booking throughput are monitored in real-time.</p>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {/* Inventory card */}
          <div className="glass-card-hover p-6 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/30">Inventory Status</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">Total Units</span>
              </div>
              <p className="text-4xl font-extrabold text-white group-hover:text-neon-cyan transition-colors">
                {stats.inventorySummary.products + stats.inventorySummary.sizing + stats.inventorySummary.weaving}
              </p>
              <div className="flex gap-3 text-xs text-white/25 mt-2 font-medium">
                <span>{stats.inventorySummary.products}p</span>
                <span>{stats.inventorySummary.sizing}kg</span>
                <span>{stats.inventorySummary.weaving}m</span>
              </div>
            </div>
          </div>

          {/* Revenue card */}
          <div className="glass-card-hover p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-emerald/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/30">Live Revenue</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20">Success</span>
              </div>
              <p className="text-4xl font-extrabold text-neon-emerald">₹{stats.revenue}</p>
              <p className="text-white/25 text-sm mt-2">Cumulative successful pay</p>
            </div>
          </div>

          {/* Bookings card */}
          <div className="glass-card-hover p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-violet/5 to-transparent rounded-2xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/30">Active Bookings</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neon-amber/10 text-neon-amber border border-neon-amber/20">{stats.pending} Pending</span>
              </div>
              <p className="text-4xl font-extrabold text-neon-violet">{stats.bookings}</p>
              <p className="text-white/25 text-sm mt-2">Total order throughput</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {/* Inventory Summary */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Inventory Health</h3>
              <span className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Summary</span>
            </div>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-medium text-sm">Chemicals (Stock)</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-violet to-neon-blue rounded-full" style={{ width: `${Math.min(stats.inventorySummary.products / 10, 100)}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-white/70 w-12 text-right">{stats.inventorySummary.products}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-medium text-sm">Sizing Yarn (kg)</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-cyan to-neon-blue rounded-full" style={{ width: `${Math.min(stats.inventorySummary.sizing / 10, 100)}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-white/70 w-12 text-right">{stats.inventorySummary.sizing}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50 font-medium text-sm">Weaving Fabrics (m)</span>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-32 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-emerald to-neon-cyan rounded-full" style={{ width: `${Math.min(stats.inventorySummary.weaving / 10, 100)}%` }}></div>
                  </div>
                  <span className="text-sm font-bold text-white/70 w-12 text-right">{stats.inventorySummary.weaving}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Low Stock Alerts */}
          <div className="glass-card p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white">Critical Alerts</h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${stats.lowStock.length > 0 ? 'bg-neon-rose/10 text-neon-rose border border-neon-rose/20' : 'bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20'}`}>
                {stats.lowStock.length} ISSUES
              </span>
            </div>
            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2">
              {stats.lowStock.length > 0 ? (
                stats.lowStock.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-neon-rose/5 border border-neon-rose/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-neon-rose uppercase tracking-wider">{item.type}</span>
                      <span className="text-sm font-semibold text-white/80">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-white/20">STOCK</span>
                      <span className="text-lg font-black text-neon-rose">{item.stock}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center bg-white/[0.02] rounded-xl border border-dashed border-white/[0.06]">
                  <div className="w-10 h-10 bg-neon-emerald/10 text-neon-emerald rounded-full flex items-center justify-center mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-xs font-bold text-white/25">All stock levels are optimal</span>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
