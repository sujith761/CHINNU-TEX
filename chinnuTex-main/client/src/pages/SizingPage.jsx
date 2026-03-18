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
    'cotton': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=400&fit=crop&q=80',
    'polyester': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=400&fit=crop&q=80',
    'viscose': 'https://images.unsplash.com/photo-1563166302-ab8e008432b8?w=600&h=400&fit=crop&q=80',
    'pc-blend': 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=600&h=400&fit=crop&q=80',
    'pv-blend': 'https://images.unsplash.com/photo-1522768323590-7912ed921970?w=600&h=400&fit=crop&q=80',
    'nylon': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'acrylic': 'https://images.unsplash.com/photo-1616599810694-cb88b70ee991?w=600&h=400&fit=crop&q=80'
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
          { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450, stockQuantity: 500 },
          { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520, stockQuantity: 300 },
          { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480, stockQuantity: 200 },
          { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510, stockQuantity: 150 },
          { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490, stockQuantity: 180 },
          { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550, stockQuantity: 100 },
          { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470, stockQuantity: 250 }
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

  const ProductCard = ({ yarn, index }) => {
    const qty = quantities[yarn.slug] || 0;
    return (
      <div className={viewMode === 'grid'
        ? 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col'
        : 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group flex'}>
        {/* Image */}
        <div className={viewMode === 'grid' ? 'relative h-48 overflow-hidden bg-gray-100' : 'relative w-48 flex-shrink-0 overflow-hidden bg-gray-100'}>
          <img src={yarnImages[yarn.slug]} alt={yarn.yarnType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {yarn.stockQuantity > 0
            ? <div className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">IN STOCK</div>
            : <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded">OUT OF STOCK</span></div>}
        </div>
        {/* Content */}
        <div className={viewMode === 'grid' ? 'p-4 flex-1 flex flex-col' : 'flex-1 p-5 flex flex-col sm:flex-row gap-4'}>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{yarn.yarnType} Sizing</h3>
              <span className="flex-shrink-0 bg-blue-50 text-blue-700 text-xs font-bold px-2 py-0.5 rounded">SIZING</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">Premium sizing compound for {yarn.yarnType.toLowerCase()} yarn</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">4.{3 + index} <svg className="w-3 h-3 ml-0.5 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
              <span className="text-xs text-gray-400">({120 + index * 17})</span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-bold text-gray-900">₹{yarn.pricePerKg}</span>
              <span className="text-sm text-gray-500">/kg</span>
              <span className="text-sm text-gray-400 line-through ml-1">₹{Math.round(yarn.pricePerKg * 1.15)}</span>
              <span className="text-sm font-semibold text-green-600">15% off</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">{yarn.stockQuantity > 0 ? yarn.stockQuantity + ' kg available' : 'Currently unavailable'}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Free Delivery</span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">COD Available</span>
            </div>
          </div>
          {/* Actions */}
          <div className="mt-3 sm:mt-0 sm:min-w-[160px] flex flex-col gap-2">
            {qty === 0 ? (
              <button onClick={() => incrementQuantity(yarn.slug, yarn.stockQuantity)} disabled={yarn.stockQuantity <= 0}
                className={'w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ' + (yarn.stockQuantity > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 cursor-not-allowed')}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                {yarn.stockQuantity > 0 ? 'ADD TO ORDER' : 'OUT OF STOCK'}
              </button>
            ) : (
              <>
                <div className="flex items-center justify-center gap-1 bg-gray-50 rounded-lg p-1">
                  <button onClick={() => decrementQuantity(yarn.slug)} className="w-9 h-9 rounded-md bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-bold">−</button>
                  <span className="px-3 text-base font-bold text-gray-900">{qty} <span className="text-xs text-gray-500 font-normal">kg</span></span>
                  <button onClick={() => incrementQuantity(yarn.slug, yarn.stockQuantity)} disabled={qty >= yarn.stockQuantity}
                    className={'w-9 h-9 rounded-md flex items-center justify-center font-bold transition-colors ' + (qty < yarn.stockQuantity ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed')}>+</button>
                </div>
                <div className="text-center text-sm font-semibold text-blue-700 bg-blue-50 rounded-lg py-1.5">₹{(yarn.pricePerKg * qty).toLocaleString()}</div>
                {cartCount > 1 ? (
                  <div className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm text-center cursor-not-allowed border border-gray-300">
                    <div className="text-xs font-semibold mb-0.5">Use PLACE ORDER below</div>
                  </div>
                ) : (
                  <Link to="/booking" state={{ type: 'product', category: 'sizing', item: yarn.yarnType, itemSlug: yarn.slug, price: yarn.pricePerKg, unit: 'kg', quantity: qty }}
                    className="w-full py-2.5 rounded-lg bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 text-center block active:scale-[0.98]">BUY NOW</Link>
                )}
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
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-200 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Sizing Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div><h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Sizing Products</h1><p className="text-blue-200 text-sm">Advanced sizing compounds for superior yarn performance</p></div>
            <div className="relative max-w-sm w-full">
              <input type="text" placeholder="Search sizing products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-blue-200 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none transition-all" />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </div>
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Showing <strong className="text-gray-900">{sorted.length}</strong> products</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="default">Sort by: Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name">Name: A to Z</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setViewMode('grid')} className={'p-2 rounded-lg ' + (viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 8a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm6-6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 8a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={'p-2 rounded-lg ' + (viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:text-gray-600')}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      </div>
      {/* Offers */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="flex-shrink-0 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded">OFFERS</span>
          <span className="text-gray-700 flex-shrink-0">Bulk order? Get <strong className="text-green-700">10% off</strong> on 500+ kg</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Free delivery on ₹5,000+</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Cash on Delivery available</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32"><div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div><p className="text-blue-600 font-medium">Loading products...</p></div>
        ) : sorted.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center"><h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3><p className="text-gray-500">Try adjusting your search</p></div>
        ) : viewMode === 'grid' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">{sorted.map((yarn, i) => <ProductCard key={i} yarn={yarn} index={i} />)}</div>
        ) : (
          <div className="space-y-3">{sorted.map((yarn, i) => <ProductCard key={i} yarn={yarn} index={i} />)}</div>
        )}
      </div>

      {/* Floating Cart */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-blue-600 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">{cartCount}</div>
              <div><div className="text-xs text-gray-500">Items selected</div><div className="text-lg font-bold text-gray-900">₹{cartTotal.toLocaleString()}</div></div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantities({})} className="px-4 py-2 text-sm text-gray-600 hover:text-red-600">Clear All</button>
              <Link to="/booking" state={{ 
                type: 'product', 
                category: 'sizing', 
                items: yarnTypes.filter(y => quantities[y.slug] > 0).map(y => ({
                  item: y.yarnType,
                  itemSlug: y.slug,
                  price: y.pricePerKg,
                  unit: 'kg',
                  quantity: quantities[y.slug]
                }))
              }}
                className="px-8 py-3 bg-orange-500 text-white font-bold rounded-lg hover:bg-orange-600 text-sm">PLACE ORDER</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
