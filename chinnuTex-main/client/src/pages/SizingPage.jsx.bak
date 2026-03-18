import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { pricingApi } from '../services/api';

export default function SizingPage() {
  const [yarnTypes, setYarnTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantities, setQuantities] = useState({});

  const incrementQuantity = (slug) => {
    setQuantities(prev => ({
      ...prev,
      [slug]: (prev[slug] || 0) + 1
    }));
  };

  const decrementQuantity = (slug) => {
    setQuantities(prev => ({
      ...prev,
      [slug]: Math.max(0, (prev[slug] || 0) - 1)
    }));
  };

  // High-quality textile yarn images
  const yarnImages = {
    'cotton': 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=400&fit=crop&q=80',
    'polyester': 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=600&h=400&fit=crop&q=80',
    'viscose': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&h=400&fit=crop&q=80',
    'pc-blend': 'https://images.unsplash.com/photo-1612731486606-2614b4d97e3d?w=600&h=400&fit=crop&q=80',
    'pv-blend': 'https://images.unsplash.com/photo-1606501126768-b380d4169ab6?w=600&h=400&fit=crop&q=80',
    'nylon': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    'acrylic': 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&h=400&fit=crop&q=80'
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
        // Fallback to hardcoded data
        setYarnTypes([
          { yarnType: 'Cotton', slug: 'cotton', pricePerKg: 450 },
          { yarnType: 'Polyester', slug: 'polyester', pricePerKg: 520 },
          { yarnType: 'Viscose', slug: 'viscose', pricePerKg: 480 },
          { yarnType: 'PC Blend', slug: 'pc-blend', pricePerKg: 510 },
          { yarnType: 'PV Blend', slug: 'pv-blend', pricePerKg: 490 },
          { yarnType: 'Nylon', slug: 'nylon', pricePerKg: 550 },
          { yarnType: 'Acrylic', slug: 'acrylic', pricePerKg: 470 }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-sky-200">
      {/* Dynamic Liquid Background Hero */}
      <div className="relative overflow-hidden bg-slate-900 text-white py-32 lg:py-48">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[70%] bg-sky-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 backdrop-blur-sm">
            <span className="text-sky-300 text-sm font-semibold tracking-widest uppercase">Industrial Grade Strength</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300 drop-shadow-sm">
            Advanced Sizing Solutions
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Engineered coatings for superior yarn performance. Experience the pinnacle of smooth, abrasion-resistant textile processing.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products" className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(2,132,199,0.3)] hover:shadow-[0_0_30px_rgba(2,132,199,0.5)] transform hover:-translate-y-1">
              Explore Products
            </a>
            <Link to="/contact" className="px-8 py-4 bg-transparent border border-white/20 hover:bg-white/10 text-white rounded-full font-semibold transition-all backdrop-blur-sm">
              Contact Expert
            </Link>
          </div>
        </div>
      </div>

      {/* Stats / Value Prop Section */}
      <div className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "20% Higher Efficiency", desc: "Reduce downtime with stronger yarn", icon: (
                  <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                )
              },
              {
                title: "Zero Abrasion", desc: "Perfectly smooth coating application", icon: (
                  <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )
              },
              {
                title: "Eco-Friendly", desc: "Sustainable chemical processes", icon: (
                  <svg className="w-8 h-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                )
              }
            ].map((stat, i) => (
              <div key={i} className="flex items-start space-x-4 p-6 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                <div className="flex-shrink-0 p-3 bg-sky-50 rounded-xl">
                  {stat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{stat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div id="products" className="container mx-auto px-4 py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Premium Sizing Catalog</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Select from our specialized range of sizing formulas, each tailored for specific yarn characteristics to ensure weaving perfection.
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32">
            <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sky-600 font-medium animate-pulse">Loading catalog...</p>
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto p-6 bg-red-50 rounded-xl border border-red-100 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="text-sm font-semibold text-red-700 underline hover:text-red-800">Try Again</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {yarnTypes.map((yarn, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-sky-300 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-100 flex flex-col"
              >
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors z-10"></div>
                  <img
                    src={yarnImages[yarn.slug]}
                    alt={yarn.yarnType}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Badge */}
                  <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm">
                    PREMIUM GRADE
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow relative bg-white">

                  <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                    {yarn.yarnType}
                  </h3>
                  <div className="h-1 w-12 bg-sky-500 rounded-full mb-4 group-hover:w-20 transition-all duration-300"></div>

                  <p className="text-slate-500 text-sm mb-6 flex-grow">
                    High-performance sizing compound specifically formulated for {yarn.yarnType.toLowerCase()} fibers, enhancing tensile strength.
                  </p>

                  {/* Price Block */}
                  <div className="flex items-end justify-between mb-8 pb-8 border-b border-slate-100">
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Market Price</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-slate-900">₹{yarn.pricePerKg}</span>
                        <span className="text-sm text-slate-500 font-medium">/kg</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Stock Available</p>
                      <span className={`text-sm font-bold ${yarn.stockQuantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {yarn.stockQuantity > 0 ? `${yarn.stockQuantity} kg` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  {/* Interaction Area */}
                  <div className="space-y-4">
                    {(quantities[yarn.slug] || 0) > 0 && (
                      <div className="flex justify-between items-center bg-sky-50 px-4 py-3 rounded-xl border border-sky-100">
                        <span className="text-sm font-semibold text-sky-800">Total:</span>
                        <span className="text-lg font-bold text-sky-900">₹{(yarn.pricePerKg * quantities[yarn.slug]).toFixed(2)}</span>
                      </div>
                    )}

                    {(quantities[yarn.slug] || 0) === 0 ? (
                      <button
                        onClick={() => incrementQuantity(yarn.slug)}
                        disabled={yarn.stockQuantity <= 0}
                        className={`w-full py-4 rounded-xl font-bold transition-colors duration-300 flex items-center justify-center gap-2 group/btn ${yarn.stockQuantity > 0
                          ? 'bg-slate-900 text-white hover:bg-sky-600'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                      >
                        <span>{yarn.stockQuantity > 0 ? 'Start Order' : 'Notify Me'}</span>
                        <svg className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </button>
                    ) : (
                      <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1">
                          <button
                            onClick={() => decrementQuantity(yarn.slug)}
                            className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-sky-600 transition-colors"
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                          </button>
                          <span className="text-xl font-bold text-slate-900">
                            {quantities[yarn.slug]} <span className="text-sm text-slate-500 font-normal">kg</span>
                          </span>
                          <button
                            onClick={() => {
                              if ((quantities[yarn.slug] || 0) < yarn.stockQuantity) {
                                incrementQuantity(yarn.slug);
                              }
                            }}
                            className={`w-12 h-12 flex items-center justify-center rounded-lg shadow-md text-white transition-colors ${(quantities[yarn.slug] || 0) < yarn.stockQuantity
                                ? 'bg-sky-600 hover:bg-sky-700'
                                : 'bg-slate-300 cursor-not-allowed'
                              }`}
                          >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          </button>
                        </div>
                        <Link
                          to="/booking"
                          state={{
                            type: 'product',
                            category: 'sizing',
                            item: yarn.yarnType,
                            itemSlug: yarn.slug,
                            price: yarn.pricePerKg,
                            unit: 'kg',
                            quantity: quantities[yarn.slug]
                          }}
                          className="w-full py-4 rounded-xl bg-sky-600 text-white font-bold hover:bg-sky-500 transition-colors shadow-lg shadow-sky-200 text-center"
                        >
                          Proceed to Book
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to Strengthen Your Production?</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-12 text-lg">
            Join hundreds of textile manufacturers who trust our sizing solutions for their premium yarn needs.
          </p>
          <Link
            to="/booking"
            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-sky-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start a New Project
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

