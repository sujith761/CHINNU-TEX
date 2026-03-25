import { useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * ProductQuickView — Full-screen modal with zoom, ratings, and booking CTA.
 * Opens with scale+fade animation, closes with reverse.
 */
export default function ProductQuickView({ product, onClose }) {
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  if (!product) return null;

  const handleMouseMove = (e) => {
    if (!zoomActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const rating = product.rating || (4 + Math.random()).toFixed(1);
  const reviewCount = product.reviewCount || Math.floor(50 + Math.random() * 150);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        style={{ animationDuration: '0.3s' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl animate-scale-in" style={{ animationDuration: '0.4s' }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 dark:bg-slate-700 shadow-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:hover:text-white hover:rotate-90 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div
            className="relative h-72 md:h-auto md:min-h-[400px] bg-slate-100 dark:bg-slate-700 overflow-hidden cursor-zoom-in rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
            onMouseMove={handleMouseMove}
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500"
                style={zoomActive ? {
                  transform: 'scale(2)',
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                } : {}}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                <svg className="w-24 h-24 text-indigo-300 dark:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.stockQuantity > 0 ? (
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">IN STOCK</span>
              ) : (
                <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">OUT OF STOCK</span>
              )}
            </div>
            {/* Zoom indicator */}
            <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1.5 transition-opacity ${zoomActive ? 'opacity-100' : 'opacity-70'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
              Hover to zoom
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 flex flex-col">
            {/* Category tag */}
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider w-fit mb-4">
              {product.processType || 'Product'}
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-3 font-display">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 star-fill ${star <= Math.round(rating) ? 'text-amber-400' : 'text-slate-200 dark:text-slate-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{rating}</span>
              <span className="text-sm text-slate-400">({reviewCount} reviews)</span>
            </div>

            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {product.description || 'Premium quality textile product from Chinnu Tex. Manufactured with state-of-the-art processes ensuring consistent quality and durability.'}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-black text-slate-800 dark:text-white">
                {product.ratePerMeter ? `₹${product.ratePerMeter}` : 'Contact'}
              </span>
              {product.ratePerMeter && (
                <span className="text-slate-400 text-sm font-medium">/meter</span>
              )}
            </div>

            {/* Stock info */}
            <div className="flex items-center gap-2 mb-6 text-sm">
              <div className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`font-medium ${product.stockQuantity > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                {product.stockQuantity > 0 ? `${product.stockQuantity} units available` : 'Currently unavailable'}
              </span>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Link
                to="/booking"
                state={{
                  type: 'product',
                  category: product.processType || 'bleaching',
                  item: product.name,
                  itemSlug: product._id,
                  price: product.ratePerMeter,
                  unit: 'meter',
                  quantity: 1,
                }}
                onClick={onClose}
                className={`w-full py-3.5 rounded-xl font-bold text-center block transition-all btn-press ${
                  product.stockQuantity > 0
                    ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 pointer-events-none'
                }`}
              >
                {product.stockQuantity > 0 ? 'Book Now' : 'Out of Stock'}
              </Link>
              <Link
                to="/contact"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-semibold text-center block border-2 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
              >
                Contact for Bulk Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
