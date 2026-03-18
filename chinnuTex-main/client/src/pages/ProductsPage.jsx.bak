import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProductsPage() {
  const [bleachingProducts, setBleachingProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const bleach = await api.get('/products?processType=bleaching');
      setBleachingProducts(bleach.data);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-accent-light/40 to-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Our Products
          </h1>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Premium quality bleaching chemicals for professional fabric processing
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Bleaching Section */}
        <section id="bleaching" className="mb-20">
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Bleaching Chemicals</h2>
              <p className="text-gray-600 mt-1">Professional whitening solutions for all fabric types</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bleachingProducts.map((p, index) => (
              <div
                key={p._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-blue-100 hover:border-blue-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Product Image */}
                {p.imageUrl && (
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-100">
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Bleaching
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Availability</div>
                      <div className={`text-sm font-bold ${p.stockQuantity > 0 ? 'text-blue-600' : 'text-rose-600'}`}>
                        {p.stockQuantity > 0 ? `Stock: ${p.stockQuantity} units` : 'Not in Stock'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1 text-right">Rate/meter</div>
                      <div className="text-xl font-extrabold text-green-600 text-right">
                        {p.ratePerMeter} p
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <div className="mt-20 text-center max-w-4xl mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Ready to Place Your Order?</h3>
          <p className="text-base text-purple-100 mb-8">Select your products and get started with professional fabric processing</p>
          <a
            href="/booking"
            className="inline-block bg-white text-purple-600 px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}
