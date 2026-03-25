import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function SizingPage() {
  const [yarnTypes, setYarnTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const incrementQuantity = (slug, max) => {
    setQuantities(prev => ({ ...prev, [slug]: Math.min((prev[slug] || 0) + 1, max || 9999) }));
  };
  const decrementQuantity = (slug) => {
    setQuantities(prev => ({ ...prev, [slug]: Math.max(0, (prev[slug] || 0) - 1) }));
  };

  const yarnImages = {
    'cotton': '/images/products/cotton.png',
    'polyester': '/images/products/polyester.png',
    'viscose': '/images/products/viscose.png',
    'pc-blend': '/images/products/polyester.png',
    'pv-blend': '/images/products/viscose.png',
    'nylon': '/images/products/nylon.png',
    'acrylic': '/images/products/nylon.png'
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricingApi.getAllSizingPrices();
        setYarnTypes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching sizing prices:', err);
        setError('Failed to load pricing data');
        setYarnTypes([
          { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 285, stockQuantity: 500 },
          { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 310, stockQuantity: 300 },
          { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 295, stockQuantity: 200 },
          { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 305, stockQuantity: 150 },
          { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 290, stockQuantity: 180 },
          { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 340, stockQuantity: 100 },
          { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 265, stockQuantity: 250 }
        ]);
      } finally { setLoading(false); }
    };
    fetchPrices();
  }, []);

  const cartCount = Object.values(quantities).filter(q => q > 0).length;
  const cartTotal = yarnTypes.reduce((sum, y) => sum + (y.pricePerKg * (quantities[y.slug] || 0)), 0);

  const sorted = [...yarnTypes]
    .filter(y => !searchTerm || y.yarnType.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerKg - b.pricePerKg;
      if (sortBy === 'price-high') return b.pricePerKg - a.pricePerKg;
      if (sortBy === 'name') return a.yarnType.localeCompare(b.yarnType);
      return 0;
    });

  const ProductCard = ({ yarn }) => {
    const qty = quantities[yarn.slug] || 0;
    return (
      <div className={viewMode === 'grid'
        ? 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col'
        : 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row'}>
        {/* Image */}
        <div className={viewMode === 'grid' ? 'relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800' : 'relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800'}>
          <img src={yarnImages[yarn.slug]} alt={yarn.yarnType} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {yarn.stockQuantity > 0
            ? <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20 tracking-wider">AVAILABLE</div>
            : <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">OUT OF STOCK</span></div>}
        </div>
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{yarn.yarnType} Sizing</h3>
              <span className="flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter uppercase border border-indigo-100/50 dark:border-indigo-400/20">Industrial</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Premium sizing compound for {yarn.yarnType.toLowerCase()} yarn. Enhanced strength & weaving efficiency.</p>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">₹{yarn.pricePerKg}</span>
                <span className="text-xs font-bold text-slate-400">/kg</span>
              </div>
              <span className="text-xs text-slate-400 line-through">₹{Math.round(yarn.pricePerKg * 1.15)}</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase tracking-tighter">15% OFF</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${yarn.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} /> {yarn.stockQuantity}kg Ready</span>
              <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> QC Verified</span>
            </div>

            <div className="flex gap-2">
              {qty === 0 ? (
                <button 
                  onClick={() => incrementQuantity(yarn.slug, yarn.stockQuantity)} 
                  disabled={yarn.stockQuantity <= 0}
                  className="flex-1 py-3.5 bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
                >
                  {yarn.stockQuantity > 0 ? 'Add to Order' : 'Notify Me'}
                </button>
              ) : (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button onClick={() => decrementQuantity(yarn.slug)} className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all font-bold shadow-sm active:scale-90">-</button>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{qty} <span className="text-[10px] text-slate-400 font-bold">KG</span></span>
                    <button onClick={() => incrementQuantity(yarn.slug, yarn.stockQuantity)} disabled={qty >= yarn.stockQuantity} className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all font-bold shadow-sm active:scale-90">+</button>
                  </div>
                  <Link to="/booking" state={{ type: 'product', category: 'sizing', item: yarn.yarnType, itemSlug: yarn.slug, price: yarn.pricePerKg, unit: 'kg', quantity: qty }}
                    className="w-full py-2 bg-indigo-600 text-white text-[11px] font-black tracking-widest uppercase rounded-lg hover:bg-indigo-700 text-center transition-all shadow-md active:scale-95">Checkout Now</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      {/* Premium Header/Banner */}
      <div className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-slate-950">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/40 via-transparent to-transparent" />
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-500/40 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-white">Sizing</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                PRIME <span className="text-indigo-500">SIZING</span><br />SYSTEMS
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mb-8">
                The pinnacle of yarn preparation technology. Engineered sizing compounds for maximum strength and zero breakage.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300">SYSTEM STABLE</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl">
                  <span className="text-xs font-bold text-indigo-400 tracking-tighter uppercase">Factory Direct Pricing</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="FILTER BY YARN TYPE..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 font-bold text-sm tracking-widest uppercase focus:bg-white/10 focus:border-indigo-500/50 outline-none transition-all shadow-2xl" 
                />
                <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 -mt-10 relative z-20 pb-40">
        {/* Toolbar Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/20 dark:border-slate-800/50 rounded-3xl p-6 shadow-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Available</p>
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase leading-none">{sorted.length} PRODUCTS</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-indigo-500 transition-colors py-2 uppercase tracking-tighter">
                <option value="default">Relevance (Default)</option>
                <option value="price-low">Lowest Cost First</option>
                <option value="price-high">Highest Cost First</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

        {/* Product Grid/List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 border-t-indigo-500 rounded-full animate-spin" />
            </div>
            <p className="mt-8 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Initializing Sizing Matrix...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">Matrix Mismatch</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">No sizing products match your current search parameters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map((yarn, i) => <ProductCard key={i} yarn={yarn} index={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((yarn, i) => <ProductCard key={i} yarn={yarn} index={i} />)}
          </div>
        )}
      </div>

      {/* Premium Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 animate-fade-in-up">
          <div className="bg-slate-900/90 dark:bg-indigo-950/90 backdrop-blur-2xl border border-white/10 p-5 pl-8 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6 ring-1 ring-white/10">
            <div className="flex items-center gap-10">
              <div className="relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-indigo-500 border-4 border-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                  {cartCount}
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total Valuation</p>
                <p className="text-2xl font-black text-white leading-none">₹{cartTotal.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantities({})} className="text-xs font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors hidden md:block px-4">Flush Cart</button>
              <Link to="/booking" state={{ 
                type: 'product', 
                category: 'sizing', 
                items: yarnTypes.filter(y => quantities[y.slug] > 0).map(y => ({ item: y.yarnType, itemSlug: y.slug, price: y.pricePerKg, unit: 'kg', quantity: quantities[y.slug] }))
              }}
                className="px-10 py-5 bg-indigo-600 text-white font-black rounded-2xl text-sm tracking-widest uppercase hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-3">
                Process Order
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
