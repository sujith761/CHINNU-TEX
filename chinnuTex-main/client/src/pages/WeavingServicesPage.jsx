import { Link } from 'react-router-dom';
import { useState } from 'react';
import services from '../data/services';

export default function WeavingServicesPage() {
  const [quantities, setQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');

  const incrementQuantity = (fabricType) => {
    setQuantities(prev => ({ ...prev, [fabricType]: (prev[fabricType] || 0) + 1 }));
  };
  const decrementQuantity = (fabricType) => {
    setQuantities(prev => ({ ...prev, [fabricType]: Math.max(0, (prev[fabricType] || 0) - 1) }));
  };

  const weavingService = services.find(s => s.slug === 'weaving') || services[1];

  const fabricImages = {
    'Cotton fabric': 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?w=600&h=400&fit=crop&q=80',
    'Rayon fabric': 'https://images.unsplash.com/photo-1534609146540-ccec25f3f6f4?w=600&h=400&fit=crop&q=80',
    'Polyester fabric': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop&q=80',
    'Silk fabric': 'https://images.unsplash.com/photo-1550639524-a6f58345a2ca?w=600&h=400&fit=crop&q=80',
    'Woollen fabric': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=400&fit=crop&q=80',
    'Linen fabric': 'https://images.unsplash.com/photo-1594761077380-a02eb76f7df9?w=600&h=400&fit=crop&q=80',
    'Nylon fabric': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'Acrylic fabric': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=600&h=400&fit=crop&q=80'
  };

  const fabricPricing = {
    'Cotton fabric': 380,
    'Rayon fabric': 420,
    'Polyester fabric': 350,
    'Silk fabric': 580,
    'Woollen fabric': 480,
    'Linen fabric': 520,
    'Nylon fabric': 340,
    'Acrylic fabric': 320
  };

  const cartCount = Object.values(quantities).filter(q => q > 0).length;
  const cartTotal = weavingService.bullets.reduce((sum, f) => sum + ((fabricPricing[f] || 0) * (quantities[f] || 0)), 0);

  const filtered = weavingService.bullets
    .filter(f => !searchTerm || f.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return (fabricPricing[a] || 0) - (fabricPricing[b] || 0);
      if (sortBy === 'price-high') return (fabricPricing[b] || 0) - (fabricPricing[a] || 0);
      if (sortBy === 'name') return a.localeCompare(b);
      return 0;
    });

  const ServiceCard = ({ fabricType, index }) => {
    const qty = quantities[fabricType] || 0;
    const price = fabricPricing[fabricType] || 0;
    return (
      <div className={viewMode === 'grid'
        ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col'
        : 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex'}>
        <div className={viewMode === 'grid' ? 'relative h-48 overflow-hidden bg-gray-100' : 'relative w-48 flex-shrink-0 overflow-hidden bg-gray-100'}>
          <img src={fabricImages[fabricType] || fabricImages['Cotton fabric']} alt={fabricType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">SERVICE</div>
        </div>
        <div className={viewMode === 'grid' ? 'p-4 flex-1 flex flex-col' : 'flex-1 p-5 flex flex-col sm:flex-row gap-4'}>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">{fabricType} Weaving</h3>
              <span className="flex-shrink-0 bg-purple-50 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">WEAVING</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Professional weaving service with automated looms, pattern design & QC inspection</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">4.{3 + (index % 5)} <svg className="w-3 h-3 ml-0.5 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
              <span className="text-xs text-gray-400">({90 + index * 11})</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">₹{price}</span>
              <span className="text-sm text-gray-500">/metre</span>
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
              <button onClick={() => incrementQuantity(fabricType)}
                className="w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-purple-700 active:scale-[0.98]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                SELECT SERVICE
              </button>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => decrementQuantity(fabricType)} className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">&minus;</button>
                  <span className="px-3 text-base font-bold text-gray-900">{qty} <span className="text-xs text-gray-500 font-normal">m</span></span>
                  <button onClick={() => incrementQuantity(fabricType)} className="w-9 h-9 rounded-md flex items-center justify-center font-bold transition-colors bg-purple-600 text-white hover:bg-purple-700">+</button>
                </div>
                <div className="text-center text-sm font-semibold text-purple-700 bg-purple-50 rounded-lg py-1.5">₹{(price * qty).toLocaleString()}</div>
                <Link to="/booking" state={{ type: 'service', category: 'weaving', item: fabricType, itemSlug: fabricType.toLowerCase().replace(/\s+/g, '-'), price, unit: 'metre', quantity: qty }}
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
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-purple-200 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Weaving Services</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{weavingService.title}</h1>
              <p className="text-purple-200 text-sm">{weavingService.summary}</p>
            </div>
            <div className="relative max-w-sm w-full">
              <input type="text" placeholder="Search weaving services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-purple-200 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none transition-all" />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Showing <strong className="text-gray-900">{filtered.length}</strong> services</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer">
              <option value="default">Sort by: Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name">Name: A to Z</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')} className={'p-2 rounded-lg ' + (viewMode === 'grid' ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={'p-2 rounded-lg ' + (viewMode === 'list' ? 'bg-purple-50 text-purple-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="flex-shrink-0 bg-purple-600 text-white text-xs font-bold px-2.5 py-1 rounded">WHY US</span>
          <span className="text-gray-700 flex-shrink-0">State-of-the-Art Looms</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Custom Pattern Design</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Quality Inspection at Every Stage</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">COD Accepted</span>
        </div>
      </div>

      {/* Service Cards */}
      <div className="container mx-auto px-4 py-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center"><h3 className="text-lg font-bold text-gray-800 mb-2">No services found</h3><p className="text-gray-500">Try adjusting your search</p></div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{filtered.map((fabricType, i) => <ServiceCard key={i} fabricType={fabricType} index={i} />)}</div>
        ) : (
          <div className="space-y-3">{filtered.map((fabricType, i) => <ServiceCard key={i} fabricType={fabricType} index={i} />)}</div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-purple-600 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">{cartCount}</div>
              <div><div className="text-xs text-gray-500">Services selected</div><div className="text-lg font-bold text-gray-900">₹{cartTotal.toLocaleString()}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantities({})} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600">Clear All</button>
              {(() => {
                const first = weavingService.bullets.find(f => quantities[f] > 0);
                return first ? (
                  <Link to="/booking" state={{ type: 'service', category: 'weaving', item: first, itemSlug: first.toLowerCase().replace(/\s+/g, '-'), price: fabricPricing[first], unit: 'metre', quantity: quantities[first] }}
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
