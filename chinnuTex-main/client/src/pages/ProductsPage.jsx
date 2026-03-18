import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ProductsPage() {
  const [bleachingProducts, setBleachingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const bleach = await api.get('/products?processType=bleaching');
        setBleachingProducts(bleach.data);
      } catch (err) {
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = bleachingProducts
    .filter(p => !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.ratePerMeter || 0) - (b.ratePerMeter || 0);
      if (sortBy === 'price-high') return (b.ratePerMeter || 0) - (a.ratePerMeter || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f1f3f6] font-sans">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-700 pt-28 pb-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-teal-200 text-sm mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Bleaching Products</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">Bleaching Chemicals</h1>
              <p className="text-teal-200 text-sm">Professional whitening solutions for all fabric types</p>
            </div>
            <div className="relative max-w-sm w-full">
              <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-teal-200 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none transition-all" />
              <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Showing <strong className="text-gray-900">{filtered.length}</strong> products</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer">
              <option value="default">Sort by: Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option><option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="flex-shrink-0 bg-teal-600 text-white text-xs font-bold px-2.5 py-1 rounded">OFFERS</span>
          <span className="text-gray-700 flex-shrink-0">Bulk discounts on 100+ units</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Free delivery on ₹5,000+</span>
          <span className="text-gray-300 flex-shrink-0">|</span>
          <span className="text-gray-700 flex-shrink-0">Quality guaranteed</span>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
            <p className="text-teal-600 font-medium">Loading products...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or check back later</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p, index) => (
              <div key={p._id || index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group flex flex-col">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-cyan-50">
                      <svg className="w-16 h-16 text-teal-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                  )}
                  <div className="absolute top-2 left-2 bg-teal-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">BLEACHING</div>
                  {p.stockQuantity > 0
                    ? <div className="absolute top-2 right-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">IN STOCK</div>
                    : <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">OUT OF STOCK</div>}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors mb-1">{p.name}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{p.description || 'Premium bleaching chemical for professional fabric processing'}</p>

                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">4.{3 + (index % 6)} <svg className="w-3 h-3 ml-0.5 inline" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg></div>
                    <span className="text-xs text-gray-400">({50 + index * 8})</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">{p.ratePerMeter} p</span>
                        <span className="text-sm text-gray-500 ml-1">/meter</span>
                      </div>
                      <span className={'text-xs font-bold px-2 py-1 rounded ' + (p.stockQuantity > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700')}>
                        {p.stockQuantity > 0 ? `${p.stockQuantity} units` : 'Unavailable'}
                      </span>
                    </div>
                    <Link to="/booking"
                      state={{ type: 'product', category: 'bleaching', item: p.name, itemSlug: p._id, price: p.ratePerMeter, unit: 'meter', quantity: 1 }}
                      className={'w-full py-2.5 rounded-lg font-bold text-sm text-center block transition-all ' + (p.stockQuantity > 0 ? 'bg-teal-600 text-white hover:bg-teal-700 active:scale-[0.98]' : 'bg-gray-100 text-gray-400 pointer-events-none')}>
                      {p.stockQuantity > 0 ? 'BUY NOW' : 'OUT OF STOCK'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 mt-8">
        <div className="container mx-auto px-4 py-10 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Need Custom Bleaching Solutions?</h3>
          <p className="text-teal-100 mb-6">Contact us for bulk orders and custom chemical formulations</p>
          <Link to="/contact" className="inline-block px-8 py-3 bg-white text-teal-700 font-bold rounded-lg hover:bg-teal-50 transition-colors">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}
