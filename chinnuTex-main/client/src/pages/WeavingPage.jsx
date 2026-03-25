import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function WeavingPage() {
  const [clothTypes, setClothTypes] = useState([]);
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

  const clothImages = {
    'cotton': '/images/products/cotton.png',
    'rayon': '/images/products/viscose.png',
    'polyester': '/images/products/polyester.png',
    'silk': '/images/products/silk.png',
    'woollen': '/images/products/woollen.png',
    'linen': '/images/products/linen.png',
    'nylon': '/images/products/nylon.png',
    'acrylic': '/images/products/nylon.png'
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const response = await pricingApi.getAllWeavingPrices();
        setClothTypes(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching weaving prices:', err);
        setError('Failed to load pricing data');
        setClothTypes([
          { fabricType: 'Cotton', slug: 'cotton', pricePerMetre: 175, stockQuantity: 500 },
          { fabricType: 'Rayon', slug: 'rayon', pricePerMetre: 210, stockQuantity: 300 },
          { fabricType: 'Polyester', slug: 'polyester', pricePerMetre: 155, stockQuantity: 200 },
          { fabricType: 'Silk', slug: 'silk', pricePerMetre: 345, stockQuantity: 150 },
          { fabricType: 'Woollen', slug: 'woollen', pricePerMetre: 275, stockQuantity: 180 },
          { fabricType: 'Linen', slug: 'linen', pricePerMetre: 295, stockQuantity: 100 },
          { fabricType: 'Nylon', slug: 'nylon', pricePerMetre: 145, stockQuantity: 250 },
          { fabricType: 'Acrylic', slug: 'acrylic', pricePerMetre: 135, stockQuantity: 350 }
        ]);
      } finally { setLoading(false); }
    };
    fetchPrices();
  }, []);

  const cartCount = Object.values(quantities).filter(q => q > 0).length;
  const cartTotal = clothTypes.reduce((sum, c) => sum + (c.pricePerMetre * (quantities[c.slug] || 0)), 0);

  const sorted = [...clothTypes]
    .filter(c => !searchTerm || c.fabricType.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerMetre - b.pricePerMetre;
      if (sortBy === 'price-high') return b.pricePerMetre - a.pricePerMetre;
      if (sortBy === 'name') return a.fabricType.localeCompare(b.fabricType);
      return 0;
    });

  const FabricCard = ({ cloth }) => {
    const qty = quantities[cloth.slug] || 0;
    const stock = cloth.stockQuantity ?? 999;
    return (
      <div className={viewMode === 'grid'
        ? 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col'
        : 'group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row'}>
        {/* Image */}
        <div className={viewMode === 'grid' ? 'relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800' : 'relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800'}>
          <img src={clothImages[cloth.slug] || clothImages['cotton']} alt={cloth.fabricType} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {stock > 0
            ? <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20 tracking-wider">AVAILABLE</div>
            : <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center"><span className="bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-xl">OUT OF STOCK</span></div>}
        </div>
        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight transition-colors group-hover:text-purple-600 dark:group-hover:text-purple-400">{cloth.fabricType} Fabric</h3>
              <span className="flex-shrink-0 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-[10px] font-black px-2 py-1 rounded-md tracking-tighter uppercase border border-purple-100/50 dark:border-purple-400/20">Woven</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Premium woven {cloth.fabricType.toLowerCase()} fabric. Superior GSM & texture for export quality garments.</p>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900 dark:text-white">₹{cloth.pricePerMetre}</span>
                <span className="text-xs font-bold text-slate-400">/m</span>
              </div>
              <span className="text-xs text-slate-400 line-through">₹{Math.round(cloth.pricePerMetre * 1.18)}</span>
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded uppercase tracking-tighter">18% OFF</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="flex items-center gap-1.5"><div className={`w-1.5 h-1.5 rounded-full ${stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} /> {stock}m Ready</span>
              <span className="flex items-center gap-1.5"><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Quality Checked</span>
            </div>

            <div className="flex gap-2">
              {qty === 0 ? (
                <button 
                  onClick={() => incrementQuantity(cloth.slug, stock)} 
                  disabled={stock <= 0}
                  className="flex-1 py-3.5 bg-slate-900 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:shadow-none"
                >
                  {stock > 0 ? 'Add to Order' : 'Notify Me'}
                </button>
              ) : (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                    <button onClick={() => decrementQuantity(cloth.slug)} className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all font-bold shadow-sm active:scale-90">-</button>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{qty} <span className="text-[10px] text-slate-400 font-bold">M</span></span>
                    <button onClick={() => incrementQuantity(cloth.slug, stock)} disabled={qty >= stock} className="w-10 h-10 flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all font-bold shadow-sm active:scale-90">+</button>
                  </div>
                  <Link to="/booking" state={{ type: 'product', category: 'weaving', item: cloth.fabricType, itemSlug: cloth.slug, price: cloth.pricePerMetre, unit: 'metre', quantity: qty }}
                    className="w-full py-2 bg-purple-600 text-white text-[11px] font-black tracking-widest uppercase rounded-lg hover:bg-purple-700 text-center transition-all shadow-md active:scale-95">Checkout Now</Link>
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
        <div className="absolute top-0 left-0 w-full h-full bg-slate-900 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent animate-pulse" />
          <div className="absolute w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -top-1/2 -left-1/4 animate-parallaxSlow" />
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] -bottom-1/4 -right-1/4 animate-float" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <nav className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-white">Weaving</span>
          </nav>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.85] tracking-tighter">
                EXQUISITE <span className="text-purple-500">WEAVE</span><br />COLLECTION
              </h1>
              <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mb-8">
                Masterfully crafted textiles. From high-grade cotton to luxurious silk, discover fabrics engineered for elite garment manufacturing.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                  <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest">Premium Quality Matrix</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-md">
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="SEARCH FABRICS..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-6 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 font-bold text-sm tracking-widest uppercase focus:bg-white/10 focus:border-purple-500/50 outline-none transition-all shadow-2xl" 
                />
                <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Textile Inventory</p>
              <p className="text-lg font-black text-slate-900 dark:text-white uppercase leading-none">{sorted.length} FABRIC VARIANTS</p>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="relative">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-bold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:text-purple-500 transition-colors py-2 uppercase tracking-tighter">
                <option value="default">Catalogue Ranking</option>
                <option value="price-low">Economic to Premium</option>
                <option value="price-high">Premium to Economic</option>
                <option value="name">A-Z Lexical</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-md scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>

        {/* Product Grid/List */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="relative">
              <div className="w-20 h-20 border-2 border-purple-500/20 rounded-full animate-ping absolute inset-0" />
              <div className="w-20 h-20 border-4 border-slate-200 dark:border-slate-800 border-t-purple-500 rounded-full animate-spin" />
            </div>
            <p className="mt-8 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm">Syncing Fabric Database...</p>
          </div>
        ) : sorted.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">No Fabrics Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try broadening your search criteria.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sorted.map((cloth, i) => <FabricCard key={i} cloth={cloth} index={i} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {sorted.map((cloth, i) => <FabricCard key={i} cloth={cloth} index={i} />)}
          </div>
        )}
      </div>

      {/* Premium Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-[95%] sm:max-w-lg md:max-w-2xl lg:max-w-4xl px-2 animate-fade-in-up">
          <div className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-3xl border border-white/10 p-4 md:p-5 md:pl-8 rounded-[2rem] shadow-2xl flex items-center justify-between gap-3 ring-1 ring-white/10">
            <div className="flex items-center gap-4 md:gap-12">
              <div className="relative hidden md:block">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-500 border-4 border-slate-900 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                  {cartCount}
                </div>
                <div className="w-16 h-16 bg-white/10 rounded-[1.25rem] flex items-center justify-center text-purple-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                </div>
              </div>
              
              <div className="flex items-center md:hidden w-10 h-10 bg-white/10 rounded-xl justify-center text-purple-400 relative">
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                    {cartCount}
                  </div>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 11-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              
              <div>
                <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 md:mb-1.5 font-mono">SELECTION VALUE</p>
                <p className="text-lg sm:text-xl md:text-3xl font-black text-white leading-none">₹{cartTotal.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-6">
              <button 
                onClick={() => setQuantities({})} 
                className="text-[10px] md:text-xs font-black text-slate-500 hover:text-rose-500 uppercase tracking-widest transition-colors px-2"
              >
                Reset
              </button>
              <Link to="/booking" state={{ 
                type: 'product', 
                category: 'weaving', 
                items: clothTypes.filter(c => quantities[c.slug] > 0).map(c => ({ item: c.fabricType, itemSlug: c.slug, price: c.pricePerMetre, unit: 'metre', quantity: quantities[c.slug] }))
              }}
                className="px-4 md:px-12 py-3 md:py-5 bg-purple-600 text-white font-black rounded-xl md:rounded-2xl text-[10px] sm:text-[11px] md:text-[13px] tracking-widest uppercase hover:bg-purple-700 transition-all shadow-xl shadow-purple-600/30 active:scale-95 flex items-center gap-2 md:gap-4 group whitespace-nowrap"
              >
                <span className="hidden sm:inline">Place Bulk </span> Order
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
