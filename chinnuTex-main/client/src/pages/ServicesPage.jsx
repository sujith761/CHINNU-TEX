import { Link } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function ServicesPage() {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  const incrementQuantity = (yarnType) => {
    setQuantities(prev => ({ ...prev, [yarnType]: (prev[yarnType] || 0) + 1 }));
  };
  const decrementQuantity = (yarnType) => {
    setQuantities(prev => ({ ...prev, [yarnType]: Math.max(0, (prev[yarnType] || 0) - 1) }));
  };

  const mainService = services[0];

  const yarnImages = {
    'Cotton yarn': '/images/products/cotton.png',
    'Polyester yarn': '/images/products/polyester.png',
    'Viscose (Rayon) yarn': '/images/products/viscose.png',
    'Polyester–Cotton (PC) blended yarn': '/images/products/polyester.png',
    'Polyester–Viscose (PV) blended yarn': '/images/products/viscose.png',
    'Nylon yarn': '/images/products/nylon.png',
    'Acrylic yarn': '/images/products/nylon.png'
  };

  const yarnPricing = {
    'Cotton yarn': 285,
    'Polyester yarn': 310,
    'Viscose (Rayon) yarn': 295,
    'Polyester–Cotton (PC) blended yarn': 305,
    'Polyester–Viscose (PV) blended yarn': 290,
    'Nylon yarn': 340,
    'Acrylic yarn': 265
  };

  const cartCount = Object.values(quantities).filter(q => q > 0).length;
  const cartTotal = mainService.bullets.reduce((sum, y) => sum + ((yarnPricing[y] || 0) * (quantities[y] || 0)), 0);

  const filtered = mainService.bullets
    .filter(y => !searchTerm || y.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return (yarnPricing[a] || 0) - (yarnPricing[b] || 0);
      if (sortBy === 'price-high') return (yarnPricing[b] || 0) - (yarnPricing[a] || 0);
      if (sortBy === 'name') return a.localeCompare(b);
      return 0;
    });

  const ServiceCard = ({ yarnType, index }) => {
    const qty = quantities[yarnType] || 0;
    const price = yarnPricing[yarnType] || 0;
    return (
      <div className={viewMode === 'grid'
        ? 'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1'
        : 'bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col sm:flex-row'}>
        <div className={viewMode === 'grid' ? 'relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-900' : 'relative w-full sm:w-64 h-56 sm:h-auto overflow-hidden bg-slate-100 dark:bg-slate-900'}>
          <img src={yarnImages[yarnType] || yarnImages['Cotton yarn']} alt={yarnType} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute top-4 left-4 bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">SERVICE</div>
          {qty > 0 && <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">SELECTED</div>}
        </div>
        <div className={viewMode === 'grid' ? 'p-6 flex-1 flex flex-col' : 'flex-1 p-6 flex flex-col lg:flex-row gap-6'}>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-xl group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{yarnType}</h3>
              <span className="flex-shrink-0 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider">SIZING</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">Professional sizing service including pre-wetting, sizing, and post-drying quality control checks for industrial requirements.</p>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg shadow-sm shadow-emerald-500/20">
                4.{4 + (index % 5)}
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">({120 + index * 18} reviews)</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">₹{price}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">/kg</span>
              <span className="text-sm text-slate-400 line-through ml-2">₹{Math.round(price * 1.2)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/20">Quality Assured</span>
              <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-800/20">Fast Delivery</span>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 lg:min-w-[180px] flex flex-col justify-center gap-3">
            {qty === 0 ? (
              <button onClick={() => incrementQuantity(yarnType)}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                ADD TO SELECTION
              </button>
            ) : (
              <div className="space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between gap-1 bg-slate-50 dark:bg-slate-900 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700">
                  <button onClick={() => decrementQuantity(yarnType)} className="w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:border-rose-200 transition-all font-bold">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                  </button>
                  <span className="px-3 text-lg font-bold text-slate-900 dark:text-white">{qty} <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">kg</span></span>
                  <button onClick={() => incrementQuantity(yarnType)} className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                  </button>
                </div>
                <div className="text-center text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl py-2 shadow-inner">₹{(price * qty).toLocaleString()}</div>
                <Link to="/booking" state={{ type: 'service', category: 'sizing', item: yarnType, itemSlug: yarnType.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''), price, unit: 'kg', quantity: qty }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-orange-500/20 text-center block transition-all active:scale-[0.98]">BOOK NOW</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-500">
      {/* Banner */}
      <div className="relative bg-gradient-to-br from-indigo-700 via-indigo-800 to-violet-900 pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[80px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-6 animate-fade-in-up">
            <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <svg className="w-3 h-3 opacity-50" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Sizing Services</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div className="animate-fade-in-up delay-100">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 tracking-tight">{mainService.title}</h1>
              <p className="text-indigo-100/80 text-lg max-w-2xl leading-relaxed">{mainService.summary}</p>
            </div>
            <div className="relative max-w-md w-full animate-fade-in-up delay-200">
              <input type="text" placeholder="Search for yarn types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-indigo-200/70 focus:bg-white focus:text-slate-900 focus:placeholder-slate-400 focus:outline-none transition-all shadow-xl" />
              <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-indigo-200/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80 dark:bg-slate-800/80">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
            <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> industrial services</span>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Sort by</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border-none bg-slate-50 dark:bg-slate-900 rounded-xl px-4 py-2 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-all">
                <option value="default">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
            <button onClick={() => setViewMode('grid')} className={'p-2 rounded-lg transition-all ' + (viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={'p-2 rounded-lg transition-all ' + (viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-emerald-500 text-white shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
        <div className="container mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto text-xs font-bold whitespace-nowrap scrollbar-hide relative z-10">
          <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg> Precision Quality</span>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg> Rapid Turnaround</span>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" /></svg> Secure Payments</span>
          <div className="w-1.5 h-1.5 bg-white/30 rounded-full" />
          <span className="flex items-center gap-1.5"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3.005 3.005 0 013.75-2.906z" /></svg> Expert Support</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="container mx-auto px-4 py-8">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-16 text-center border border-slate-200 dark:border-slate-700 animate-fade-in-up">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No industrial services found</h3>
            <p className="text-slate-500 dark:text-slate-400">Please try adjusting your search terms or filters.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up">{filtered.map((yarnType, i) => <ServiceCard key={i} yarnType={yarnType} index={i} />)}</div>
        ) : (
          <div className="space-y-6 animate-fade-in-up">{filtered.map((yarnType, i) => <ServiceCard key={i} yarnType={yarnType} index={i} />)}</div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-40 animate-slide-up">
          <div className="bg-slate-900/90 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-4 flex items-center justify-between gap-6 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-indigo-500/20">
                {cartCount}
              </div>
              <div>
                <div className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-0.5">Services Selection</div>
                <div className="text-2xl font-bold text-white tracking-tight">₹{cartTotal.toLocaleString()}</div>
              </div>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <button onClick={() => setQuantities({})} className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-rose-400 transition-colors uppercase tracking-widest">Clear</button>
              {(() => {
                const first = mainService.bullets.find(y => quantities[y] > 0);
                return first ? (
                  <Link to="/booking" state={{ type: 'service', category: 'sizing', item: first, itemSlug: first.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''), price: yarnPricing[first], unit: 'kg', quantity: quantities[first] }}
                    className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all font-display text-sm shadow-xl active:scale-[0.98]">CHECKOUT</Link>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
