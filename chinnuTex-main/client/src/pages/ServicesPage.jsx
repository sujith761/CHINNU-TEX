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
    'Cotton yarn': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop&q=80',
    'Polyester yarn': 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=400&fit=crop&q=80',
    'Viscose (Rayon) yarn': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=400&fit=crop&q=80',
    'Polyester–Cotton (PC) blended yarn': 'https://images.unsplash.com/photo-1612731486606-2614b4d97e3d?w=600&h=400&fit=crop&q=80',
    'Polyester–Viscose (PV) blended yarn': 'https://images.unsplash.com/photo-1606501126768-b380d4169ab6?w=600&h=400&fit=crop&q=80',
    'Nylon yarn': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'Acrylic yarn': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&q=80'
  };

  const yarnPricing = {
    'Cotton yarn': 650,
    'Polyester yarn': 720,
    'Viscose (Rayon) yarn': 680,
    'Polyester–Cotton (PC) blended yarn': 710,
    'Polyester–Viscose (PV) blended yarn': 690,
    'Nylon yarn': 750,
    'Acrylic yarn': 670
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
        ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col'
        : 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex'}>
        <div className={viewMode === 'grid' ? 'relative h-48 overflow-hidden bg-gray-100' : 'relative w-48 flex-shrink-0 overflow-hidden bg-gray-100'}>
          <img src={yarnImages[yarnType] || yarnImages['Cotton yarn']} alt={yarnType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">SERVICE</div>
        </div>
        <div className={viewMode === 'grid' ? 'p-4 flex-1 flex flex-col' : 'flex-1 p-5 flex flex-col sm:flex-row gap-4'}>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{yarnType}</h3>
              <span className="flex-shrink-0 bg-indigo-50 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">SIZING</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Professional sizing service including pre-wetting, sizing, and post-drying QC</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">4.{4 + (index % 5)} <svg className="w-3 h-3 ml-0.5 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
              <span className="text-xs text-gray-400">({80 + index * 12})</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">₹{price}</span>
              <span className="text-sm text-gray-500">/kg</span>
              <span className="text-sm text-gray-400 line-through ml-1">₹{Math.round(price * 1.2)}</span>
              <span className="text-sm font-semibold text-green-600">20% off</span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs mt-2">
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Quality Tested</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Fast Turnaround</span>
              <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">COD Available</span>
            </div>
          </div>
          <div className="mt-3 sm:mt-0 sm:min-w-[160px] flex flex-col gap-2">
            {qty === 0 ? (
              <button onClick={() => incrementQuantity(yarnType)}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                SELECT SERVICE
              </button>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => decrementQuantity(yarnType)} className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">−</button>
                  <span className="px-3 text-base font-bold text-gray-900">{qty} <span className="text-xs text-gray-500 font-normal">kg</span></span>
                  <button onClick={() => incrementQuantity(yarnType)} className="w-9 h-9 rounded-md flex items-center justify-center font-bold transition-colors bg-blue-600 text-white hover:bg-blue-700">+</button>
                </div>
                <div className="text-center text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg py-1.5">₹{(price * qty).toLocaleString()}</div>
                <Link to="/booking" state={{ type: 'service', category: 'sizing', item: yarnType, itemSlug: yarnType.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''), price, unit: 'kg', quantity: qty }}
                  className="w-full py-2.5 rounded-lg bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 text-center block active:scale-[0.98]">BOOK NOW</Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-blue-700 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Sizing Services</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{mainService.title}</h1>
              <p className="text-indigo-200 text-sm">{mainService.summary}</p>
            </div>
            <div className="relative max-w-sm w-full">
              <input type="text" placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-indigo-200 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none transition-all" />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Showing <strong className="text-gray-900">{filtered.length}</strong> services</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
              <option value="default">Sort by: Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name">Name: A to Z</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')} className={'p-2 rounded-lg ' + (viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={'p-2 rounded-lg ' + (viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="flex-shrink-0 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded">WHY US</span>
          <span className="text-gray-700 flex-shrink-0">High-Speed Processing</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Quality Assurance at Every Stage</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Custom Formulation Available</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">COD Accepted</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="container mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center"><h3 className="text-lg font-bold text-gray-800 mb-2">No services found</h3><p className="text-gray-500">Try adjusting your search</p></div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((yarnType, i) => <ServiceCard key={i} yarnType={yarnType} index={i} />)}</div>
        ) : (
          <div className="space-y-3">{filtered.map((yarnType, i) => <ServiceCard key={i} yarnType={yarnType} index={i} />)}</div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-indigo-600 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">{cartCount}</div>
              <div><div className="text-xs text-gray-500">Services selected</div><div className="text-lg font-bold text-gray-900">₹{cartTotal.toLocaleString()}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantities({})} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600">Clear All</button>
              {(() => {
                const first = mainService.bullets.find(y => quantities[y] > 0);
                return first ? (
                  <Link to="/booking" state={{ type: 'service', category: 'sizing', item: first, itemSlug: first.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''), price: yarnPricing[first], unit: 'kg', quantity: quantities[first] }}
                    className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 text-sm">BOOK NOW</Link>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
