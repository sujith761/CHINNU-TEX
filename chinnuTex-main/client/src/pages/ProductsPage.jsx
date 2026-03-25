import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { SkeletonProductCard } from '../components/SkeletonLoader';
import ProductQuickView from '../components/ProductQuickView';
import { useScrollReveal, useScrollRevealChildren } from '../hooks/useScrollReveal';

export default function ProductsPage() {
  const [bleachingProducts, setBleachingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const headerReveal = useScrollReveal({ threshold: 0.1 });
  const productsGridRef = useScrollRevealChildren({ staggerDelay: 100 });

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
    .filter(p => {
      if (stockFilter === 'in-stock') return p.stockQuantity > 0;
      if (stockFilter === 'out-of-stock') return p.stockQuantity <= 0;
      return true;
    })
    .filter(p => {
      if (priceRange === 'under-5') return (p.ratePerMeter || 0) < 5;
      if (priceRange === '5-10') return (p.ratePerMeter || 0) >= 5 && (p.ratePerMeter || 0) <= 10;
      if (priceRange === 'over-10') return (p.ratePerMeter || 0) > 10;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.ratePerMeter || 0) - (b.ratePerMeter || 0);
      if (sortBy === 'price-high') return (b.ratePerMeter || 0) - (a.ratePerMeter || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">

      {/* ═══ Banner ═══ */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 pt-28 pb-10 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-[60px]" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-[60px]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-2 text-indigo-200 text-sm mb-4 animate-fade-in-up">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            <span className="text-white font-medium">Products</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="animate-fade-in-up delay-100">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Bleaching Chemicals</h1>
              <p className="text-indigo-200 text-sm md:text-base">Professional whitening solutions for all fabric types</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-sm w-full animate-fade-in-up delay-200">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white placeholder-indigo-200 focus:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <svg className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Toolbar ═══ */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{filtered.length}</strong> products
            </span>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filterOpen
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <option value="default">Sort by: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
        
        {/* Animated Filter Panel */}
        <div className={`overflow-hidden transition-all duration-500 ${filterOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="container mx-auto px-4 py-4 border-t border-slate-100 dark:border-slate-700 flex flex-wrap gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Price Range</label>
              <div className="flex gap-2">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'Under ₹5', value: 'under-5' },
                  { label: '₹5 – ₹10', value: '5-10' },
                  { label: 'Over ₹10', value: 'over-10' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPriceRange(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      priceRange === opt.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Availability</label>
              <div className="flex gap-2">
                {[
                  { label: 'All', value: 'all' },
                  { label: 'In Stock', value: 'in-stock' },
                  { label: 'Out of Stock', value: 'out-of-stock' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setStockFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      stockFilter === opt.value
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Offers Banner ═══ */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border-b border-amber-200 dark:border-amber-800/30">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 overflow-x-auto text-sm">
          <span className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-bounce-subtle">OFFERS</span>
          <span className="text-slate-700 dark:text-slate-300 flex-shrink-0">Bulk discounts on 100+ units</span>
          <span className="text-slate-300 dark:text-slate-600 flex-shrink-0">|</span>
          <span className="text-slate-700 dark:text-slate-300 flex-shrink-0">Free delivery on ₹5,000+</span>
          <span className="text-slate-300 dark:text-slate-600 flex-shrink-0">|</span>
          <span className="text-slate-700 dark:text-slate-300 flex-shrink-0">Quality guaranteed</span>
        </div>
      </div>

      {/* ═══ Products Grid ═══ */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          /* Skeleton Loading State */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonProductCard key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-16 text-center border border-slate-100 dark:border-slate-700">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <svg className="w-10 h-10 text-slate-300 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No products found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" ref={productsGridRef}>
            {filtered.map((p, index) => (
              <div
                key={p._id || index}
                className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col card-premium reveal-up cursor-pointer"
                onClick={() => setQuickViewProduct(p)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-700 card-image-zoom">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                      <svg className="w-16 h-16 text-indigo-300 dark:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-lg">
                    Bleaching
                  </div>
                  {p.stockQuantity > 0
                    ? <div className="absolute top-3 right-3 px-2.5 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-lg">IN STOCK</div>
                    : <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">OUT OF STOCK</div>
                  }

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-4">
                    <span className="px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full text-sm font-bold text-slate-800 dark:text-white shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      Quick View
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {p.description || 'Premium bleaching chemical for professional fabric processing'}
                  </p>

                  {/* Star Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 star-fill transition-all ${star <= 4 ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">4.{3 + (index % 6)}</span>
                    <span className="text-xs text-slate-400">({50 + index * 8})</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">{p.ratePerMeter}</span>
                        <span className="text-sm text-slate-500 ml-1">₹/m</span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        p.stockQuantity > 0
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {p.stockQuantity > 0 ? `${p.stockQuantity} units` : 'Unavailable'}
                      </span>
                    </div>
                    <Link
                      to="/booking"
                      state={{ type: 'product', category: 'bleaching', item: p.name, itemSlug: p._id, price: p.ratePerMeter, unit: 'meter', quantity: 1 }}
                      onClick={(e) => e.stopPropagation()}
                      className={`w-full py-3 rounded-xl font-bold text-sm text-center block transition-all btn-press ${
                        p.stockQuantity > 0
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-400 pointer-events-none'
                      }`}
                    >
                      {p.stockQuantity > 0 ? 'Book Now' : 'Out of Stock'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ CTA Banner ═══ */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 py-14 text-center relative z-10">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Need Custom Solutions?</h3>
          <p className="text-indigo-100 mb-6 max-w-md mx-auto">Contact us for bulk orders and custom chemical formulations tailored to your needs.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 hover:shadow-lg hover:-translate-y-0.5 transition-all btn-press">
            Contact Sales
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
